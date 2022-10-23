/*
[Script]
Enpass = type=http-response,pattern=https:\/\/license\.enpass\.io\/api\/v1\/subscription\/me,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Enpass/enpass.js

[MITM]
hostname = %APPEND% license.enpass.io

*/

var obj = JSON.parse($response.body);
obj.license = "premium";
obj.info = {
  purchase_type: "inapp",
  store: "ios",
  id: "ENP_IAP_LTP",
  userid: "000000",
  transaction_id: "1000000000000000",
  logo: "",
};
$done({ body: JSON.stringify(obj) });
