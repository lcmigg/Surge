/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn
*/

let obj = JSON.parse($response.body);

obj = {
    "expirTime" : 1882785945,
    "userExpList" : [
      {
        "expId" : 3,
        "expGroupId" : 6,
        "businessIsolId" : 1,
        "globalIsolId" : 0,
        "levelId" : 3
      }
    ],
}

$done({body: JSON.stringify(obj)});
