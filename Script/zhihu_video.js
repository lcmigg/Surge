let body = $response.body 
body=JSON.parse(body)
delete body.ad_info
body=JSON.stringify(body)
$done({body})

// ^https:\/\/(api|lens|www)\.zhihu\.com\/api\/videos\/\d+\/recommend url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/zhihu_video.js
