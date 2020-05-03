let obj = JSON.parse($response.body);
obj.data.is_vip = 1;
obj.data.vip_endtime = 1639303205;
$done({body: JSON.stringify(obj)});

// @supported 6E2293897220
/*
[Script]
^https:\/\/www\.luqijianggushi\.com\/api\/v2\/user\/get url script-response-body JS/luqi.js

[MITM]
hostname = www.luqijianggushi.com
*/
