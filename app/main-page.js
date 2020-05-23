const ViewModel = require('./main-view-model');

const app = require('application');

const ls = require('~/common/ls');
const dt = require('~/common/dt');
const image = require('~/common/image');
const platform = require('~/common/platform');

let page;
exports.onNavigatingTo = function navigatingTo(args) {
    page = args.object;

    ViewModel.set('image_url', undefined);
    ViewModel.set('img_st', 0);
    ViewModel.set('listView', []);

    ls.setString('platform', platform.getPlatform());
    setPath();
    setSaveImages();

    page.bindingContext = ViewModel;

    setUrl(0);
    setContentType(0);
}

function setUrl(value) {
    let urls;
    if (app.android) {
        urls = ["http://10.0.2.2:8080", "https://test-ws.viiamonitoring.com", "https://test-lambda.viiamonitoring.com/images-upload"];
    } else {
        urls = ["http://localhost:8080", "https://test-ws.viiamonitoring.com", "https://test-lambda.viiamonitoring.com/images-upload"];
    }

    ViewModel.set('url', urls[value]);
    let content;
    switch (value) {
        case '2':
            content = {
                client: 1,
                user: 2,
                type: 'board/installs',
                timestamp: '2020-05-18 17:41:56',
                campaign: 2428
            }
            break;
        default:
            content = {
                client: 1,
                user: 2,
                type: 'board/installs',
                timestamp: '2020-05-18 17:41:56',
                campaign: 2428
            }
            break;
    }
    ViewModel.set('content', JSON.stringify(content));
}

exports.tapSetUrl = function (args) {
    const item = args.object;
    setUrl(item.url);
}

function setContentType(value) {
    const contentType = ["multipart/form-data", "application/octet-stream"];
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
exports.tapImagenCamara = function (args) {
    ViewModel.set("type", args.object.type);
    const image_name = dt.formatDateTimeMySql(new Date());
    image.takePicture(ViewModel.get('path'), ls.getString('platform'), image_name)
        .then(function (r) {
            console.log(r);
            ViewModel.set('image_url', r)
            if (page.getViewById('switch').checked) {
                SEND_BACKGROUND(r, image_name);
            } else {
                SEND_BACKGROUND_MULTIPLE(r, image_name);
            }
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
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
function SEND_BACKGROUND(image_url, image_name) {
    console.log('SEND_BACKGROUND()');
    console.log(image_url);
    ViewModel.set('listView', []);

    const url = ViewModel.get('url').trim();
    const bghttp = require("nativescript-background-http");
    const session = bghttp.session("image-upload");

    const request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": ViewModel.get('contentType').trim(),
            "File-Name": image_name + ".jpeg",
            "Content": ViewModel.get('content')
        },
        description: "Uploading " + image_name,
        xxxx: 'yyyy', 
        content: JSON.parse(ViewModel.get('content'))
    };
    var task = session.uploadFile(image_url, request);

    task.on("progress", onEvent.bind(this));
    task.on("error", onEvent.bind(this));
    task.on("responded", onEvent.bind(this));
    task.on("complete", onEvent.bind(this));
}

function SEND_BACKGROUND_MULTIPLE(image_url, image_name) {
    console.log('SEND_BACKGROUND_MULTIPLE()');
    console.log(image_url);
    ViewModel.set('listView', []);

    const url = ViewModel.get('url').trim();
    const bghttp = require("nativescript-background-http");
    const session = bghttp.session("image-upload");
    const request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": ViewModel.get('contentType').trim(),
            "File-Name": image_name + ".jpeg",
            "Content": ViewModel.get('content')
        },
        description: "Uploading " + image_name,
        xxxx: 'yyyy', 
        content: JSON.parse(ViewModel.get('content'))
    };
    const params = [
        { name: "aaaa", value: "bbbb" },
        { name: "test", value: "value" },
        { name: "testInt", value: 10 },
        { name: "bool", value: true },
        { name: "fileToUpload", filename: image_url, mimeType: 'image/jpeg' }
    ];


    //let params = [];
    // for (var i = 0; i < 20; i++) {
    //     params.push({ name: "fileToUpload" + i, filename: image_url, mimeType: 'image/jpeg' })
    // }

    var task = session.multipartUpload(params, request);
    task.on("progress", onEvent.bind(this));
    task.on("error", onEvent.bind(this));
    task.on("responded", onEvent.bind(this));
    task.on("complete", onEvent.bind(this));
    task.on("cancelled", onEvent.bind(this)); // Android only
}
