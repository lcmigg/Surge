/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn

*/

var body = $response.body;
var obj = JSON.parse(body);

obj.data.expirTime = 1882785945
obj.data.userExpList.expId = 2
obj.data.userExpList.businessIsolId = 1
obj.data.userExpList.globalIsolId = 1

$done({body: JSON.stringify(obj)});
