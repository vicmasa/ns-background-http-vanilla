const fileSystemModule = require('tns-core-modules/file-system');

exports.getPath = function (platform) {
    let folderDest = fileSystemModule.knownFolders.currentApp();
    if (platform == 'ios') {
        folderDest = fileSystemModule.knownFolders.documents();
    }
    console.log(folderDest.path);
    return folderDest.path;
}
exports.getExistFile = function (path, file) {
    const newpath = path + '/' + file;
    console.log(newpath)
    const exists = fileSystemModule.File.exists(newpath);
    console.log(`Does ${file} exists: ${exists}`);
    return exists;
}
exports.getExistDataBase = function (path, db, platform) {
    if (platform == 'android') {
        path = path.replace('files/app', 'databases');
    }
    const newpath = path + '/' + db;
    console.log(newpath)
    const exists = fileSystemModule.File.exists(newpath);
    console.log(`Does ${db} exists: ${exists}`);
    return exists;
}
exports.newFolder = function (path, folders) {
    const folderDest = fileSystemModule.path.join(path, folders);
    const folder = fileSystemModule.Folder.fromPath(folderDest);
    console.log(folder.path);
    return folder.path;
}
exports.removeFile = function (path, folder, file) {
    const newpath = fileSystemModule.path.join(path, folder + file);
    console.log(newpath);
    const newfile = fileSystemModule.File.fromPath(newpath);
    return newfile.remove()
        .then(() => {
            console.log("resultMessage", "File successfully deleted!");
            return {
                title: 'File successfully deleted!',
                message: newpath
            };
        }).catch((e) => {
            console.log('File UNsuccessfully deleted!');
            console.log(e.stack);
            return false;
        });
}
exports.getFilesFromPath = function (platform, folder) {
    let folderDest = fileSystemModule.knownFolders.currentApp();
    if (platform == 'ios') {
        folderDest = fileSystemModule.knownFolders.documents();
    }
    if (folder) {
        folderDest = folderDest.path.join(folder);
    }
    folderDest.getEntities()
        .then((entities) => {
            entities.forEach((entity) => {
                console.dir({
                    name: entity.name,
                    path: entity.path,
                    lastModified: entity.lastModified.toString()
                });
            });
        }).catch((e) => {
            console.dir(e);
        });
}
exports.removeFilesFromPath = function (path) {
    const newpath = fileSystemModule.path.join(path);
    newpath.clear()
        .then(() => {
            console.log("resultMessage", "Folder successfully cleared!");
        }).catch((e) => {
            console.log(e);
        });
}
exports.getSizeFile = function (path) {
    const exists = fileSystemModule.File.exists(path);
    console.log(`Does exists: ${exists}`);
    let size = 0;
    if (exists) {
        const newpath = fileSystemModule.File.fromPath(path);
        console.log('size:', newpath.size);
        size = newpath.size;
    }
    return size;
}