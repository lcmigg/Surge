/*
 * CamScanner 解锁会员
 * 版本: 1.0.0
 * 适用: Loon
 */

const url = $request.url;
const method = $request.method;

if (url.includes('/purchase/cs/query_property')) {
  // 获取原始响应
  let body = $response.body;
  
  if (body) {
    try {
      // 解析原始JSON
      let obj = JSON.parse(body);
      
      // 修改为会员数据
      obj = {
        "data": {
          "psnl_vip_property": {
            "expiry": 4102415999,
            "svip": 1,
            "nxt_renew_tm": 4102415999
          }
        }
      };
      
      // 返回修改后的body
      $done({body: JSON.stringify(obj)});
    } catch (e) {
      console.log("解析错误: " + e);
      $done({body});
    }
  } else {
    $done({});
  }
} else {
  $done({});
}
