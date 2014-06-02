
var os = require('os');

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
            var cmd = os.isWindows ? 'cmd set' : '/usr/bin/env';
            SystemWorker.exec(cmd).output.toString().split(os.EOL).forEach(function (line) {
                var parts = line.split('=');
                if (!parts.length) return;
                env[parts[0]] = parts[1];
            });
            return env;
        },
        enumerable: true
    });
}

// Note that this just a hack, not a real implementation
process.nextTick = function nextTick(callback) {
    setTimeOut(callback, 0);
}

// Static version number based on Wak 8
// @see https://github.com/Wakanda/core-Wakanda/wiki/branches#wak8
process.versions = {
  openssl: '1.0.0d',
  zlib: '1.2.5',
  // node specific - version numbers match to the expected API version support
  http_parser: '',
  node: '0.11.13',
  v8: '',
  ares: '',
  uv: '',
  modules: '',
  // wakanda specific
  wakanda: process.version.split(' ').pop(),
  webkit: '534.53',
  curl: '7.19.7',
  icu: '4.8',
  libzip: '0.10',
  xerces: '3.0.1'
};
if (os.isWindows) {
    process.versions.pthreads = '2.9.1'
}

process.binding = function binding(id) {
    return require('../binding/' + id);
};
