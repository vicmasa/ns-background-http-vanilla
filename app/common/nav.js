const frameModule = require('ui/frame');
exports.goBack = function () {
    const topmost = frameModule.topmost();
    topmost.goBack();
}
function goToFunc(pagina, history, item) {
    console.log('goto: ' + 'components/' + pagina);
    const topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: './components/' + pagina,
        clearHistory: history,
        context: item
    });
}
exports.goTo = function (pagina, history, item) {
    goToFunc(pagina, history, item);
}
exports.getCurrentPage = function () {
    const myPage = frameModule.topmost().currentPage;
    return myPage.id;
}
exports.error = function (code) {
    switch (code) {
        case 401:
            goToFunc('login/login', true);
            break;
        default:
            break;
    }
}