/***********************************
> 應用名稱：小打卡(微信小程序)

[rewrite_local]

# 群报数
^https:\/\/qunoss1\.qun100\.com\/PCNF/config\.json url script-response-body https://github.com/
[mitm] 

hostname=qunoss1.qun100.com

***********************************/


let obj = JSON.parse($response.body);
obj.appConfig.wxd7de024d43be8baa.globalShowAdv = false;
$done({body: JSON.stringify(obj)});
