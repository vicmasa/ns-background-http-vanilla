const ViewModel = require('./main-view-model');

const app = require('application');

const ls = require('~/common/ls');
const dt = require('~/common/dt');
const files = require('~/common/files');
const platform = require('~/common/platform');

const modalcameramulti = "~/modal/cameramulti/cameramulti";

let page;
exports.onNavigatingTo = function navigatingTo(args) {
    page = args.object;

    ViewModel.set('image_url', undefined);
    ViewModel.set('img_st', 0);
    ViewModel.set('listView', []);
    ViewModel.set('type', 'checking/video');

    ls.setString('platform', platform.getPlatform());
    setPath();
    setSaveImages();

    page.bindingContext = ViewModel;

    setUrl(0);
    setContentType(0);

    getContent('test');
}

function setUrl(value) {
    let urls;
    if (app.android) {
        urls = ["https://dev-upload.viiamanager.com", "https://dev-upload.viiamanager.com", "http://10.0.2.2:8080"];
    } else {
        urls = ["https://dev-upload.viiamanager.com", "https://dev-upload.viiamanager.com", "http://localhost:8080"];
    }

    ViewModel.set('url', urls[value]);
}

function getContent(filename) {
    const content = {
        client: 1,
        user: 1,
        unit: 1,
        face: 1,
        type: ViewModel.get('type').trim(),
        filename: filename,
        timestamp: '2020-05-18 17:41:56'
    }
    ViewModel.set('content', JSON.stringify(content));
    return content;
}

exports.tapSetUrl = function (args) {
    const item = args.object;
    setUrl(item.url);
}

function setContentType(value) {
    const contentType = ["application/octet-stream", "multipart/form-data"];
    ViewModel.set('contentType', contentType[value]);
}

exports.tapSetContentType = function (args) {
    const item = args.object;
    setContentType(item.contentType);
}

function setPath() {
    const fileSystemModule = require('tns-core-modules/file-system');
    let folderDest = fileSystemModule.knownFolders.currentApp();
    if (ls.getString('platform') == 'ios') {
        folderDest = fileSystemModule.knownFolders.documents();
    }
    folderDest = fileSystemModule.path.join(folderDest.path, "tmp/vpo");
    const folder = fileSystemModule.Folder.fromPath(folderDest);
    console.log(folder.path);
    ViewModel.set('path', folder.path);
}
function setSaveImages() {
    if (ls.getBool('saveImages')) {
        ViewModel.set('saveImages', true);
    } else {
        ViewModel.set('saveImages', false);
    }
}
//logic image and camera 
exports.tapClearImage = function (args) {
    args.object.className = args.object.className.replace(' scale_in', '');
    args.object.className += ' scale_in';
    ViewModel.set('image', undefined);
}
function getColor(name, code) {
    let color;
    switch (name) {
        case 'progress':
            color = 'white';
            break;
        case 'responded':
            color = 'silver';
            break;
        case 'complete':
            if (code == 200) {
                color = 'green';
            } else {
                color = 'red';
            }
            break;
        case 'cancelled':
            color = 'red';
            break;
        default: //error
            color = 'red';
            break;
    }
    return (color);
}
function onEvent(e) {
    const listView = ViewModel.get('listView');
    listView.unshift({
        color: getColor(e.eventName, e.responseCode),
        eventTitle: e.eventName + " " + e.object.description,
        eventData: JSON.stringify({
            error: e.error ? e.error.toString() : e.error,
            currentBytes: e.currentBytes,
            totalBytes: e.totalBytes,
            body: e.data,
            responseCode: e.responseCode
        })
    });
    ViewModel.set('img_st', 1);
    ViewModel.set('listView', listView);
    page.getViewById('listView').refresh();
}

function getHeaders(content, file_name) {
    return {
        "Content-Type": ViewModel.get('contentType').trim(),
        "File-Name": file_name,
        "Content": JSON.stringify(content) //siempre como string
    };
}
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}
function setPushSizeDuration(size, duration) {
    const m = bytesToSize(size);
    const listView = ViewModel.get('listView');
    listView.unshift({
        color: 'white',
        eventTitle: 'TAMAÑO: ' + m,
        eventData: 'Bytes: ' + size + ' | Duración: ' + duration + ' segundos'
    });
}
function SEND_BACKGROUND(file_url, file_name, size, duration) {
    console.log('SEND_BACKGROUND()');
    // console.log(file_url);
    // console.log(file_name);
    // console.log(size);
    // console.log(duration);

    ViewModel.set('listView', []);

    const url = ViewModel.get('url').trim();
    const bghttp = require("nativescript-background-http");
    const session = bghttp.session("image-upload");

    const content = getContent(file_name);
    const headers = getHeaders(content, file_name);
    ViewModel.set('listView', [{
        color: 'yellow',
        eventTitle: JSON.stringify(headers)
    }]);
    setPushSizeDuration(size, duration);
    const request = {
        url: url,
        method: "POST",
        headers: headers,
        description: "Uploading " + file_name
    };
    var task = session.uploadFile(file_url, request);

    task.on("progress", onEvent.bind(this));
    task.on("error", onEvent.bind(this));
    task.on("responded", onEvent.bind(this));
    task.on("complete", onEvent.bind(this));
}

