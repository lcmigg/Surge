/*
Unlocks by photonmang 公众号：墨鱼手记
*/

let body= $response.body; 
var obj = JSON.parse(body); 
obj.account_type:2;
$done({body: JSON.stringify(obj)});
