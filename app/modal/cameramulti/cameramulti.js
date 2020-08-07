const ViewModel = require('./cameramulti-view-model');

let closeCallback;
let page;
//CAMERA
let cameraView = undefined;
let isInit = true;
//
exports.onShownModally = function (args) {
    page = args.object;
    const item = args.context.params;
    closeCallback = args.closeCallback;
    for (const i in item) {
        ViewModel.set(i, item[i]);
    }
    page.bindingContext = ViewModel;
    if (args.context.platform == 'android') {
        // eslint-disable-next-line no-undef
        page._dialogFragment.getDialog().getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
    }
    setTimeout(function () {
        cameraView = page.getViewById("cameraView");
        setEventListenerCamera();
        ViewModel.set('loaded', true);
    }, 2000);
}
exports.itemTap_camera = function (args) {
    if (ViewModel.get('loaded')) {
        console.log('itemTap_camera()');
        closeCallback(ViewModel.get('index'), ViewModel.get('value'));
    }
}
exports.hideModal = function (args) {
    if (ViewModel.get('loaded')) {
        if (args.object.row == 1) {
            closeCallback(ViewModel.get('index'), null);
        } else {
            closeCallback(false);
        }
    }
}
//CAMERA LOGIC
exports.tapClear = function () {
    ViewModel.set('value', null);
}
function onEvent(args) {
    console.log('New finish');
    const object = args.object;
    const file = object.get('file');
    let value = ViewModel.get('value');
    if (value) {
        value.push(file);
    } else {
        value = [file];
    }
    ViewModel.set('value', value);
    if (ViewModel.get('recording')) {
        recordVideo(true);
    }
    ViewModel.set('loaded', true);
    ViewModel.set('total', value.length);
}
function setEventListenerCamera() {
    try {
        if (isInit) {
            isInit = false;
            cameraView.on('finished', onEvent.bind(this));
        }
    } catch (e) {
        console.log(e);
    }
}
exports.takePhoto = function () {
    if (ViewModel.get('loaded')) {
        console.log('takePhoto()');
        ViewModel.set('loaded', false);
        cameraView.takePhoto();
    }
}
function stopRecording() {
    console.log('stopRecording()');
    ViewModel.set('seconds', 0);
    ViewModel.set('recording', false);
    try {
        cameraView.stopRecording();
        clearTimeout(timer);
    } catch (e) {
        console.log(e);
    }
}
function startRecording() {
    console.log('startRecording()');
    ViewModel.set('recording', true);
    try {
        cameraView.startRecording();
        countSecondsRecordVideo();
    } catch (e) {
        console.log(e);
    }
}
function recordVideo(close) {
    if (ViewModel.get('recording') || close) {
        stopRecording();
    } else {
        startRecording();
    }
}
exports.recordVideo = function () {
    if (ViewModel.get('loaded')) {
        recordVideo();
    }
}
let timer = 0;
function countSecondsRecordVideo() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setInterval(() => {
        ViewModel.set('seconds', ViewModel.get('seconds') + 1);
    }, 1000);
}
//