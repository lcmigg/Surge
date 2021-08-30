/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body 
hostname = zths.szy.cn

*/

var body = $response.body;
var obj = JSON.parse(body);

obj.data.expirTime = 1882785945
obj.date.userExpList.expId = 2

$done({body: JSON.stringify(obj)});
