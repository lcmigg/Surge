// 转换时间: 2024/9/23 13:05:01
// 兼容性转换
if (typeof $request !== 'undefined') {
  const lowerCaseRequestHeaders = Object.fromEntries(
    Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  $request.headers = new Proxy(lowerCaseRequestHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}
if (typeof $response !== 'undefined') {
  const lowerCaseResponseHeaders = Object.fromEntries(
    Object.entries($response.headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  $response.headers = new Proxy(lowerCaseResponseHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}
Object.getOwnPropertyNames($httpClient).forEach(method => {
  if(typeof $httpClient[method] === 'function') {
    $httpClient[method] = new Proxy($httpClient[method], {
      apply: (target, ctx, args) => {
        for (let field in args?.[0]?.headers) {
          if (['host'].includes(field.toLowerCase())) {
            delete args[0].headers[field];
          } else if (['number'].includes(typeof args[0].headers[field])) {
            args[0].headers[field] = args[0].headers[field].toString();
          }
        }
        return Reflect.apply(target, ctx, args);
      }
    });
  }
})


// QX 相关
var setInterval = () => {}
var clearInterval = () => {}
var $task = {
  fetch: url => {
    return new Promise((resolve, reject) => {
      if (url.method == 'POST') {
        $httpClient.post(url, (error, response, data) => {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      } else {
        $httpClient.get(url, (error, response, data) => {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      }
    })
  },
}

var $prefs = {
  removeValueForKey: key => {
    let result
    try {
      result = $persistentStore.write('', key)
    } catch (e) {
    }
    if ($persistentStore.read(key) == null) return result
    try {
      result = $persistentStore.write(null, key)
    } catch (e) {
    }
    if ($persistentStore.read(key) == null) return result
    const err = '无法模拟 removeValueForKey 删除 key: ' + key
    console.log(err)
    $notification.post('Script Hub: 脚本转换', '❌ sssp.js.txt', err)
    return result
  },
  valueForKey: key => {
    return $persistentStore.read(key)
  },
  setValueForKey: (val, key) => {
    return $persistentStore.write(val, key)
  },
}

var $notify = (title = '', subt = '', desc = '', opts) => {
  const toEnvOpts = (rawopts) => {
    if (!rawopts) return rawopts 
    if (typeof rawopts === 'string') {
      if ('undefined' !== typeof $loon) return rawopts
      else if('undefined' !== typeof $rocket) return rawopts
      else return { url: rawopts }
    } else if (typeof rawopts === 'object') {
      if ('undefined' !== typeof $loon) {
        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
        return { openUrl, mediaUrl }
      } else {
        let openUrl = rawopts.urlp(([k, v]) => [k.toLowerawopts['open-url']
        if('undefined' !== typeof $rocket) return openUrl
        return { url: openUrl }
      }
    } else {
      return undefined
    }
  }
  console.log(title, subt, desc, toEnvOpts(opts))
  $notification.post(title, subt, desc, toEnvOpts(opts))
}
var _scriptSonverterOriginalDone = $done

var _scriptSonverterDone = (val = {}) => {
  let result
  if (
    (typeof $request !== 'undefined' &&
    typeof val === 'object' &&
    typeof val.status !== 'undefined' &&
    typeof val.headers !== 'undefined' &&
    typeof val.body !== 'undefined') || false
  ) {
    try {
      for (const part of val?.status?.split(' ')) {
        const statusCode = parseInt(part, 10)
        if (!isNaN(statusCode)) {
          val.status = statusCode
          break
        }
      }
    } catch (e) {}
    if (!val.status) {
      val.status = 200
    }
    if (!val.headers) {
      val.headers = {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      }
    }
    result = { response: val }
  } else {
    result = val
  }
  console.log('$done')
  try {
    console.log(JSON.stringify(result))
  } catch (e) {
    console.log(result)
  }
  _scriptSonverterOriginalDone(result)
}
var window = globalThis
window.$done = _scriptSonverterDone
var global = globalThis
global.$done = _scriptSonverterDone

/*************************************

项目名称：涩涩视频—去除所有广告
下载地址：https://23581.net/
在线观看：https://os.privacypolicie.net
在线观看：https://kb403128.jnruiying.com
获取地址：kuaiboshipin8568@gmail.com 发送任意内容邮件获取最新下载地址
更新日期：2024-07-30
脚本作者：chxm1023
电报频道：https://t.me/chxm1023
使用声明：⚠️仅供参考，🈲转载与售卖！
 'POST') {
        $httpClient.post(url,
[rewrite_local]
^https?:\/\/.*\.(yuchenglw|honghufly|privacypolicie|osupdate|jnruiying)\.(net|com) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/refs/heads/master/Script/sssp1.js

[mitm]
hostname = *.yuchenglw.com, *.honghufly.com, *.privacypolicie.net, *.osupdate.net, *.jnruiying.com

*************************************/


var body = $response.body;

var replacements = [
  { regex: /广告合作[\s\S]*?(<\/p>)/g, replaceWith: '$1' },  //删除多余内容
{ regex: /<a class="" href="https:\/\/[^"]+" target="_blank">[^<]+<\/a>/g, replaceWith: '<!--  -->' },  //删除广告分类按钮
  { regex: /<div class="float-app">[\s\S]*?(<!--  -->)/g, replaceWith: '' },  //删除底部横幅广告
  { regex: /<h3 class="mt-4">猜你喜欢<\/h3>[\s\S]*?(<div class="mt-5 text-center">)/g, replaceWith: '$1' },  //删除“猜你喜欢”
  { regex: /<!--  -->[\s\S]{0,5}(<!--  -->)/g, replaceWith: '<!--  -->' },  //删除无用的注释
  { regex: /<a target="_blank" href="[^"]+">[\s\S]{0,180}(<!--  -->)/g, replaceWith: '' },  //删除广告图标
  { regex: /<div id="popup">[\s\S]*?(<div class="header">)/g, replaceWith: '$1' },  //删除弹窗广告
  { regex: /<div class="col-6 item">[\s\S]{0,10}?<a[^>]{0,100}?target="_blank"[^>]{0,10}?>[\s\S]{0,300}?<\/a>\s*<\/div>/g, replaceWith: '' },  //删除插图广告
  { regex: /<div id="launch">[\s\S]{0,500}(<\/div>)/g, replaceWith: '' }  //删除开屏广告
];

replacements.forEach(({ regex, replaceWith }) => {
  body = body.replace(regex, replaceWith);
});

_scriptSonverterDone({ body });
