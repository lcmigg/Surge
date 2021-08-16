/*                     _ooOoo_
 * 樊登读书 🔓 vip
 * @Teeoo  github.com
 * ^https?:\/\/gateway-api\.dushu365\.com
 * 
 * hostname = *.dushu365.com
 */
var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

const vip = '/user-orchestration/user/api/v101/userInfo'
const tip = '/user-orchestration/user/api/v100/ceiltip'
const appUser = '/user-orchestration/userWeb/appUser/v100/getUserByToken'

if (url.indexOf(vip) != -1) {
  obj.data.userStatus = 3;
  if (obj.data.uid == 241034039) {
    obj.data.username = 'lcmig'
  }
  obj.data.expire_time = 1754537397000
  obj.data.isTrial = false
  obj.data.userRoleCode = '11'
  obj.data.vipBeginTime = 1628306997000
  body = JSON.stringify(obj);
}

if (url.indexOf(appUser) != -1) {
  obj.data.expireTime = 1754537397000
  obj.data.isTrial = false
  obj.data.userStatus = 3
  obj.data.userRoleCode = '11'
  body = JSON.stringify(obj);
}

if (url.indexOf(tip) != -1) {
  obj.data.buttonTip = ''
  obj.data.descTip = ''
  obj.data.empty = true
  body = JSON.stringify(obj);
}

$done({ body });