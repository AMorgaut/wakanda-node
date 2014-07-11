// to be implemented
// used by src/node.js to create process.stdin

/**
 * @experimental
 * @method guessHandleType
 * @param {number} fd
 **/
exports.guessHandleType = function guessHandleType(fd) {
    // can return 'TTY', 'FILE', 'PIPE', or 'TCP'
    throw new Error('not implemented');
};


exports.isTTY = function isTTY(fd) {
    return true
};

exports.TTY = function TTY(fd, flag) {
    return true
};