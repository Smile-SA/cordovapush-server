/**
 * Created with JetBrains PhpStorm.
 * User: apateiro
 * Date: 2016-06-05
 * Time: 11:43
 * To change this template use File | Settings | File Templates.
 */

var config = require('./Config');
var _ = require('lodash');
var adm = require('node-adm');
var pushAssociations = require('./PushAssociations');


var push = function (tokens, message) {
    var mappedResults = [];
    function send_push(token, is_last){
        admSender().send(message, token, function (err, res) {
            if(err) console.log(err);

            if (res) {
                mappedResults.push(_.merge({token: token}, res));
            }

            if(is_last){
                handleResults(mappedResults);
            }
        })
    }

    //It seems node-adm doesn't allow multiple registrationId,
    //so call the send method for each registration id received here
    _(tokens).forEach(function(token, index) {
        send_push(token, (index == tokens.length -1));
    });

};

var handleResults = function (results) {
    var idsToUpdate = [],
        idsToDelete = [];

    results.forEach(function (result) {
        if (!!result.registration_id) {
            idsToUpdate.push({from: result.token, to: result.registration_id});

        } else if (result.error === 'InvalidRegistration' || result.error === 'NotRegistered') {
            idsToDelete.push(result.token);
        }
    });

    if (idsToUpdate.length > 0) pushAssociations.updateTokens(idsToUpdate);
    if (idsToDelete.length > 0) pushAssociations.removeDevices(idsToDelete);
};

var buildPayload = function (options) {
    //TODO Implement payload object formatter and validator
    //Expected format;
    /*
    {
        data: {
            message: "Hello"
        },
        consolidationKey: "Some Key",
        expiresAfter: 86400
    }
    */
    return options;
};

var admSender = _.once(function() {
    return new adm.Sender(config.get('adm'));
});

module.exports = {
    push: push,
    buildPayload:buildPayload
};
