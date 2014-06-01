
// Wakanda makes no difference between freebsd, linux and sunos
// sunos probably not supported 
// diff between linux and freebsd should be checked via SystemWorker.exec()
Object.defineProperty(process, 'platform', {
    get: function () {
        return os.isWindows ? 'win32' : (os.isMac ? 'darwin' : 'freebsd');
    }
});

// An object containing the user environment. See environ(7).
process.env = process.env || {};
if (!Object.keys(process.env).length) {
    SystemWorker.exec('/usr/bin/env').output.toString().split('\n').forEach(function (line) {
        var parts = line.split('=');
        if (!parts.length) return;
        process.env[parts[0]] = parts[1];
    });
}

process.nextTick = function nextTick(callback) {
    setTimeOut(callback, 0);
}

process.versions= {
  http_parser: '',
  node: '',
  v8: '',
  ares: '',
  uv: '',
  zlib: '',
  modules: '',
  // wakanda 
  wakanda: process.version.split(' ').pop(),
  openssl: '',
  jsc: ''
};

process.binding = function binding(id) {
    return require('../binding/' + id);
};
