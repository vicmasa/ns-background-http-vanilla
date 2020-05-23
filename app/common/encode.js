// funcion de ayuda para la funcion obj2uri
function join(path, key) {
    return path != null ? path + "[" + key + "]" : key;
}

/**
 * Funcion que convierte un objeto|array en una cadena uri codificada.
 * 
 * @param {object} obj objeto que será convertido a una uri
 * @param {boolean} encodeKey valor que indica si debe codificar los keys, por defecto es false.
 * @param {string} path parametro opcional usado en la recursividad [usado en la recursividad].
 * @param {array|object} result objeto principal donde se guardarán todos los datos [usado en la recursividad].
 */
function obj2uri(obj, encodeKey, path, result) {

    encodeKey = encodeKey || false;

    // Si es la primerera llamada osea cuando no es un llamado de la recursividad
    if (result === undefined) {

        var type = Object.prototype.toString.call(obj);

        if (type === "[object Object]") {
            result = {};
        } else if (type === "[object Array]") {
            result = [];
        } else {
            return;
        }
    }

    for (var key in obj) {

        if (!obj.hasOwnProperty(key)) continue;

        var val = obj[key];

        if (val == null) continue;

        switch (Object.prototype.toString.call(val)) {
            case "[object Array]":
            case "[object Object]":
                obj2uri(val, encodeKey, join(path, key), result);
                break;
            default:
                result[join(path, key)] = encodeKey ? val : encodeURIComponent(val);
                break;
        }
    }

    return Object.entries(result).map(function (pair, i) {
        return (encodeKey ? pair.map(encodeURIComponent) : pair).join('=');
    }).join('&');
}
exports.encode = function (obj, encodeKey, path, result) {
    return obj2uri(obj, encodeKey, path, result);
}
exports.getOffset = function (offset,last_page) {
    if (last_page) {
        if (offset < last_page) {
            offset++;
        } else {
            return false;
        }
    } else {
        offset = 1;
    }
    return offset;
}