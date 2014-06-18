/**
 * @module binding_fs
 **/

// Used by the "fs" module

// TBD
/*
exports = {
    Stats: Stats,
    close: function () {},
    open: function () {},
    read: function () {},
    fdatasync: function () {},
    fsync: function () {},
    rename: function () {},
    ftruncate: function () {},
    mkdir: function () {},
    readdir: function () {},
    rmdir: rmdir,
    stat: stat,
    lstat: function () {},
    fstat: function () {},
    link: function () {},
    symlink: function () {},
    readlink: function () {},
    unlink: function () {},
    write: function () {},
    chmod: function () {},
    fchmod: function () {},
    chown: function () {},
    fchown: function () {},
    utimes: function () {},
    futimes: function () {},
    StatWatcher: function StatWatcher() {}
}
*/

var constants = process.binding('constants');

exports.Stats = Stats;
exports.rmdir = rmdir;
exports.stat = stat;




/**
 * @method stat
 * @param {string} fullpath
 * @param {function} callback
 * @warning not implemented
 * @return boolean
 **/
function stat(fullpath, callback) {
    var err, stats;

    if (typeof callback === 'function') {
        try {
            stats = new Stats(fullpath);
        } catch (e) {
            err = e;
        }
        callback(err, stats);
    } else {
        return new Stats(fullpath);
    }
}


/**
 * @method rmdir
 * @param {string} path
 * @param {function} callback
 * @return Error|null
 **/
function rmdir(path, callback) {
    // First test using the Wakanda Folder API
    // may migrate to another version using the W3C Directory API
    var folder = Folder(path);
    var error = null;
    if (!folder.exists) {
        error = new Error("ENOENT, no such file or directory '" + path + "'");
        error.code = 'ENOENT';
        error.errno = 34;
    } else if (folder.children.length) {
        error = new Error("ENOTEMPTY, directory not empty '" + path + "'");
        error.code = 'ENOTEMPTY';
        error.errno = 53;
    } else if (!folder.remove()) {
        error = new Error("EACCES, permission denied '" + path + "'");
        error.code = 'EACCES';
        error.errno = 3;
    }
    if (error) {
        error.path = path;
        error.syscall = 'rmdir';
    }
    if (callback) {
        callback(error);
    }
    return error;
}


/**
 * @class fs.Stats
 * @constructor
 * @param {string} fullpath
 **/
function Stats(fullpath) {
    this.stats = File(fullpath);
    this.mode = 0;
    if (!this.stats.exists) {
        this.mode = this.mode | constants.S_IFDIR;
    } else {
        this.stats = Folder(fullpath);
        if (this.stats.exists) {
            this.mode = this.mode | constants.S_IFREG;
        } else {
            throw new Error(fullpath + ' is neither a File or Folder');
        } 
    }   
    //this.dev = 2114;
    //this.ino = 48064969;
    //this.mode = 33188;
    //this.nlink = 1;
    //this.uid = 85;
    //this.gid = 100;
    //this.rdev = 0;
    this.size = stats.size;
    //this.blksize = 4096;
    //this.blocks = 8;
    //this.atime = new Date('Mon, 10 Oct 2011 23:24:11 GMT');
    this.mtime = stats.lastModifiedDate;
    this.ctime = stats.creationDate;
}


/**
 * @method isFile()
 * @return boolean
 **/
Stats.prototype.isFile = function isFile() {
    return this.stats instanceof File;
};


/**
 * @method isDirectory()
 * @return boolean
 **/
Stats.prototype.isDirectory = function isDirectory() {
    return this.stats instanceof Folder;
};


/**
 * @method isBlockDevice()
 * @warning not implemented
 * @return boolean
 **/
Stats.prototype.isBlockDevice = function isBlockDevice() {
    return false;
};


/**
 * @method isCharacterDevice()
 * @warning not implemented
 * @return boolean
 **/
Stats.prototype.isCharacterDevice = function isCharacterDevice() {
    return false;
};


/**
 * @method isSymbolicLink()
 * @warning not implemented
 * @return boolean
 **/
Stats.prototype.isSymbolicLink = function isSymbolicLink() {
    return false;
};


/**
 * @method isFIFO()
 * @warning not implemented
 * @return boolean
 **/
Stats.prototype.isFIFO = function isFIFO() {
    return false;
};


/**
 * @method isSocket()
 * @warning not implemented
 * @return boolean
 **/
Stats.prototype.isSocket = function isSocket() {
    return false;
};