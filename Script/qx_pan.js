/*
hostname = api.aliyundrive.com
[rewrite]
# 配置后，关闭阿里云盘重新进入获取refreshToken，获取后关闭脚本
^https:\/\/api.aliyundrive.com\/users\/v1\/users\/device\/create_session url script-request-body qx_pan.js

^http://(aliyun|quark|pikpak)\.example\.com url script-analyze-echo-response qx_pan.js

*/
const tk = new ToolKit(`qx_pan`, `qx_pan`, { httpApi: "" });
let url = $request.url;
let body = $request.body;
let type = url.match(/aliyun|pikpak|quark/)[0];
let debug = true;
var myResponse = {
  status: "HTTP/1.1 200 OK",
  body: "",
};
switch (type) {
  case "aliyun":
    if (url.indexOf("create_session") > 0) {
      aliyun_get_token();
    } else {
      aliyun();
    }
    break;
  case "pikpak":
    pikpak();
    break;
  case "quark":
    quark();
    break;
  default:
    $done({});
}
function aliyun_get_token() {
  let token_json = JSON.parse(body);
  $prefs.setValueForKey(token_json.refreshToken, "ali_refresh_token");
  tk.appendNotifyInfo("🎉成功获取aliyun refreshToken, 可以关闭相应脚本");
  tk.msg('');
  tk.done()
}
function aliyun() {
  let jsonTk = $prefs.valueForKey("ali_token")?.split(",") || [];
  let access_token = "Bearer " + jsonTk[0];
  let refresh_token = jsonTk[1];
  let default_drive_id = jsonTk[2];
  let req = {
    url: "https://api.aliyundrive.com/adrive/v3/file/list",
    headers: {
      Authorization: access_token,
      "Content-Type": "application/json",
    },
  };
  !(async () => {
    switch (url.match(/(auth|entry)\.cgi$/)?.[0]) {
      case "auth.cgi":
        try {
          let password = $prefs.valueForKey('ali_refresh_token') || refresh_token || body.match(/passwd=([^&]*)/)[1];
          req.url = "https://auth.aliyundrive.com/v2/account/token";
          req.body = `{"refresh_token":"${password}","grant_type":"refresh_token"}`;
          let auth_json = await http(req, "post");
          let jstk = `${auth_json.access_token},${auth_json.refresh_token},${auth_json.default_drive_id}`;
          $prefs.setValueForKey(jstk, "ali_token");
          let obj = {
            success: true,
            data: {
              sid: auth_json.access_token,
            },
          };
          myResponse.body = JSON.stringify(obj);
          $done(myResponse);
          // $done({
          //   status: 200,
          //   body: `{"success":true,"data":{"sid":"${auth_json.access_token}"}}`,
          // });
        } catch (err) {
          console.log("err-" + err);
          $done();
        }
        break;
      case "entry.cgi":
        try {
          if (body.match("Delete&")) {
            let id = body.match(/path=([^&]+)/)[1];
            req.url = "https://api.aliyundrive.com/v3/batch";
            req.body = `{"resource":"file","requests":[{"method":"POST","headers":{"Content-Type":"application\/json"},"id":"${id}","body":{"file_id":"${id}","drive_id":"${default_drive_id}"},"url":"\/recyclebin\/trash"}]}`;
            $done(req);
          } else if (body.match("method=get")) {
            photo();
          } else {
            let parent_file_id = "root";
            let path = body.match(/folder_path=([^&]+)/)?.[1];
            let a = path
              ? ((req.url = req.url.replace(/(parent_id=)/, `$1${path}`)),
                (parent_file_id = path),
                "files")
              : "shares";
            let _body = {
              fields: "*",
              drive_id: default_drive_id,
              order_direction: "DESC",
              order_by: "updated_at",
              limit: 100,
              parent_file_id: parent_file_id,
              all: false,
            };
            req.body = JSON.stringify(_body);
            let shares = [];
            do {
              var { items, next_marker } = await http(req, "post");
              let data = items.map((item) => {
                return {
                  isdir: item.type === "folder",
                  path: item.file_id,
                  name: item.name,
                  additional: { size: item.size },
                  url: item.url,
                };
              });
              shares = shares.concat(data);
              if (next_marker) {
                _body.marker = next_marker;
                req.body = JSON.stringify(_body);
              }
            } while (next_marker);
            shares = JSON.stringify(shares);
            $prefs.setValueForKey(shares, "ail_file");
            $done({
              status: "HTTP/1.1 200 OK",
              body: `{"success":true,"data":{"total":0,"offset":0,"${a}":${shares}}}`,
            });
          }
        } catch (err) {
          console.log("err-" + err);
          $done();
        }
        break;
      default:
        try {
          let fileid = url.match("fbdownload")
            ? hex2str(url.match(/dlink=%22(.*)%22/)[1])
            : url.match(/path=(.*$)/)[1];
          // $request.url = JSON.parse($prefs.valueForKey("ail_file"))
          //   .filter((x) => x.path === fileid)[0]
          //   .url.replace(/https/, "http");
          // $request.headers.Referer = "https://www.aliyundrive.com/";
          // delete $request.headers.Host;
          let m3u8_url = JSON.parse($prefs.valueForKey("ail_file"))
            .filter((x) => x.path === fileid)[0]
            .url.replace(/https/, "http");
          myResponse.headers = {
            Location: m3u8_url,
            Referer: "https://www.aliyundrive.com/",
          };
          myResponse.status = "HTTP/1.1 302 OK";
          $done(myResponse);
        } catch (err) {
          console.log("err-" + err);
          $done();
        }
    }
  })().catch(() => $done());
}
function pikpak() {
  let _url = [
    "https://api-drive.mypikpak.com/drive/v1/files?filters=%7B%22phase%22%3A%7B%22eq%22%3A%22PHASE_TYPE_COMPLETE%22%7D%2C%22trashed%22%3A%7B%22eq%22%3Afalse%7D%7D",
    "",
    "&parent_id=",
    "",
    "&thumbnail_size=SIZE_LARGE",
  ];
  let req = {
    url: _url.join(""),
    headers: { authorization: $prefs.valueForKey("pikpak-ck") },
  };
  !(async () => {
    switch (url.match(/(auth|entry)\.cgi$/)?.[0]) {
      case "auth.cgi":
        body = decodeURIComponent(body);
        let username = body.match(/account=([^&]+)/)[1];
        let password = body.match(/passwd=([^&]+)/)[1];
        let token =
          "Bearer " +
          (
            await http(
              {
                url: "https://user.mypikpak.com/v1/auth/signin",
                body: `{"client_id":"YNxT9w7GMdWvEOKa","username":"${username}","password":"${password}"}`,
              },
              "post"
            )
          )?.["access_token"];
        $prefs.setValueForKey(token, `pikpak-ck`);
        $done({
          status: 200,
          body: `{"success":true,"data":{"sid":"${token}"}}`,
        });
        break;
      case "entry.cgi":
        if (body.match("Delete&")) {
          req.url = "https://api-drive.mypikpak.com/drive/v1/files:batchTrash";
          req.body = `{"ids":["${body.match(/path=([^&]+)/)[1]}"]}`;
          $done(req);
        } else if (body.match("method=get")) {
          photo();
        } else {
          let path = body.match(/folder_path=([^&]+)/)?.[1];
          let a = path ? ((_url[3] = path), "files") : "shares";
          let shares = [];
          do {
            req.url = _url.join("");
            var { files, next_page_token } = await http(req);
            let data = files.map((item) => {
              return {
                isdir: !item.file_extension,
                path: item.id,
                name: item.name,
                additional: { size: parseInt(item.size) },
              };
            });
            if (next_page_token) {
              _url[1] = "&page_token=" + next_page_token;
            }
            shares = shares.concat(data);
          } while (next_page_token);
          $done({
            response: {
              status: 200,
              body: JSON.stringify({
                success: true,
                data: { total: 0, offset: 0, [a]: shares },
              }),
            },
          });
        }
        break;
      default:
        let fids = url.match("fbdownload")
          ? hex2str(url.match(/dlink=%22(.*)%22/)[1])
          : url.match(/path=(.*$)/)[1];
        req.url = `https://api-drive.mypikpak.com/drive/v1/files/${fids}?&thumbnail_size=SIZE_LARGE`;
        link = (await http(req)).links["application/octet-stream"].url.replace(
          /https/,
          "http"
        );
        $done({ status: 302, headers: { Location: link } });
    }
  })().catch(() => $done());
}
function quark() {
  let ck = $prefs.valueForKey("quark-ck");
  let _url = [
    "https://drive.quark.cn/1/clouddrive/file/sort?_fetch_total=1&_page=",
    "1",
    "&_size=100&fr=pc&pdir_fid=",
    0,
    "&pr=ucpro",
  ];
  let req = {
    url: _url.join(""),
    headers: { cookie: ck, "content-type": "application/json" },
  };
  !(async () => {
    switch (url.match(/(auth|entry)\.cgi$/)?.[0]) {
      case "auth.cgi":
        ck = decodeURIComponent(body.match(/passwd=([^&]+)/)[1]);
        $prefs.setValueForKey(ck, "quark-ck");
        $done({
          status: 200,
          body: `{"success":true,"data":{"sid":"${ck}"}}`,
        });
        break;
      case "entry.cgi":
        if (body.match("Delete&")) {
          req.url =
            "https://drive.quark.cn/1/clouddrive/file/delete?fr=pc&pr=ucpro";
          req.body = `{"action_type":1,"exclude_fids":[],"filelist":["${
            body.match(/path=([^&]+)/)[1]
          }"]}`;
          $done(req);
        } else if (body.match("method=get")) {
          photo();
        } else {
          let path = body.match(/folder_path=([^&]+)/)?.[1];
          let a = path ? ((_url[3] = path), "files") : "shares";
          let shares = [];
          do {
            req.url = _url.join("");
            var {
              metadata: { _total },
              data: { list },
            } = await http(req, "get", 1, ck);
            let data = list.map((item) => {
              return {
                isdir: !item.file,
                path: item.fid,
                name: item.file_name,
                additional: { size: item.size },
              };
            });
            shares = shares.concat(data);
          } while (_url[1] < parseInt(_total / 100) + 1 && _url[1]++);
          $done({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: { total: 0, offset: 0, [a]: shares },
            }),
          });
        }
        break;
      default:
        let fids = url.match("fbdownload")
          ? hex2str(url.match(/dlink=%22(.*)%22/)[1])
          : url.match(/path=(.*$)/)[1];
        req.url =
          "http://drive.quark.cn/1/clouddrive/file/download?fr=pc&pr=ucpro";
        req.body = `{"fids":["${fids}"]}`;
        let link = (await http(req, "post")).data[0].download_url.replace(
          /https/,
          "http"
        );
        $request.url = link;
        $request.headers.cookie = ck;
        delete $request.headers.Host;
        $done($request);
    }
  })().catch(() => $done());
}
function photo() {
  $done({
    response: {
      method: "GET",
      status: 301,
      headers: {
        Location: `http://${type}.example.com:5000/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&mode=open&path=${
          body.match(/path=([^&?]+)/)[1]
        }`,
      },
    },
  });
}
function hex2str(hex) {
  try {
    var trimedStr = hex.trim();
    var rawStr =
      trimedStr.substr(0, 2).toLowerCase() === "0x"
        ? trimedStr.substr(2)
        : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
      return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
  } catch (error) {
    console.log(error);
    return "";
  }
}
function http(req, method = "get", set, ck) {
  req["method"] = method;
  try {
    return new Promise((res, jct) => {
      $task.fetch(req).then((resp) => {
        try {
          set &&
            (set = resp.headers?.["Set-Cookie"]?.split(";")[0]) &&
            $prefs.setValueForKey(ck.replace(/[^;]+/, set), "quark-ck");
          resp?.statusCode === 200 ? res(JSON.parse(resp.body)) : jct();
        } catch (error) {
          console.log("error " + error);
          return jct();
        }
      });
    });
  } catch (error) {
    return new Promise((res) => {
      res();
    });
  }
}

