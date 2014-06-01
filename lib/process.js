
// Wakanda makes no difference between freebsd, linux and sunos
// sunos probably not supported 
// diff between linux and freebsd should be checked via SystemWorker.exec()
Object.defineProperty(process, 'platform', {
    get: function () {
        return os.isWindows ? 'win32' : (os.isMac ? 'darwin' : 'freebsd');
    }
});

// An object containing the user environment. See environ(7).
var env;
if (!process.env) {
    Object.defineProperty(process, 'env', {
        get: function () {
            if (env) return env;
            env = {};
            SystemWorker.exec('/usr/bin/env').output.toString().split('\n').forEach(function (line) {
                var parts = line.split('=');
                if (!parts.length) return;
                env[parts[0]] = parts[1];
            });
            return env;
        },
        enumerable: true
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
