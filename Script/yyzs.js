const path1 = "/app/user/pro/stat?";
const path2 = "/app/user/init?";
const path3 = "/app/user/pay/checkIntroOfferPeriod?";

let url = $request.url;
let body = JSON.parse($response.body);

if (url.indexOf(path1) != -1) {
  body.data.isActive = true;
  body.data.expireDate = "2025-12-08 11:49:24";
}

if (url.indexOf(path2) != -1) {
  body.data.isProActive = true;
  body.data.expireDate = "2025-12-08 11:49:24";
}

if (url.indexOf(path3) != -1) {
  body.data.hasIntroPeriod = true;
}

$done({
  body: JSON.stringify(body)
});

//^https?:\/\/newdrugs\.dxy\.cn\/app\/user\/(p(ay\/checkIntroOfferPeriod|ro\/stat)|init)\? url script-response-body JS/dxys2.js
