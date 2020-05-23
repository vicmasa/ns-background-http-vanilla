const FeedbackPlugin = require('nativescript-feedback');
const feedback = new FeedbackPlugin.Feedback();

exports.showSuccess = function (body) {
    feedback.success(body);
}
exports.showWarning = function (body) {
    feedback.warning(body);
}
exports.showError = function (body) {
    //feedback.show(body);
    feedback.error(body);
}
exports.showInfo = function (body) {
    feedback.info(body);
}
exports.hideFeedback = function (body) {
    feedback.hide(body);
}