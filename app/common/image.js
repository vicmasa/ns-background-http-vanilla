const camera = require('nativescript-camera');
const BitmapFactory = require("nativescript-bitmap-factory");
const imageSourceModule = require('tns-core-modules/image-source');

camera.requestPermissions();

exports.takePicture = function (path, platform, name) {
    const options = { width: 800, height: 600, keepAspectRatio: true, saveToGallery: false };

    const promise = camera.takePicture()
        .then(function (imageAsset) {
            imageAsset.options = options;
            return saveResizeImage(imageAsset, path, platform, name);
        })
        .then(function (r) {
            return r;
        }).catch(function (err) {
            console.log('Error -> ' + err);
        });
    return promise;
}
function saveResizeImage(imageAsset, path, platform, name) {
    const source = new imageSourceModule.ImageSource();
    const promise = new Promise((resolve, reject) => {
        source.fromAsset(imageAsset).then((source) => { //fromAsset=bits
            //console.log(`Size init wxh: ${source.width}x${source.height}`);
            const bmp = BitmapFactory.create(source.width, source.height);
            const new_image_url = path + '/' + name + '.jpeg';
            bmp.dispose(function (b) {
                b.insert(source);
                // ## Max dimension. Respects aspect ratio.
                let b2;
                //console.log(ls.getString('platform'));
                if (platform == 'android') {
                    b2 = b.resizeMax(800);
                } else {
                    b2 = b.resizeMax(400); // ios * 2
                }
                const thumb_image = b2.toImageSource();
                const saved = thumb_image.saveToFile(
                    new_image_url,
                    'jpeg'
                );
                if (saved) {
                    console.log(`Size end wxh: ${thumb_image.width}x${thumb_image.height}`);
                    resolve(new_image_url);
                } else {
                    reject('Error in save image');
                }
            });
        });
    });
    return promise;
}