/**
 * BaiDu push notification handling
 */

var config = require('./Config');
var _ = require('lodash');
var baiduClient = require('node-baidu-push/lib/client');
var pushAssociations = require('./PushAssociations');
var message;


var push = function (tokens, message) {

    console.info("start baiduPusher.push");
    tokens.forEach(function (token){
      var sendMesg = _.defaults({}, message, config.get('baidu-android'));
      console.debug("Token:"+token);
      console.debug(sendMesg);
      baiduSender().pushMsgToSingleDevice(token, sendMesg,
        { msg_type: config.get('baidu').msg_type },
        function(err, response){
         if (err) {
             console.error(err);
         } else {
             console.info("Successfully sent with response: ", response);
         }
       });
    });
};

var buildPayload = function (options) {
    message = options;
    return message;
};

var baiduSender = _.once(function() {
    console.debug("BAIDU API KEY:"+config.get('baidu').apiKey);
    console.debug("BAIDU SCRECT KEY:"+config.get('baidu').secretKey);
    return new baiduClient(config.get('baidu').apiKey, config.get('baidu').secretKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
