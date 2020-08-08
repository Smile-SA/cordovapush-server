/**
 * Pushy push notification handling
 */

var config = require('./Config');
var _ = require('lodash');

var pushyClient = require('pushy');

var push = function (tokens, message) {
    console.log("start pushyPusher.push");
    tokens.forEach(function (token){
      console.debug("Token:"+token);
      console.debug(message);
      pushySender().sendPushNotification(message.data, token, message.options,
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

var pushySender = _.once(function() {
    console.debug("PUSHY Secret API KEY:"+config.get('pushy').apiKey);
    return new pushyClient(config.get('pushy').apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
