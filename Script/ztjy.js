/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn
*/

const path1 = "/getUserExpList";
const path2 = "/getExpInfo";

let url = $request.url;
let body = JSON.parse($response.body);

if (url.indexOf(path1) != -1) {
    body = {
    "expirTime" : 1882785945,
    "userExpList" : [
      {
        "expId" : 2,
        "expGroupId" : 6,
        "businessIsolId" : 1,
        "globalIsolId" : 1,
        "levelId" : 3
      }
    ],
}
}
if (url.indexOf(path2) != -1) {
    body = {
    "expirTime" : 1882785945,
    }
}
$done({body: JSON.stringify(body)});
