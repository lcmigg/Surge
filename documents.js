/*
#document
^https:\/\/license\.pdfexpert\.com\/api\/.*\/documents\/subscription\/(refresh$|check$) url script-response-body JS/documents.js
license.pdfexpert.com
*/

var obj= {
  "originalTransactionId" : "20000625420102",
  "subscriptionState" : "trial",
  "isInGracePeriod" : false,
  "subscriptionExpirationDate" : "17:48 25/11/2099",
  "isDocuments6User" : true,
  "isEligibleForIntroPeriod" : false,
  "subscriptionAutoRenewStatus" : "autoRenewOff",
  "subscriptionReceiptId" : "1530908572000"
};

$done({body: JSON.stringify(obj)});

// Descriptions
