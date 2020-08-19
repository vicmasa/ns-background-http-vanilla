const mPicker = require("nativescript-mediafilepicker");
const mediafilepicker = new mPicker.Mediafilepicker();

exports.loadFile = function (platform, extensions, maxNumberFiles) {
    if (platform == 'ios') {
        // eslint-disable-next-line no-undef
        extensions = [kUTTypePDF, kUTTypeText]; // you can get more types from here: https://developer.apple.com/documentation/mobilecoreservices/uttype
    }
    let options = {
        android: {
            extensions: extensions,
            maxNumberFiles: maxNumberFiles
        },
        ios: {
            extensions: extensions,
            multipleSelection: true
        }
    };
    mediafilepicker.openFilePicker(options);
}

exports.captureImage = function () {
    let options = {
        android: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 10,
            isNeedFolderList: true
        }, ios: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 10
        }
    };
    mediafilepicker.openImagePicker(options);
}

exports.captureVideo = function (platform) {
    let allowedVideoQualities = [];

    if (platform == 'ios') {
        // eslint-disable-next-line no-undef
        allowedVideoQualities = [AVCaptureSessionPreset1920x1080, AVCaptureSessionPresetHigh];  // get more from here: https://developer.apple.com/documentation/avfoundation/avcapturesessionpreset?language=objc
    }

    let options = {
        android: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 2,
            isNeedFolderList: true,
            maxDuration: 20,

        },
        ios: {
            isCaptureMood: false, // if true then camera will open directly.
            videoMaximumDuration: 10,
            allowedVideoQualities: allowedVideoQualities
        }
    };
    mediafilepicker.openImagePicker(options);
}

exports.captureAudio = function () {
    let options = {
        android: {
            isCaptureMood: false, // if true then voice recorder will open directly.
            isNeedRecorder: true,
            maxNumberFiles: 2,
            isNeedFolderList: true,
            maxSize: 102400 // Maximum size of recorded file in bytes. 5900 = ~ 1 second
        },
        ios: {
            isCaptureMood: false, // if true then voice recorder will open directly.
            maxNumberFiles: 5,
            audioMaximumDuration: 10,
        }
    };
    mediafilepicker.openAudioPicker(options);
}

mediafilepicker.on("getFiles", function (res) {
    let results = res.object.get('results');
    console.dir(results);
});

// for iOS iCloud downloading status
mediafilepicker.on("exportStatus", function (res) {
    let msg = res.object.get('msg');
    console.log(msg);
});

mediafilepicker.on("error", function (res) {
    let msg = res.object.get('msg');
    console.log(msg);
});

mediafilepicker.on("cancel", function (res) {
    let msg = res.object.get('msg');
    console.log(msg);
});