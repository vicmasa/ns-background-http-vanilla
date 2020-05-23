exports.imgSize = function (url, size) {
    if (url) {
        url = url.replace(/_xs|_s|_m|_l|_xl/, '');
        const last = url.lastIndexOf('.'); 
        url = [url.substring(0, last), size, url.substring(last, url.length)].join('');
    }
    return url;
}