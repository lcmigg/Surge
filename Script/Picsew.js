/*
Picsew内购

[MITM]
hostname = buy.itunes.apple.com

[Script]
http-response ^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/wubulaba/surgescript/master/Script/Picsew.js,script-update-interval=0
*/

var obj = JSON.parse($response.body);
var bundle_id = obj.receipt["bundle_id"];
if (bundle_id == "com.sugarmo.ScrollClip") {
  obj = {
    "receipt": {
    "receipt_type": "Production",
    "app_item_id": 1208145167,
    "receipt_creation_date": "2019-12-02 07:37:04 Etc/GMT",
    "bundle_id": "com.sugarmo.ScrollClip",
    "in_app": [
      {
        "product_id": "com.sugarmo.ScrollClip.freeUpgrade",
        "quantity": "1",
        "transaction_id": "470000537586926",
        "purchase_date_ms": "1575271039000",
        "original_purchase_date_pst": "2019-12-01 23:17:19 America/Los_Angeles",
        "purchase_date_pst": "2019-12-01 23:17:19 America/Los_Angeles",
        "original_purchase_date_ms": "1575271039000",
        "is_trial_period": "false",
        "original_purchase_date": "2019-12-02 07:17:19 Etc/GMT",
        "original_transaction_id": "470000537586926",
        "purchase_date": "2019-12-02 07:17:19 Etc/GMT"
      }
    ],
    "download_id": 87052827490254,
    "adam_id": 1208145167,
    "receipt_creation_date_pst": "2019-12-01 23:37:04 America/Los_Angeles",
    "request_date": "2019-12-02 07:37:20 Etc/GMT",
    "request_date_pst": "2019-12-01 23:37:20 America/Los_Angeles",
    "version_external_identifier": 833802101,
    "request_date_ms": "1575272240916",
    "original_purchase_date_pst": "2019-06-04 21:29:00 America/Los_Angeles",
    "application_version": "3033",
    "original_purchase_date_ms": "1559708940000",
    "receipt_creation_date_ms": "1575272224000",
    "original_application_version": "2911",
    "original_purchase_date": "2019-06-05 04:29:00 Etc/GMT"
  },
  "status": 0,
  "environment": "Production"
  };
}
$done({body:JSON.stringify(obj)});
