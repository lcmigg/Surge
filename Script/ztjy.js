/*

https://zths.szy.cn/api/(getExpInfo|getUserExpList) url script-response-body https://raw.githubusercontent.com/lcmigg/Surge/master/Script/ztjy.js
hostname = zths.szy.cn
*/

let obj = JSON.parse($response.body);

obj = {
  "message" : "成功",
  "returncode" : "10000",
  "body" : {
    "clazzExpList" : [

    ],
    "expList" : [
      "7_33",
      "15_53",
      "1_6"
    ],
    "businessIsolList" : [

    ],
    "expirTime" : 1882785945,
    "commonExpList" : [

    ],
    "studentExpList" : [

    ],
    "globalIsolList" : [

    ],
    "userExpList" : [
      {
        "expId" : 3,
        "expGroupId" : 6,
        "businessIsolId" : 1,
        "globalIsolId" : 0,
        "levelId" : 3
      }
    ],
    "schoolExpList" : [
      {
        "expId" : 7,
        "expGroupId" : 33,
        "levelId" : 5,
        "globalIsolId" : 0
      },
      {
        "expId" : 15,
        "expGroupId" : 53,
        "levelId" : 14,
        "globalIsolId" : 0
      }
    ]
  }
}

$done({body: JSON.stringify(obj)});
