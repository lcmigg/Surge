/*
提取115中的视频使用nPlayer进行播放.
使用方法：
1.在[Script]分组下添加下面这行配置
http-request ^https?:\/\/.*\.115\.com\/.*\.m3u8.*$ script-path=https://raw.githubusercontent.com/ikanam/Surge-Scripts/master/115tonplayer.js

^http:\/\/youku\.cdn4-okzy\.com\/share\/ https://raw.githubusercontent.com/lcmigg/Surge/master/Script/yktonplayer.js
*/
$notification.post('播放地址提取成功, 长按(重按)通知查看', '',  'nplayer-' + $request.url);
$done({}); 
