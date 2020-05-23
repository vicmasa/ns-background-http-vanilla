const appSettings = require("application-settings");
exports.setString = function (name, value) {
    appSettings.setString(name, value);
}
exports.getString = function (name) {
    return appSettings.getString(name);
}
exports.setJson = function (name, value) {
    appSettings.setString(name, JSON.stringify(value));
    return true;
}
exports.getJson = function (name) {
    const listView = appSettings.getString(name);
    return listView ? JSON.parse(listView) : null;
}
exports.setNumber = function (name, value) {
    appSettings.setNumber(name, value);
}
exports.getNumber = function (name) {
    return appSettings.getNumber(name);
}
exports.setBool = function (name, value) {
    appSettings.setBoolean(name, value);
}
exports.getBool = function (name) {
    return appSettings.getBoolean(name);
}
exports.remove = function (name) {
    return appSettings.remove(name);
}
exports.clear = function () {
    return appSettings.clear();
}
exports.getObjectParams = function (object, name) {
    const listView = appSettings.getString(object);
    const profile = listView ? JSON.parse(listView) : null;
    if (profile) {
        return profile[name];
    } else {
        return null;
    }
}
exports.request = function (url, method, content) {
    return {
        url: url,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'es',
            'x-device-type': 1,
            'Authorization': 'Bearer ' + appSettings.getString('token')
        },
        content: JSON.stringify(content)
    }
}