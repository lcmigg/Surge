const targetUrl = 'https://st.todesk.com/config-center/sync-config?fullUpdate=false';

if (typeof $response !== 'undefined') {
    let body = $response.body;
    try {
        let json = JSON.parse(body);
        
        // 清除广告配置项
        if (json?.data?.configList) {
            json.data.configList = json.data.configList.filter(item => 
                item.key !== "advsData" && 
                item.key !== "speedLimits" && 
                item.key !== "UpdateHostTips"
            );
        }
        
        // 强制设置无广告标志
        json.data.configList.push({
            "key": "advsData",
            "value": "{}"
        });
        
        body = JSON.stringify(json);
    } catch (e) {
        console.log("ToDesk广告清除失败: " + e);
    }
    $done({body});
} else {
    $done({});
}