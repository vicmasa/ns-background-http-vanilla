const ViewModel = require('./cameramulti-view-model');

let closeCallback;
let page;
//CAMERA
let cameraView = false;
let isInit = true;
const CameraPlus = require('@nstudio/nativescript-camera-plus').CameraPlus;
//
exports.onShownModally = function (args) {
    page = args.object;
    const item = args.context.params;
    closeCallback = args.closeCallback;
    for (const i in item) {
        ViewModel.set(i, item[i]);
    }
    if (!ViewModel.get('durationmin')) {
        ViewModel.set('durationmin', 3);
    }
    page.bindingContext = ViewModel;
    if (args.context.platform == 'android') {
        // eslint-disable-next-line no-undef
        page._dialogFragment.getDialog().getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
    }
    setTimeout(function () {
        cameraView = page.getViewById("cameraView");
        if (isInit) {
            setEventListenerCamera();
        }
        ViewModel.set('loaded', true);
        setFlash();
    }, 500);
}
exports.tapFlash = function () {
    if (ViewModel.get('loaded')) {
        cameraView.toggleFlash();
        setFlash();
    }
}
function setFlash() {
    if (cameraView.getFlashMode() == 'on') {
        ViewModel.set('flash', true);
    } else {//off
        ViewModel.set('flash', false);
    }
}
exports.itemTap_camera = function () {
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
    console.log('onEvent()');
    console.dir(args);
    setContent(args);
}
function setContent(file) {
    let value = ViewModel.get('value');
    if (ViewModel.get('isImage')) {
        if (value) {
            value.push({
                src: file
            });
        } else {
            value = [{
                src: file
            }];
        }
    } else {
        if (value) {
            value.push({
                src: file,
                duration: ViewModel.get('duration')
            });
        } else {
            value = [{
                src: file,
                duration: ViewModel.get('duration')
            }];
        }
        if (ViewModel.get('recording')) {
            recordVideo(true);
        }
    }
    ViewModel.set('value', value);
    ViewModel.set('loaded', true);
    ViewModel.set('total', value.length);
}
function setEventListenerCamera() {
    console.log('NEW LISTENER');
    try {
        cameraView.on(CameraPlus.photoCapturedEvent, (event) => {
            console.log('photoCapturedEvent');
            onEvent(event.data.android);
        });
        cameraView.on(CameraPlus.videoRecordingStartedEvent, () => {
            console.log('videoRecordingStartedEvent');
        });
        cameraView.on(CameraPlus.videoRecordingReadyEvent, (event) => {
            console.log('videoRecordingReadyEvent');
            onEvent(event.data);
        });
    } catch (e) {
        console.log(e);
    }
}
exports.takePhoto = function () {
    console.log('takePhoto()');
    if (ViewModel.get('loaded')) {
        ViewModel.set('isImage', true);
        ViewModel.set('intents', ViewModel.get('intents') + 1);
        cameraView.requestCameraPermissions().then(() => {
            // if (!cameraView) {
            //     cameraView = new CameraPlus();
            // }
            cameraView.takePicture({
                confirm: false,
                saveToGallery: false,
                keepAspectRatio: true,
                height: 400,
                width: 300,
                autoSquareCrop: false
            })
        });
    }
}
function stopRecording() {
    if (ViewModel.get('duration') >= ViewModel.get('durationmin')) {
        //console.log('stopRecording()');
        ViewModel.set('recording', false);
        try {
            cameraView.stop();
            clearTimeout(timer);
        } catch (e) {
            console.log(e);
        }
    }
}
function startRecording() {
    //console.log('startRecording()');
    ViewModel.set('recording', true);
    ViewModel.set('duration', 0);
    try {
        clearTimeout(timer);
        cameraView.requestCameraPermissions().then(() => {
            if (!cameraView) {
                cameraView = new CameraPlus();
            }
            cameraView.record({
                quality: 'MAX_480P',
                confirm: false,
                saveToGallery: false,
                height: 400,
                width: 300
            });
            countDurationRecordVideo();
        });
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
let timer;
function countDurationRecordVideo() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setInterval(() => {
        ViewModel.set('duration', ViewModel.get('duration') + 1);
    }, 1000);
}
//