/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn
*/

var body = $response.body;
var obj = JSON.parse(body);

obj.expirTime = 1882785945
obj."userExpList" : [
      {
        "expId" : 2,
        "expGroupId" : 6,
        "businessIsolId" : 2,
        "globalIsolId" : 2,
        "levelId" : 9
      }

$done({body: JSON.stringify(obj)});
