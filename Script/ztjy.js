/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn
*/

const path1 = "/getUserExpList";
const path2 = "/getExpInfo";

let url = $request.url;
let obj = JSON.parse($response.body);

if (url.indexOf(path1) != -1) {
    obj."expirTime" = 1882785945;
    obj."userExpList"."expId" = 2
    obj."userExpList"."expGroupId" = 6
    obj."userExpList"."businessIsolId" = 1
    obj."userExpList"."globalIsolId" = 1
    obj."userExpList"."levelId" = 1
}

if (url.indexOf(path2) != -1) {
    obj."expirTime" = 1882785945;
}
$done({body: JSON.stringify(obj)});
