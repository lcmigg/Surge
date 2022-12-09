/***********************************

> 应用名称：电视家
> 软件版本：2.2.5
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 解锁说明：解锁会员权限
> 更新时间：2022-12-10
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 问题反馈：ddgksf2013@163.com
> 特别提醒：如需转载请注明出处，谢谢合作！
> 特别说明：⚠️⚠️⚠️
          本脚本仅供学习交流使用，禁止转载售卖
          ⚠️⚠️⚠️


[rewrite_local]
  
# ～ 电视家 解锁会员权限（2022-12-10）@ddgksf2013
^https?:\/\/123\.56\.125\.184\/api\/v\d\/user\/info url script-response-body https://github.com/lcmigg/Surge/blob/master/ddgksf/DianShiJiaProCrack.js

[mitm] 

hostname=123.56.125.184

***********************************/


var ddgksf2013=JSON.parse($response.body);ddgksf2013.data.equityTime=4e12,ddgksf2013.data.adEquityTime=4e12,ddgksf2013.data.exclusiveTime=4e12,$done({body:JSON.stringify(ddgksf2013)});
