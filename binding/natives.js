
var 
    __filename, 
    __dirname, 
    ROOT, 
    LIB, 
    LIB_NODE;

__filename = module.uri;
__dirname = File(__filename).parent.path;

ROOT = Folder(__dirname).parent.path;
LIB = Folder(ROOT + 'lib/');
LIB_NODE = Folder(ROOT + 'node/lib/');

/**
 * @param {File} file
 **/
function addSourceGetter(file) {
    if (file.extension !== 'js') {
        return;
    }
    Object.defineProperty(exports, file.nameNoExt, {
        get: function () {
            return loadText(file.path);
        },
        enumerable: true
    });
}

/**
 * @param {File} file
 **/
function checkSourceGetter(file) {
    if (!exports.hasOwnProperty(file.nameNoExt)) {
        addSourceGetter(file);
    }
}

LIB.forEachFile(addSourceGetter);
LIB_NODE.forEachFile(checkSourceGetter);