function SEND_BACKGROUND_MULTIPLE(file_url, file_name, size, duration) {
    console.log('SEND_BACKGROUND_MULTIPLE()');
    console.log(file_url);
    ViewModel.set('listView', []);

    const url = ViewModel.get('url').trim();
    const bghttp = require("nativescript-background-http");
    const session = bghttp.session("image-upload");
    const content = getContent(file_name);
    const headers = getHeaders(content, file_name, size);
    ViewModel.set('listView', [{
        color: 'yellow',
        // eventTitle: 'header',
        eventTitle: JSON.stringify(headers)
    }]);
    setPushSizeDuration(size, duration);
    const request = {
        url: url,
        method: "POST",
        headers: headers,
        description: "Uploading " + file_name
    };
    const params = [
        { name: "aaaa", value: "bbbb" },
        { name: "test", value: "value" },
        { name: "testInt", value: 10 },
        { name: "bool", value: true },
        { name: "fileToUpload", filename: file_url, mimeType: 'image/jpeg' }
    ];


    //let params = [];
    // for (var i = 0; i < 20; i++) {
    //     params.push({ name: "fileToUpload" + i, filename: file_url, mimeType: 'image/jpeg' })
    // }

    var task = session.multipartUpload(params, request);
    task.on("progress", onEvent.bind(this));
    task.on("error", onEvent.bind(this));
    task.on("responded", onEvent.bind(this));
    task.on("complete", onEvent.bind(this));
    task.on("cancelled", onEvent.bind(this)); // Android only
}

exports.tapRepeat = function () {
    const item = ls.getJson('last');
    if (item) {
        if (page.getViewById('switch').checked) {
            SEND_BACKGROUND(item.file_src, item.file_name, item.file_size, item.file_duration);
        } else {
            SEND_BACKGROUND_MULTIPLE(item.file_src, item.file_name, item.file_size, item.file_duration);
        }
    }
}
function getFileName(url) {
    const last = url.lastIndexOf('/');
    url = url.substring(last + 1, url.length);
    return url;
}
function getCapturedAt(src) {
    let name = getFileName(src);
    name = name.replace('VID_', '').replace('.mp4', '');
    name = name.replace('IMG_', '').replace('.jpg', '');
    if (name.length == 13) {
        name = parseInt(name);
        name = dt.formatDateTimeMySql(name);
        return name;
    } else {
        const y = name.substring(0, 4);
        const m = name.substring(4, 6);
        const d = name.substring(6, 8);
        const hour = name.substring(8, 10);
        const min = name.substring(10, 12);
        const seg = name.substring(12, 14);
        return y + '-' + m + '-' + d + ' ' + hour + ':' + min + ':' + seg;
    }
}
//MODAL CAMERA LOGIC
exports.tapImagenCamara = function () {
    setModalCamera(getModalCamera(true), 1);
}
exports.tapVideoCamara = function () {
    setModalCamera(getModalCamera(), 1);
}
function getModalCamera(isImage) {
    let item = {
        isImage: true,
        value: null,
        total: 0,
        loaded: false
    };
    if (!isImage) {
        item = {
            isImage: false,
            value: null,
            total: 0,
            loaded: false,
            recording: false,
            duration: 0
        }
    }
    return item;
}
function setModalCamera(params, index) {
    params.index = index;
    const platform = ls.getString('platform');
    const option = {
        context: {
            params: params,
            platform: platform
        },
        closeCallback: (index, item) => {
            if (index) {
                const file_name = getCapturedAt(item[item.length - 1].src);
                const size = files.getSizeFile(item[item.length - 1].src);
                ls.setJson('last', {
                    file_src: item[item.length - 1].src,
                    file_name: file_name,
                    file_size: size,
                    file_duration: item[item.length - 1].duration
                });
                if (page.getViewById('switch').checked) {
                    SEND_BACKGROUND(item[item.length - 1].src, file_name, size, item[item.length - 1].duration);
                } else {
                    SEND_BACKGROUND_MULTIPLE(item[item.length - 1].src, file_name, size, item[item.length - 1].duration);
                }
            }
        },
        fullscreen: true
    };
    if (platform == 'ios') {
        option.ios = {
            // eslint-disable-next-line no-undef
            presentationStyle: UIModalPresentationStyle.OverFullScreen
        }
    }
    page.showModal(modalcameramulti, option);
}
//