function llog(r) {
  if (!debug) {
    return;
  }
  if (r == null) {
    console.log("null");
  } else if (typeof r == "string") {
    console.log(r);
  } else {
    console.log(JSON.stringify(r));
  }
}

function ToolKit(t, s, i) { return new (class { constructor(t, s, i) { this.tgEscapeCharMapping = { "&": "＆", "#": "＃" }; this.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`; this.prefix = `lk`; this.name = t; this.id = s; this.data = null; this.dataFile = this.getRealPath(`${this.prefix}${this.id}.dat`); this.boxJsJsonFile = this.getRealPath( `${this.prefix}${this.id}.boxjs.json` ); this.options = i; this.isExecComm = false; this.isEnableLog = this.getVal(`${this.prefix}IsEnableLog${this.id}`); this.isEnableLog = this.isEmpty(this.isEnableLog) ? true : JSON.parse(this.isEnableLog); this.isNotifyOnlyFail = this.getVal( `${this.prefix}NotifyOnlyFail${this.id}` ); this.isNotifyOnlyFail = this.isEmpty(this.isNotifyOnlyFail) ? false : JSON.parse(this.isNotifyOnlyFail); this.isEnableTgNotify = this.getVal( `${this.prefix}IsEnableTgNotify${this.id}` ); this.isEnableTgNotify = this.isEmpty(this.isEnableTgNotify) ? false : JSON.parse(this.isEnableTgNotify); this.tgNotifyUrl = this.getVal(`${this.prefix}TgNotifyUrl${this.id}`); this.isEnableTgNotify = this.isEnableTgNotify ? !this.isEmpty(this.tgNotifyUrl) : this.isEnableTgNotify; this.costTotalStringKey = `${this.prefix}CostTotalString${this.id}`; this.costTotalString = this.getVal(this.costTotalStringKey); this.costTotalString = this.isEmpty(this.costTotalString) ? `0,0` : this.costTotalString.replace('"', ""); this.costTotalMs = this.costTotalString.split(",")[0]; this.execCount = this.costTotalString.split(",")[1]; this.costTotalMs = this.isEmpty(this.costTotalMs) ? 0 : parseInt(this.costTotalMs); this.execCount = this.isEmpty(this.execCount) ? 0 : parseInt(this.execCount); this.logSeparator = "\n██"; this.startTime = new Date().getTime(); this.node = (() => { if (this.isNode()) { const t = require("request"); return { request: t }; } else { return null; } })(); this.execStatus = true; this.notifyInfo = []; this.log(`${this.name}, 开始执行!`); this.execComm(); } getRealPath(t) { if (this.isNode()) { let s = process.argv.slice(1, 2)[0].split("/"); s[s.length - 1] = t; return s.join("/"); } return t; } async execComm() { if (this.isNode()) { this.comm = process.argv.slice(1); let t = false; if (this.comm[1] == "p") { this.isExecComm = true; this.log(`开始执行指令【${this.comm[1]}】=> 发送到手机测试脚本！`); if ( this.isEmpty(this.options) || this.isEmpty(this.options.httpApi) ) { this.log(`未设置options，使用默认值`); if (this.isEmpty(this.options)) { this.options = {}; } this.options.httpApi = `ffff@10.0.0.9:6166`; } else { if (!/.*?@.*?:[0-9]+/.test(this.options.httpApi)) { t = true; this.log(`❌httpApi格式错误！格式：ffff@3.3.3.18:6166`); this.done(); } } if (!t) { this.callApi(this.comm[2]); } } } } callApi(t) { let s = this.comm[0]; this.log(`获取【${s}】内容传给手机`); let i = ""; this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const e = this.path.resolve(s); const o = this.path.resolve(process.cwd(), s); const h = this.fs.existsSync(e); const r = !h && this.fs.existsSync(o); if (h || r) { const t = h ? e : o; try { i = this.fs.readFileSync(t); } catch (t) { i = ""; } } else { i = ""; } let n = { url: `http://${ this.options.httpApi.split("@")[1] }/v1/scripting/evaluate`, headers: { "X-Key": `${this.options.httpApi.split("@")[0]}` }, body: { script_text: `${i}`, mock_type: "cron", timeout: !this.isEmpty(t) && t > 5 ? t : 5, }, json: true, }; this.post(n, (t, i, e) => { this.log(`已将脚本【${s}】发给手机！`); this.done(); }); } getCallerFileNameAndLine() { let t; try { throw Error(""); } catch (s) { t = s; } const s = t.stack; const i = s.split("\n"); let e = 1; if (e !== 0) { const t = i[e]; this.path = this.path ? this.path : require("path"); return `[${t.substring( t.lastIndexOf(this.path.sep) + 1, t.lastIndexOf(":") )}]`; } else { return "[-]"; } } getFunName(t) { var s = t.toString(); s = s.substr("function ".length); s = s.substr(0, s.indexOf("(")); return s; } boxJsJsonBuilder(t, s) { if (this.isNode()) { if (!this.isJsonObject(t) || !this.isJsonObject(s)) { this.log("构建BoxJsJson传入参数格式错误，请传入json对象"); return; } this.log("using node"); let i = ["settings", "keys"]; const e = "https://raw.githubusercontent.com/Orz-3"; let o = {}; let h = "#lk{script_url}"; if (s && s.hasOwnProperty("script_url")) { h = this.isEmpty(s["script_url"]) ? "#lk{script_url}" : s["script_url"]; } o.id = `${this.prefix}${this.id}`; o.name = this.name; o.desc_html = `⚠️使用说明</br>详情【<a href='${h}?raw=true'><font class='red--text'>点我查看</font></a>】`; o.icons = [ `${e}/mini/master/Alpha/${this.id.toLocaleLowerCase()}.png`, `${e}/mini/master/Color/${this.id.toLocaleLowerCase()}.png`, ]; o.keys = []; o.settings = [ { id: `${this.prefix}IsEnableLog${this.id}`, name: "开启/关闭日志", val: true, type: "boolean", desc: "默认开启", }, { id: `${this.prefix}NotifyOnlyFail${this.id}`, name: "只当执行失败才通知", val: false, type: "boolean", desc: "默认关闭", }, { id: `${this.prefix}IsEnableTgNotify${this.id}`, name: "开启/关闭Telegram通知", val: false, type: "boolean", desc: "默认关闭", }, { id: `${this.prefix}TgNotifyUrl${this.id}`, name: "Telegram通知地址", val: "", type: "text", desc: "Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text=", }, ]; o.author = "#lk{author}"; o.repo = "#lk{repo}"; o.script = `${h}?raw=true`; if (!this.isEmpty(t)) { for (let s in i) { let e = i[s]; if (!this.isEmpty(t[e])) { if (e === "settings") { for (let s = 0; s < t[e].length; s++) { let i = t[e][s]; for (let t = 0; t < o.settings.length; t++) { let s = o.settings[t]; if (i.id === s.id) { o.settings.splice(t, 1); } } } } o[e] = o[e].concat(t[e]); } delete t[e]; } } Object.assign(o, t); if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.boxJsJsonFile); const i = this.path.resolve(process.cwd(), this.boxJsJsonFile); const e = this.fs.existsSync(t); const h = !e && this.fs.existsSync(i); const r = JSON.stringify(o, null, "\t"); if (e) { this.fs.writeFileSync(t, r); } else if (h) { this.fs.writeFileSync(i, r); } else { this.fs.writeFileSync(t, r); } let n = "/Users/lowking/Desktop/Scripts/lowking.boxjs.json"; if (s.hasOwnProperty("target_boxjs_json_path")) { n = s["target_boxjs_json_path"]; } let a = JSON.parse(this.fs.readFileSync(n)); if ( a.hasOwnProperty("apps") && Array.isArray(a["apps"]) && a["apps"].length > 0 ) { let t = a.apps; let i = t.indexOf( t.filter((t) => { return t.id == o.id; })[0] ); if (i >= 0) { a.apps[i] = o; } else { a.apps.push(o); } let e = JSON.stringify(a, null, 2); if (!this.isEmpty(s)) { for (const t in s) { let i = ""; if (s.hasOwnProperty(t)) { i = s[t]; } else if (t === "author") { i = "@lowking"; } else if (t === "repo") { i = "https://github.com/lowking/Scripts"; } e = e.replace(`#lk{${t}}`, i); } } const h = /(?:#lk\{)(.+?)(?=\})/; let r = h.exec(e); if (r !== null) { this.log( `生成BoxJs还有未配置的参数，请参考https://github.com/lowking/Scripts/blob/master/util/example/ToolKitDemo.js#L17-L18传入参数：\n` ); } let l = new Set(); while ((r = h.exec(e)) !== null) { l.add(r[1]); e = e.replace(`#lk{${r[1]}}`, ``); } l.forEach((t) => { console.log(`${t} `); }); this.fs.writeFileSync(n, e); } } } } isJsonObject(t) { return ( typeof t == "object" && Object.prototype.toString.call(t).toLowerCase() == "[object object]" && !t.length ); } appendNotifyInfo(t, s) { if (s == 1) { this.notifyInfo = t; } else { this.notifyInfo.push(t); } } prependNotifyInfo(t) { this.notifyInfo.splice(0, 0, t); } execFail() { this.execStatus = false; } isRequest() { return typeof $request != "undefined"; } isSurge() { return typeof $httpClient != "undefined"; } isQuanX() { return typeof $task != "undefined"; } isLoon() { return typeof $loon != "undefined"; } isJSBox() { return typeof $app != "undefined" && typeof $http != "undefined"; } isStash() { return ( "undefined" !== typeof $environment && $environment["stash-version"] ); } isNode() { return typeof require == "function" && !this.isJSBox(); } sleep(t) { return new Promise((s) => setTimeout(s, t)); } log(t) { if (this.isEnableLog) console.log(`${this.logSeparator}${t}`); } logErr(t) { this.execStatus = true; if (this.isEnableLog) { console.log(`${this.logSeparator}${this.name}执行异常:`); console.log(t); console.log(`\n${t.message}`); } } msg(t, s, i, e) { if (!this.isRequest() && this.isNotifyOnlyFail && this.execStatus) { } else { if (this.isEmpty(s)) { if (Array.isArray(this.notifyInfo)) { s = this.notifyInfo.join("\n"); } else { s = this.notifyInfo; } } if (!this.isEmpty(s)) { if (this.isEnableTgNotify) { this.log(`${this.name}Tg通知开始`); for (let t in this.tgEscapeCharMapping) { if (!this.tgEscapeCharMapping.hasOwnProperty(t)) { continue; } s = s.replace(t, this.tgEscapeCharMapping[t]); } this.get( { url: encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`) }, (t, s, i) => { this.log(`Tg通知完毕`); } ); } else { let o = {}; const h = !this.isEmpty(i); const r = !this.isEmpty(e); if (this.isQuanX()) { if (h) o["open-url"] = i; if (r) o["media-url"] = e; $notify(this.name, t, s, o); } if (this.isSurge() || this.isStash()) { if (h) o["url"] = i; $notification.post(this.name, t, s, o); } if (this.isNode()) this.log("⭐️" + this.name + t + s); if (this.isJSBox()) $push.schedule({ title: this.name, body: t ? t + "\n" + s : s }); } } } } getVal(t) { if (this.isSurge() || this.isLoon() || this.isStash()) { return $persistentStore.read(t); } else if (this.isQuanX()) { return $prefs.valueForKey(t); } else if (this.isNode()) { this.data = this.loadData(); return this.data[t]; } else { return (this.data && this.data[t]) || null; } } setVal(t, s) { if (this.isSurge() || this.isLoon() || this.isStash()) { return $persistentStore.write(s, t); } else if (this.isQuanX()) { return $prefs.setValueForKey(s, t); } else if (this.isNode()) { this.data = this.loadData(); this.data[t] = s; this.writeData(); return true; } else { return (this.data && this.data[t]) || null; } } loadData() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile); const s = this.path.resolve(process.cwd(), this.dataFile); const i = this.fs.existsSync(t); const e = !i && this.fs.existsSync(s); if (i || e) { const e = i ? t : s; try { return JSON.parse(this.fs.readFileSync(e)); } catch (t) { return {}; } } else return {}; } else return {}; } writeData() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile); const s = this.path.resolve(process.cwd(), this.dataFile); const i = this.fs.existsSync(t); const e = !i && this.fs.existsSync(s); const o = JSON.stringify(this.data); if (i) { this.fs.writeFileSync(t, o); } else if (e) { this.fs.writeFileSync(s, o); } else { this.fs.writeFileSync(t, o); } } } adapterStatus(t) { if (t) { if (t.status) { t["statusCode"] = t.status; } else if (t.statusCode) { t["status"] = t.statusCode; } } return t; } get(t, s = () => {}) { if (this.isQuanX()) { if (typeof t == "string") t = { url: t }; t["method"] = "GET"; $task.fetch(t).then( (t) => { s(null, this.adapterStatus(t), t.body); }, (t) => s(t.error, null, null) ); } if (this.isSurge() || this.isLoon() || this.isStash()) $httpClient.get(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); if (this.isNode()) { this.node.request(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); } if (this.isJSBox()) { if (typeof t == "string") t = { url: t }; t["header"] = t["headers"]; t["handler"] = function (t) { let i = t.error; if (i) i = JSON.stringify(t.error); let e = t.data; if (typeof e == "object") e = JSON.stringify(t.data); s(i, this.adapterStatus(t.response), e); }; $http.get(t); } } post(t, s = () => {}) { if (this.isQuanX()) { if (typeof t == "string") t = { url: t }; t["method"] = "POST"; $task.fetch(t).then( (t) => { s(null, this.adapterStatus(t), t.body); }, (t) => s(t.error, null, null) ); } if (this.isSurge() || this.isLoon() || this.isStash()) { $httpClient.post(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); } if (this.isNode()) { this.node.request.post(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); } if (this.isJSBox()) { if (typeof t == "string") t = { url: t }; t["header"] = t["headers"]; t["handler"] = function (t) { let i = t.error; if (i) i = JSON.stringify(t.error); let e = t.data; if (typeof e == "object") e = JSON.stringify(t.data); s(i, this.adapterStatus(t.response), e); }; $http.post(t); } } put(t, s = () => {}) { if (this.isQuanX()) { if (typeof t == "string") t = { url: t }; t["method"] = "PUT"; $task.fetch(t).then( (t) => { s(null, this.adapterStatus(t), t.body); }, (t) => s(t.error, null, null) ); } if (this.isSurge() || this.isLoon() || this.isStash()) { t.method = "PUT"; $httpClient.put(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); } if (this.isNode()) { t.method = "PUT"; this.node.request.put(t, (t, i, e) => { s(t, this.adapterStatus(i), e); }); } if (this.isJSBox()) { if (typeof t == "string") t = { url: t }; t["header"] = t["headers"]; t["handler"] = function (t) { let i = t.error; if (i) i = JSON.stringify(t.error); let e = t.data; if (typeof e == "object") e = JSON.stringify(t.data); s(i, this.adapterStatus(t.response), e); }; $http.post(t); } } costTime() { let t = `${this.name}执行完毕！`; if (this.isNode() && this.isExecComm) { t = `指令【${this.comm[1]}】执行完毕！`; } const s = new Date().getTime(); const i = s - this.startTime; const e = i / 1e3; this.execCount++; this.costTotalMs += i; this.log( `${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${( this.costTotalMs / this.execCount / 1e3 ).toFixed(4)}】秒` ); this.setVal( this.costTotalStringKey, JSON.stringify(`${this.costTotalMs},${this.execCount}`) ); } done(t = {}) { this.costTime(); if (this.isSurge() || this.isQuanX() || this.isLoon() || this.isStash()) { $done(t); } } getRequestUrl() { return $request.url; } getResponseBody() { return $response.body; } getResponseHeaders() { return $response.headers; } getRequestHeaders() { return $request.headers; } isGetCookie(t) { return !!($request.method != "OPTIONS" && this.getRequestUrl().match(t)); } isEmpty(t) { return ( typeof t == "undefined" || t == null || t == "" || t == "null" || t == "undefined" || t.length === 0 ); } randomString(t) { t = t || 32; var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"; var i = s.length; var e = ""; for (let o = 0; o < t; o++) { e += s.charAt(Math.floor(Math.random() * i)); } return e; } autoComplete(t, s, i, e, o, h, r, n, a, l) { t += ``; if (t.length < o) { while (t.length < o) { if (h == 0) { t += e; } else { t = e + t; } } } if (r) { let s = ``; for (var f = 0; f < n; f++) { s += l; } t = t.substring(0, a) + s + t.substring(n + a); } t = s + t + i; return this.toDBC(t); } customReplace(t, s, i, e) { try { if (this.isEmpty(i)) { i = "#{"; } if (this.isEmpty(e)) { e = "}"; } for (let o in s) { t = t.replace(`${i}${o}${e}`, s[o]); } } catch (t) { this.logErr(t); } return t; } toDBC(t) { var s = ""; for (var i = 0; i < t.length; i++) { if (t.charCodeAt(i) == 32) { s = s + String.fromCharCode(12288); } else if (t.charCodeAt(i) < 127) { s = s + String.fromCharCode(t.charCodeAt(i) + 65248); } } return s; } hash(t) { let s = 0, i, e; for (i = 0; i < t.length; i++) { e = t.charCodeAt(i); s = (s << 5) - s + e; s |= 0; } return String(s); } formatDate(t, s) { let i = { "M+": t.getMonth() + 1, "d+": t.getDate(), "H+": t.getHours(), "m+": t.getMinutes(), "s+": t.getSeconds(), "q+": Math.floor((t.getMonth() + 3) / 3), S: t.getMilliseconds(), }; if (/(y+)/.test(s)) s = s.replace( RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length) ); for (let t in i) if (new RegExp("(" + t + ")").test(s)) s = s.replace( RegExp.$1, RegExp.$1.length == 1 ? i[t] : ("00" + i[t]).substr(("" + i[t]).length) ); return s; } })(t, s, i); }
