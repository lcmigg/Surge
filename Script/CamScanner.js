/*************************************
项目名称：扫描全能王 解锁黄金会员
下载地址：https://t.cn/A6ouHe4B
脚本作者：chxm1023
使用说明：解锁部分功能，使用前先开脚本。
使用声明：⚠️仅供参考，🈲转载与售卖！
**************************************

[rewrite_local]

^https:\/\/.*\.(intsig\.net|camscanner\.com) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/refs/heads/master/Script/CamScanner.js

[mitm]

hostname = *.camscanner.com, *.intsig.net

*************************************/
var chxm1023 = {};
try {
    chxm1023 = JSON.parse($response.body);
} catch (e) {
    console.log("原始响应非JSON格式，跳过处理");
    $done({});
}

const vipa = '/purchase/cs/query_property';
const vipb = '/queryProperty';
const tqzx = '/getPrivilegeItem';

const vip = {
    "group1_paid": 1,
    "ms_first_pay": 0,
    "vip_type": "svip",
    "auto_renewal": true,
    "in_trial": 1,
    "members_page": 0,
    "pc_vip": 1,
    "renew_type": "year",
    "renew_method": "appstore",
    "ys_first_pay": 0,
    "initial_tm": "4092599349",
    "product_id": "com.intsig.camscanner.premiums.oneyear.autorenewable.free.test1",
    "vip_level_info": {
        "score": 0,
        "level": 0,
        "next_score": 1,
        "start_score": 0,
        "create_time": 0
    },
    "nxt_renew_tm": "4092599349",
    "last_payment_method": "appstore",
    "grade": 2,
    "svip": 1,
    "expiry": 4092599349,
    "pending": 0,
    "level_info": {
        "level": 1,
        "end_days": 30,
        "days": 1
    },
    "inherited_flag": 0,
    "group2_paid": 0
};

if ($request.url.indexOf(vipa) !== -1) {
    if (chxm1023.data) {
        chxm1023.data["psnl_vip_property"] = vip;
        chxm1023.data["fax_balance"] = "99999";
        // ...保持其他属性设置不变
    }
}

if ($request.url.indexOf(vipb) !== -1) {
    if (chxm1023.data && chxm1023.data.ar_property) {
        chxm1023.data.ar_property["psnl_vip_property"] = vip;
    }
}

if ($request.url.indexOf(tqzx) !== -1) {
    if (chxm1023.data) {
        chxm1023.data.data = {
            // ...保持原有数据结构不变
        };
    }
}

$done({ body: JSON.stringify(chxm1023) });
