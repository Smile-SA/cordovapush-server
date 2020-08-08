/**
 * Firebase push notification handling
 */

var config = require('./Config');
var _ = require('lodash');
var fcm = require('fcm-push');
var pushAssociations = require('./PushAssociations');
var message;

var push = function (tokens, message) {

    console.info("start fcmPusher.push");
    tokens.forEach(function (token){
      var toToken = { "to": token };
      var sendMesg = _.defaults({}, message, toToken);
      console.debug(sendMesg);
      fcmSender().send(sendMesg, function(err, response){
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

var fcmSender = _.once(function() {
    console.debug("FCM API KEY:"+config.get('fcm').apiKey);
    return new fcm(config.get('fcm').apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
