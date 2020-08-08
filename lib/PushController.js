/**
 * Created with JetBrains WebStorm.
 * User: Vincent Lemeunier
 * Date: 06/06/13
 * Time: 15:41
 */

var _ = require('lodash'),
    pushAssociations = require('./PushAssociations'),
    apnPusher = require('./APNPusher'),
    gcmPusher = require('./GCMPusher');
    fcmPusher = require('./FCMPusher');
    baiduPusher = require('./BAIDUPusher');
    getuiPusher = require('./GETUIPusher');
    pushyPusher = require('./PUSHYPusher');

// where androidPayload is for the GCM use 
var send = function (pushAssociations, fcmPayload, androidPayload, iosPayload, baiduPayload, getuiPayload, pushyPayload) {
    var fcmTokens = _(pushAssociations).where({type: 'fcm'}).map('token').value();
    var androidTokens = _(pushAssociations).where({type: 'android'}).map('token').value();
    var iosTokens = _(pushAssociations).where({type: 'ios'}).map('token').value();
    var baiduTokens = _(pushAssociations).where({type: 'baidu'}).map('token').value();
    var getuiTokens = _(pushAssociations).where({type: 'getui'}).map('token').value();
    var pushyTokens = _(pushAssociations).where({type: 'pushy'}).map('token').value();

    if (fcmPayload && fcmTokens.length > 0) {
      var fpayload = fcmPusher.buildPayload(fcmPayload);
      fcmPusher.push(fcmTokens, fpayload);
    }

    if (androidPayload && androidTokens.length > 0) {
         var gcmPayload = gcmPusher.buildPayload(androidPayload);
         gcmPusher.push(androidTokens, gcmPayload);
    }
    
    if (iosPayload && iosTokens.length > 0) {
         var apnPayload = apnPusher.buildPayload(iosPayload);
         apnPusher.push(iosTokens, apnPayload);
    }

    if (baiduPayload && baiduTokens.length > 0) {
        var bdPayload = baiduPusher.buildPayload(baiduPayload);
        baiduPusher.push(baiduTokens, bdPayload);
    }

    if (getuiPayload && getuiTokens.length > 0) {
        var gtPayload = getuiPusher.buildPayload(getuiPayload);
        getuiPusher.push(getuiTokens, gtPayload);
    }

    if (pushyPayload && pushyTokens.length > 0) {
        var psPayload = pushyPusher.buildPayload(pushyPayload);
        pushyPusher.push(pushyTokens, psPayload);
    }
};

var sendUsers = function (users, payload) {
    pushAssociations.getForUsers(users, function (err, pushAss) {
        if (err) return;
        send(pushAss, payload);
    });
};

var subscribe = function (deviceInfo) {
    if (deviceInfo.type === undefined)
       deviceInfo.type = "fcm";
    pushAssociations.add(deviceInfo.user, deviceInfo.type, deviceInfo.token);
};

var unsubscribeDevice = function (deviceToken) {
    pushAssociations.removeDevice(deviceToken);
};

var unsubscribeUser = function (user) {
    pushAssociations.removeForUser(user);
};

module.exports = {
    send: send,
    sendUsers: sendUsers,
    subscribe: subscribe,
    unsubscribeDevice: unsubscribeDevice,
    unsubscribeUser: unsubscribeUser
};
