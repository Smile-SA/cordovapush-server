var mongoose = require('mongoose');
var config = require('./Config');
var _ = require('lodash');

var errorHandler = function(error) {
    console.error('ERROR: ' + error);
};

var outputFilterWrapper = function (callback) {
    return function (err, pushItems) {
        console.log("B4");
        if (err) return callback(err, null);

        console.log("NO ERROR");
        var items = _.map(pushItems, function (pushItem) {
            console.log("Return pick");
            return _.pick(pushItem, ['user', 'type', 'token'])
        });

        return callback(null, items);
    }
};

var db = mongoose.connect("mongodb://localhost/pndb");
mongoose.connection.on('error', errorHandler);

var pushAssociationSchema = new db.Schema({
    user: {
        type: 'String',
        required: true
    },
    type: {
        type: 'String',
        required: true,
        enum: ['ios', 'android', 'fcm', 'baidu', 'getui', 'pushy'],
        lowercase: true
    },
    token: {
        type: 'String',
        required: true
    }
});

pushAssociationSchema.index({ user: 1, token: 1 }, { unique: true });
PushAssociation = db.model('PushAssociation', pushAssociationSchema);



var wrappedCallback = outputFilterWrapper(function (err, pushAss) {
    if (!err) {
        var users = _(pushAss).map('user').unique().value();
        console.log(users);
    } else {
        console.error("error");
    }
});
console.log("PushAssociation");
PushAssociation.find(wrappedCallback);
console.log("END");



