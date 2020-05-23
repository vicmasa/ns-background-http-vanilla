const app = require('application');
var platform = require("platform");
exports.getPlatform = function () {
    if (app.android) {
        return 'android';
    } else {
        return 'ios';
    }
}
exports.getScreenDimensions = function (tipo) {
    switch (tipo) {
        case 'height':
            return (platform.screen.mainScreen.heightDIPs);
        default:
            return (platform.screen.mainScreen.widthDIPs);
    }
}