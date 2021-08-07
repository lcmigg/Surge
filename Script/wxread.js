/*                     _ooOoo_
 *                    o8888888o
 *                    88" . "88
 *                    (| -_- |)
 *                    O\  =  /O
 *                 ____/`---'\____
 *               .'  \\|     |//  `.
 *              /  \\|||  :  |||//  \
 *             /  _||||| -:- |||||-  \
 *             |   | \\\  -  /// |   |
 *             | \_|  ''\---/''  |   |
 *             \  .-\__  `-`  ___/-. /
 *           ___`. .'  /--.--\  `. . __
 *        ."" '<  `.___\_<|>_/___.'  >'"".
 *       | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *       \  \ `-.   \_ __\ /__ _/   .-` /  /
 *  ======`-.____`-.___\_____/___.-`____.-'======
 *                     `=---='
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *              佛祖保佑       永无BUG
 * 微信读书 🔓 vip
 * 
 * ^https?:\/\/i\.weread\.qq\.com\/pay\/memberCardSummary.* url script-response-body WxRead.js
 * 
 * hostname = *.weread.qq.com
 */

// ^https?:\/\/i\.weread\.qq\.com\/pay\/memberCardSummary.* url script-response-body WxRead.js
// const data = JSON.parse($response.body);
// // data.expiredTime = Math.round(new Date("2021-12-30 23:59:59").getTime() / 1000)
// data.expiredTime = 1636646399
// data.payingRemainTime = 12614400
// data.isPaying = 1
// console.log(JSON.stringify(data))
// $done({
//     body: JSON.stringify(data)
// });

var body = $response.body;
var obj = JSON.parse(body);
    obj.startTime= 991603940132;
    obj.expiredTime= 991604246399;
    obj.expired= 0;
    obj.isPaying= 0;
    obj.permanent= 0;
    obj.day= 91;
    obj.remainTime= 99306196;
    obj.payingRemainTime= 6;
    obj.isAutoRenewable= 6;
    obj.historyAutoRenewable= 6;
    obj.autoRenewableChannel= 6;
    obj.autoRenewableTime= 6;
    obj.autoRenewablePrice= 991900;
    obj.savedMoney= 9927433;
    obj.totalFreeReadDay= 6666;
    obj.remainCoupon= 6666;
    obj.remainCount= 6666;
    obj.hintsForRecharge.predictedSavedMoney= 9910315;
    obj.hintsForRecharge.predictedChapterPrice= 15;
    obj.hintsForRecharge.pricePerMonth= 99900;
    obj.hintsForRecharge.sendCoupons= 6666;
    obj.hintsForRecharge.buttonTitle= "付费无限卡9元/月 · 限时特惠";
    obj.hintsForRecharge.buttonSubtitle= "你正在使用免费无限卡 · 升级付费无限卡即可阅读";

    obj.freeBookIds= [];
    obj.timestamp = 1603940203;
    obj.random = 8341;
    obj.signature = "5d7f6c929086a4a958ead60c9bd95fae6991afef51c1de50a41e7c2641fdaf3f";

body = JSON.stringify(obj);
$done({body});
