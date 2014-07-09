/**
 * @module process
 * @class Process
 * @see http://nodejs.org/api/process.html
 **/


// tools

var execCommand;


function execShellCommand(command) {
    return SystemWorker.exec(command).output.toString();
}

function getPsCommand() {
    var cmd, line;
            
    function filterArgs(current) {
        return (current.trim().length > 0);
    }

    if (execCommand) {
        return execCommand;
    }
    cmd = 'ps  -o command -p ' + process.pid; // get the command path + its arguments
    line = execShellCommand(cmd).trim().split('\n').pop();
    execCommand = line.substr(process.execPath.length).split(' '); 
    execCommand = execCommand.filter(filterArgs)           
    return execCommand;
}



/**
 * A `Writable Stream` to `stdout`.
 * 
 * `process.stderr` and `process.stdout` are unlike other streams in Node in
 * that writes to them are usually blocking.
 *
 * @experimental
 * @property stdout
 * @type {WritableStream}
 * @see http://nodejs.org/api/process.html#process_process_stdout
 * @see https://github.com/joyent/node/tree/master/src/node.js
 **/

// Implemented by startup.processStdio() in src/node.js lines 615-625


/**
 * A `Writable Stream` to `stderr`.
 * 
 * `process.stderr` and `process.stdout` are unlike other streams in Node in
 * that writes to them are usually blocking.
 *
 * @experimental
 * @property stderr
 * @type {WritableStream}
 * @see http://nodejs.org/api/process.html#process_process_stderr
 * @see https://github.com/joyent/node/tree/master/src/node.js
 **/

// Implemented by startup.processStdio() in src/node.js lines 630-638


/**
 * A `Readable Stream` to `stin`.
 * 
 * Example of opening standard input and listening for both events:
 *
 *    process.stdin.setEncoding('utf8');
 *
 *    process.stdin.on('readable', function() {
 *      var chunk = process.stdin.read();
 *      if (chunk !== null) {
 *        process.stdout.write('data: ' + chunk);
 *      }
 *    });
 *
 *    process.stdin.on('end', function() {
 *      process.stdout.write('end');
 *    });
 *
 * @experimental
 * @property stin
 * @type {ReadableStream}
 * @see http://nodejs.org/api/process.html#process_process_stin
 * @see https://github.com/joyent/node/tree/master/src/node.js
 **/

// Implemented by startup.processStdio() in src/node.js lines 640-699



(function ScopeArgs() {

var execPath, argv, execArgv;

function getPsCommand() {
    var cmd, line;
            
    function filterArgs(current) {
        return (current.trim().length > 0);
    }

    if (execCommand) {
        return execCommand;
    }
    cmd = 'ps  -o command -p ' + process.pid; // get the command path + its arguments
    line = execShellCommand(cmd).trim().split('\n').pop();
    execCommand = line.substr(process.execPath.length).split(' '); 
    execCommand = execCommand.filter(filterArgs)           
    return execCommand;
}


/**
 * An array containing the command line arguments.  The first element will be
 * 'node', the second element will be the name of the JavaScript file.  The
 * next elements will be any additional command line arguments.
 *
 * @property argv
 * @type {Array}
 * @warning may be wrong if some argument contain escaped spaces (ex: from paths)
 * @see http://nodejs.org/api/process.html#process_process_argv
 **/
if (!process.argv) {
    Object.defineProperty(process, 'argv', {
        get: function process_argv_getter() {
            var data;
            
            function filterArgv(current) {
                return (process.execArgv.indexOf(current) === -1);
            }

            if (argv) {
                return argv;
            }

            if (os.isWindows) {
                return [];
            }
            
            // argv[0] is updated afterward by startup.resolveArgv0() in src/node.js lines 814-828
            // argv[1..n]
            data = getPsCommand();
            argv = [process.execPath.split('/').pop()].concat(data.filter(filterArgv));

//            if (!argv[1]) {
//                argv[1] = process.cwd() + '/index.js';
//            }

            return argv;
        },
        enumerable: true
    });
}


/**
 * This is the absolute pathname of the executable that started the process.
 *
 * @property execPath
 * @type {string}
 * @warning may be wrong if some argument contain escaped spaces (ex: from paths)
 * @see http://nodejs.org/api/process.html#process_process_execPath
 **/

if (!process.execPath) {
    Object.defineProperty(process, 'execPath', {
        get: function process_argv_getter() {
            if (execPath) {
                return execPath;
            }
            execPath = execShellCommand('ps  -o comm -p ' + process.pid).trim().split('\n').pop();
            return execPath;
        },
        enumerable: true
    });
}


/**
 * This is the set of node-specific command line options from the
 * executable that started the process.  These options do not show up in
 * `process.argv`, and do not include the node executable, the name of
 * the script, or any options following the script name. These options
 * are useful in order to spawn child processes with the same execution
 * environment as the parent.
 *
 * @property execArgv
 * @type {Array}
 * @warning may be wrong if some argument contain escaped spaces (ex: from paths)
 * @see http://nodejs.org/api/process.html#process_process_execArgv
 **/
if (!process.execArgv) {
    Object.defineProperty(process, 'execArgv', {
        get: function process_execArgv_getter() {
            var data;
            
            function filterArgs(current) {
                return (current.trim().length > 0);
            }

            if (execArgv) {
                return execArgv;
            }

            if (os.isWindows) {
                return [];
            }

            data = getPsCommand();
            execArgv = data.filter(filterExecArgv); // return only

            return execArgv;
        },
        enumerable: true
    });
}


}()); // End Scope_Args 


/**
 * This causes node to emit an abort. This will cause node to exit and
 * generate a core file.
 *
 * @experimental
 * @method abort
 * @see http://nodejs.org/api/process.html#process_process_abort
 **/
if (!process.abort) {
    process.abort = function abort() {
        execShellCommand('kill - 9 ' + process.pid);
    }
}


/**
 * Changes the current working directory of the process or throws an exception if that fails.
 *
 *   console.log('Starting directory: ' + process.cwd());
 *   try {
 *     process.chdir('/tmp');
 *     console.log('New directory: ' + process.cwd());
 *   }
 *   catch (err) {
 *     console.log('chdir: ' + err);
 *   }
 *
 * @experimental
 * @method chdir
 * @see http://nodejs.org/api/process.html#process_process_chdir
 **/
process.chdir = process.chdir || function chdir(directory) {
    throw new Error('process.chdir() not implemented');
};



/**
 * Returns the current working directory of the process.
 *
 *   console.log('Current directory: ' + process.cwd());
 *
 * @method cwd
 * @type {Object}
 * @experimental return the project folder from a running solution
 * @see http://nodejs.org/api/process.html#process_process_cwd
 **/
process.cwd = process.cwd || function cwd() {
    var output, path, cmd, result;
    if (typeof application === 'object') {
        output = application.getFolder().path;
        path = output.substr(0, output.length - 1);
    } else {
        // tested on MacOS
        cmd = 'lsof -a -p ' + process.pid + ' -d cwd -Fn';
        result = execShellCommand(cmd).trim();
        path = result.split('\n').pop().substr(1);
    }
    return path;
};


/**
 * An object containing the user environment. See environ(7).
 *
 * @property env
 * @type {string}
 * @see http://nodejs.org/api/process.html#process_process_env
 **/
 if (!process.env) {
    Object.defineProperty(process, 'env', {
        get: function process_env_getter() {
            var env = {};
            var cmd = os.isWindows ? 'cmd set' : '/usr/bin/env';
            execShellCommand(cmd).split(os.EOL).forEach(function parseEnvVariable(line) {
                var parts = line.split('=');
                if (!parts.length) return;
                env[parts[0]] = parts[1];
            });
            return env;
        },
        enumerable: true
    });
}


/**
 * Ends the process with the specified `code`.  If omitted, exit uses the
 *'success' code `0`.
 *
 * To exit with a 'failure' code:
 *
 *    process.exit(1);
 *
 * The shell that executed node should see the exit code as 1.
 *
 * @method exit
 * @param {string} [code]
 * @see http://nodejs.org/api/process.html#process_process_exit
 **/

// Implemented by startup.processKillAndExit() in src/node.js lines 707-738


/**
 * Gets the group identity of the process. (See getgid(2).)
 * This is the numerical group id, not the group name.
 *
 *    if (process.getgid) {
 *      console.log('Current gid: ' + process.getgid());
 *    }
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @method getgid
 * @return number
 **/
if (!process.getgid && !os.isWindows) {
    var gid;
    process.getgid = function () {
        var cmd, result;
        if (gid) {
            return gid;
        }
        cmd = 'ps -o gid -p ' + process.pid;
        result = execShellCommand(cmd).trim();
        gid = parseInt(exec.split('\n').pop(), 10);
        return gid;
    };
}



/**
 * Sets the group identity of the process. (See setgid(2).)  This accepts either
 * a numerical ID or a groupname string. If a groupname is specified, this method
 * blocks while resolving it to a numerical ID.
 *
 *    if (process.getgid && process.setgid) {
 *      console.log('Current gid: ' + process.getgid());
 *      try {
 *        process.setgid(501);
 *        console.log('New gid: ' + process.getgid());
 *      }
 *      catch (err) {
 *        console.log('Failed to set gid: ' + err);
 *      }
 *    }
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @experimental
 * @method setgid
 * @param {number} gid
 **/
if (!process.setgid && !os.isWindows) {
//    process.setgid = function (gid) {
//        throw new Error('process.setgid(gid) is not implemented')
//    };
}




/**
 * Gets the user identity of the process. (See getuid(2).)
 * This is the numerical userid, not the username.
 *
 *    if (process.getuid) {
 *      console.log('Current uid: ' + process.getuid());
 *    }
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @method getuid
 * @return number
 **/
if (!process.getuid && !os.isWindows) {
    var uid;
    process.getuid = function () {
        var cmd, exec;
        if (gid) {
            return gid;
        }
        cmd = 'ps -o uid -p ' + process.pid;
        exec = execShellCommand(cmd);
        uid = parseInt(exec.split('\n').pop(), 10);
        return uid;
    };
}




/**
 * Sets the user identity of the process. (See setuid(2).)  This accepts either
 * a numerical ID or a username string. If a username is specified, this method
 * blocks while resolving it to a numerical ID.
 *
 *    if (process.getuid && process.setuid) {
 *      console.log('Current uid: ' + process.getuid());
 *      try {
 *        process.setuid(501);
 *        console.log('New uid: ' + process.getuid());
 *      }
 *      catch (err) {
 *        console.log('Failed to set uid: ' + err);
 *      }
 *    }
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @experimental
 * @method setuid
 * @param {number} uid
 **/
if (!process.setuid && !os.isWindows) {
//    process.setuid = function (uid) {
//        throw new Error('process.setuid(uid) is not implemented')
//    };
}




 
 function parseInt10(value) {
     return parseInt(value, 10);
 }

/**
 * Returns an array with the supplementary group IDs. POSIX leaves it unspecified
 * if the effective group ID is included but node.js ensures it always is
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @method getgroups
 * @return {Array}
 **/
 if (!process.getgroups && !os.isWindows) {
    process.getgroups = function () {
        var groups;
        groups = execShellCommand('id -G').trim();
        return groups.split(' ').map(parseInt10);
    };
}



/**
 * Sets the supplementary group IDs. This is a privileged operation, meaning you
 * need to be root or have the CAP_SETGID capability.
 *
 * The list can contain group IDs, group names or both.
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @experimental
 * @method setgroups
 * @param {Array} groups
 **/
if (!process.setgroups && !os.isWindows) {
//    process.setgroups = function (groups) {
//        throw new Error('process.setgroups(groups) is not implemented')
//    };
}




/**
 * Reads /etc/group and initializes the group access list, using all groups of
 * which the user is a member. This is a privileged operation, meaning you need
 * to be root or have the CAP_SETGID capability.
 *
 * Note: this function is only available on POSIX platforms (i.e. not Windows)
 *
 * @experimental
 * @method initgroups
 * @param {Array} user user name or user ID
 * @param {Array} extra_group group name or group ID
 **/
if (!process.initgroups && !os.isWindows) {
//    process.initgroups = function (user, extra_group) {
//        throw new Error('process.setgroups(groups) is not implemented')
//    };
}


/**
 * A compiled-in property that exposes the current Wakanda version.
 *
 *    console.log('Version: ' + process.version);
 *
 * @method version
 * @return string
 **/
 
 // implemented natively by wakanda


/**
 * A property exposing version strings of node and its dependencies.
 *
 *   console.log(process.versions);
 *
 * Will print something like:
 *
 *   { openssl: '1.0.0d',
 *     zlib: '1.2.5',
 *     node: '0.10.12',
 *     modules: '11',
 *     wakanda: '8.159169',
 *     webkit: '534.53',
 *     curl: '7.19.7',
 *     icu: '4.8',
 *     libzip: '0.10',
 *     xerces: '3.0.1' }
 *
 * @property versions
 * @type {Object}
 * @experimental this is just a hack, not a real implementation
 * @todo change static values for dynamic ones?
 * @see http://nodejs.org/api/process.html#process_process_versions
 * @see https://github.com/Wakanda/core-Wakanda/wiki/branches
 **/
var wakandaVersion = process.version.split(' ').pop();
var majorVersion = wakandaVersion.split('.').shift();
process.versions = {
    openssl: ({
        '8': '1.0.0d',
        '7': '1.0.0d',
        '6': '1.0.0d',
        '5': '1.0.0d',
        '4': '1.0.0d',
        '3': '1.0.0d',
        '2': '1.0.0d'
    })[majorVersion],
    zlib: ({
        '8': '1.2.5',
        '7': '1.2.5',
        '6': '1.2.5',
        '5': '1.2.5',
        '4': '1.2.5',
        '3': '1.2.5',
        '2': '1.2.5'
    })[majorVersion],
    // NODE SPECIFIC - version numbers match to the expected API version support
    //http_parser: '1.0',
    node: '0.10.12',
    // v8: '3.14.5.9', 
    //ares: '1.9.0-DEV',
    //uv: '0.10.11',
    modules: '11',
    // WAKANDA SPECIFIC
    wakanda: wakandaVersion,
    webkit: ({
        '8': '534.53',
        '7': '534.53.W7',
        '6': '534.53',
        '5': '534.53.W5',
        '4': '534.53.W4',
        '3': '534.53',
        '2': '534.53'
    })[majorVersion],
    curl: ({
        '8': '7.19.7',
        '7': '7.19.7',
        '6': '7.19.7',
        '5': '7.19.7',
        '4': '7.19.7',
        '3': '7.19.7',
        '2': '7.19.7'
    })[majorVersion],
    icu: ({
        '8': '4.8',
        '7': '4.8',
        '6': '4.8',
        '5': '4.8',
        '4': '4.8',
        '3': '4.8',
        '2': '4.8'
    })[majorVersion],
    libzip: ({
        '8': '0.10',
        '7': '0.10',
        '6': '0.10',
        '5': '0.10',
        '4': '0.10',
        '3': '0.10',
        '2': '0.10'
    })[majorVersion],
    xerces: ({
        '8': '3.0.1',
        '7': '3.0.1',
        '6': '3.0.1',
        '5': '3.0.1',
        '4': '3.0.1',
        '3': '3.0.1',
        '2': '3.0.1'
    })[majorVersion]
};
if (os.isWindows) {
    process.versions.pthreads = ({
        '8': '2.9.1',
        '7': '2.9.1',
        '6': '2.9.1',
        '5': '2.9.1',
        '4': '2.9.1',
        '3': '2.9.1',
        '2': '2.8.0'
    })[majorVersion]
}




/**
 * An Object containing the JavaScript representation of the configure options
 * that were used to compile the current node executable. This is the same as
 * the "config.gypi" file that was produced when running the `./configure` script.
 *
 * An example of the possible output looks like:
 *
 *   { target_defaults:
 *      { cflags: [],
 *        default_configuration: 'Release',
 *        defines: [],
 *        include_dirs: [],
 *        libraries: [] },
 *     variables:
 *      { host_arch: 'x64',
 *        node_install_npm: 'true',
 *        node_prefix: '',
 *        node_shared_cares: 'false',
 *        node_shared_http_parser: 'false',
 *        node_shared_libuv: 'false',
 *        node_shared_v8: 'false',
 *        node_shared_zlib: 'false',
 *        node_use_dtrace: 'false',
 *        node_use_openssl: 'true',
 *        node_shared_openssl: 'false',
 *        strict_aliasing: 'true',
 *        target_arch: 'x64',
 *        v8_use_snapshot: 'true' } }
 *
 * @property config
 * @type {Object}
 * @experimental this is just a hack, not a real implementation
 * @todo change static values for dynamic ones?
 * @see http://nodejs.org/api/process.html#process_process_config
 **/
process.config = {
    target_defaults: {
        cflags: [],
        default_configuration: process.version[0] === '0' ? 'Development' : 'Release',
        defines: [],
        libraries: []
    },
    variables: {
        //host_arch: 'x64', // return current platform arch via uname
        node_install_npm: 'true',
        node_prefix: '',
        node_shared_cares: 'false',
        node_shared_http_parser: 'false',
        node_shared_libuv: 'false',
        node_shared_v8: 'false',
        node_shared_zlib: 'false', // wakanda embed zlib
        node_use_dtrace: 'false',
        node_use_openssl: 'true', // wakanda has openssl
        node_shared_openssl: 'false', //wakanda embed openssl
        strict_aliasing: 'true',
        //target_arch: 'x64', // return current platform arch via uname
        v8_use_snapshot: 'true' 
    }
};
Object.defineProperty(process.config.variables,  'host_arch',  {
    get: process_arch_getter,
    enumerable: true
});
Object.defineProperty(process.config.variables,  'target_arch',  {
    get: process_arch_getter,
    enumerable: true
});


/**
 * Send a signal to a process. `pid` is the process id and `signal` is the
 * string describing the signal to send.  Signal names are strings like
 * 'SIGINT' or 'SIGHUP'.  If omitted, the signal will be 'SIGTERM'.
 * See [Signal Events](#process_signal_events) and kill(2) for more information.
 *
 * Will throw an error if target does not exist, and as a special case, a signal of
 * `0` can be used to test for the existence of a process.
 *
 * Note that just because the name of this function is `process.kill`, it is
 * really just a signal sender, like the `kill` system call.  The signal sent
 * may do something other than kill the target process.
 *
 * Example of sending a signal to yourself:
 *
 *   process.on('SIGHUP', function() {
 *     console.log('Got SIGHUP signal.');
 *   });
 *
 *   setTimeout(function() {
 *     console.log('Exiting.');
 *     process.exit(0);
 *   }, 100);
 *
 *   process.kill(process.pid, 'SIGHUP');
 *
 * Note: When SIGUSR1 is received by Node.js it starts the debugger, see
 * [Signal Events](#process_signal_events).
 *
 * @method kill
 * @param {number} pid process id
 * @param {string} signal string describing the signal to send
 * @returns mixed
 * @see http://nodejs.org/api/process.html#process_process_kill
 **/


// Implemented by startup.processKillAndExit() in src/node.js lines 707-738




/**
 * The PID of the process.
 *
 *   console.log('This process is pid ' + process.pid);
 *
 * @property process.pid
 * @type (number}
 **/

// Implemented natively by Wakanda




/**
 * Getter/setter to set what is displayed in 'ps'.
 *
 * When used as a setter, the maximum length is platform-specific and probably
 * short.
 *
 * On Linux and OS X, it's limited to the size of the binary name plus the
 * length of the command line arguments because it overwrites the argv memory.
 *
 * v0.8 allowed for longer process title strings by also overwriting the environ
 * memory but that was potentially insecure/confusing in some (rather obscure)
 * cases.
 *
 * @experimental
 * @property title
 * @type {string}
 **/
Object.defineProperty(process, 'title', {
    get: function getProcessTitle() {
        return process.execPath.split('/').pop();
    },
    set: function setProcessTitle(title) {
        throw new Error('process.title setter is not yet implemented');
    },
    enumerable: true
})





function process_arch_getter() {
    var arch;
    var cmd = os.isWindows ? 'uname -a' : 'NOT IMPLEMENTED';
    arch = execShellCommand(cmd).split(' ').pop();
    arch = arch.indexOf('_64') ? 'x64' : 'x32';
    return arch;
}

/**
 * What processor architecture you're running on: 'arm', 'ia32', or 'x64'.
 *
 *   console.log('This processor architecture is ' + process.arch);
 *
 * @experimental no arm support - no windows support
 * @property arch
 * @type {Array}
 * @see http://nodejs.org/api/process.html#process_process_arch
 **/
if (!process.arch) {
    Object.defineProperty(process, 'arch', {
        get: process_arch_getter,
        enumerable: true
    });
}



/**
 * What platform you're running on:
 * `'darwin'`, `'freebsd'`, `'linux'`, `'sunos'` or `'win32'`
 *
 *   console.log('This platform is ' + process.platform);
 *

* @experimental
 * @property platform
 * @type {string}
 * @see http://nodejs.org/api/process.html#process_process_platform
 **/
 Object.defineProperty(process, 'platform', {
    // Wakanda makes no difference between freebsd, linux and sunos
    // sunos probably not supported 
    // diff between linux and freebsd should be checked via SystemWorker.exec()
    get: function process_platform_getter() {
        return os.isWindows ? 'win32' : (os.isMac ? 'darwin' : 'freebsd');
    }
});

/**
 * Returns an object describing the memory usage of the Node process
 * measured in bytes.
 *
 *   var util = require('util');
 *
 *   console.log(util.inspect(process.memoryUsage()));
 *
 * This will generate:
 *
 *   { rss: 4935680,
 *     heapTotal: 1826816,
 *     heapUsed: 650472 }
 *
 * `heapTotal` and `heapUsed` refer to V8's memory usage. and are not then
 * supported by wakanda
 *
 * @experimental
 * @method memoryUsage
 * @returns {Object}
 **/
process.memoryUsage = process.memoryUsage || function memoryUsage() {
    var result, rss;
    result = execShellCommand('ps -o rss -p ' + process.pid).trim();
    rss = parseInt(result.split('\n').pop(), 10);
    console.warning('heapTotal and heapUsed not yet supported by process.memoryUsage()');
    return {
        rss: rss * 1024 // KBytes to Bytes
    };
};


/**
 * On the next loop around the event loop call this callback.
 * This is *not* a simple alias to `setTimeout(fn, 0)`, it's much more
 * efficient.  It typically runs before any other I/O events fire, but there
 * are some exceptions.  See `process.maxTickDepth` below.
 *
 *   process.nextTick(function() {
 *     console.log('nextTick callback');
 *   });
 *
 * This is important in developing APIs where you want to give the user the
 * chance to assign event handlers after an object has been constructed,
 * but before any I/O has occurred.
 *
 *   function MyThing(options) {
 *     this.setupOptions(options);
 *
 *     process.nextTick(function() {
 *       this.startDoingStuff();
 *     }.bind(this));
 *   }
 *
 *   var thing = new MyThing();
 *   thing.getReadyForStuff();
 *
 *   // thing.startDoingStuff() gets called now, not before.
 *
 * It is very important for APIs to be either 100% synchronous or 100%
 * asynchronous.  Consider this example:
 *
 *    // WARNING!  DO NOT USE!  BAD UNSAFE HAZARD!
 *   function maybeSync(arg, cb) {
 *     if (arg) {
 *       cb();
 *       return;
 *     }
 *
 *     fs.stat('file', cb);
 *   }
 *
 * This API is hazardous.  If you do this:
 *
 *   maybeSync(true, function() {
 *     foo();
 *   });
 *   bar();
 *
 * then it's not clear whether `foo()` or `bar()` will be called first.
 *
 * This approach is much better:
 *
 *   function definitelyAsync(arg, cb) {
 *     if (arg) {
 *       process.nextTick(cb);
 *       return;
 *     }
 *
 *     fs.stat('file', cb);
 *   }
 *
 * @experimental 
 * @method nextTick
 * @param {function} callback
 * @see http://nodejs.org/api/process.html#process_process_nexttick_callback
 **/
 
 // Implemented by startup.processNextTick() from src/node.js
 
 
/**
 * Callbacks passed to `process.nextTick` will *usually* be called at the
 * end of the current flow of execution, and are thus approximately as fast
 * as calling a function synchronously.  Left unchecked, this would starve
 * the event loop, preventing any I/O from occurring.
 *
 * Consider this code:
 *
 *   process.nextTick(function foo() {
 *     process.nextTick(foo);
 *   });
 *
 * In order to avoid the situation where Node is blocked by an infinite
 * loop of recursive series of nextTick calls, it defers to allow some I/O
 * to be done every so often.
 *
 * The `process.maxTickDepth` value is the maximum depth of
 * nextTick-calling nextTick-callbacks that will be evaluated before
 * allowing other forms of I/O to occur.
 *
 * @experimental 
 * @property maxTickDepth
 * @type {number}
 * @default 1000
 * @see http://nodejs.org/api/process.html#process_process_maxTickDepth
 **/
 
 // Implemented by startup.processNextTick() from src/node.js


/**
 * Sets or reads the process's file mode creation mask. Child processes inherit
 * the mask from the parent process. Returns the old mask if `mask` argument is
 * given, otherwise returns the current mask.
 *
 *   var oldmask, newmask = 0644;
 *
 *   oldmask = process.umask(newmask);
 *   console.log('Changed umask from: ' + oldmask.toString(8) +
 *               ' to ' + newmask.toString(8));
 *
 * experimental
 * @method umask
 * @param {number} mask
 * @returns {number}
 **/
process.umask = process.umask || function umask(mask) {
    var result;
    // GETTER ONLY
    result = execShellCommand('umask');
    return parseInt(result, 8);
};


/**
 * Number of seconds Node has been running.
 *
 * @method uptime
 * @return {number}
 **/


/***************************************************************************/
/*                 LOW LEVEL API USED BY "src/node.js"                     */
/***************************************************************************/


/**
 * @property binding
 * @type {Object}
 * @see http://nodejs.org/api/process.html#process_process_binding
 **/
process.binding = function binding(id) {
    return require('../binding/' + id);
};


// -> NativeModule.require()
process.moduleLoadList = [];

// -> startup()
// Not null If User passed '-e' or '--eval' arguments to Node.
process._eval = null;

// -> startup()
// Not null If -i or --interactive were passed, or stdin is a TTY.
process._forceRepl = null;

// -> startup.processNextTick()
process._needTickCallback = function(){};
process._tickInfoBox = {};

// -> startup.processNextTick() -> evalScript()
process._print_eval = false;



// -> startup.processKillAndExit()
var LINUX_SIGNALS = {
    1:	 'HUP', // (hang up)
    2:	 'INT', // (interrupt)
    3:	 'QUIT', // (quit)
    6:	 'ABRT', // (abort)
    9:	 'KILL', // (non-catchable, non-ignorable kill)
    14:	 'ALRM', // (alarm clock)
    15:	 'TERM' // (software termination signal)
};
process._errno = 0;
    
/**
 * @method process.kill
 * @param {number} pid process id
 * @param {string} signal string describing the signal to send
 * @returns mixed
 *
 * @see http://nodejs.org/api/process.html#process_process_kill_pid_signal
 * @see http://nodejs.org/api/process.html#process_signal_events
 **/
process._kill = function process_kill(pid, signal) {
    var
        cmd,
        cmdSignal,
        result;

    process._errno = 0;

    if (os.isWindows) {
        throw new Error('kill() is not yet implemented on Windows');
    }
    
    cmdSignal = constants[signal];
    if (!cmdSignal || !LINUX_SIGNALS.hasOwnProperty(cmdSignal)) {
        throw new Error('signal "' + signal + '" is not supported by process.kill()');
    }
    
    pid = Number(pid);
    cmd = 'kill -' + cmdSignal + ' ' + pid;
    result = SystemWorker.exec(cmd).output.toString();
};


/***************************************************************************/
/*                 LOW LEVEL API IMPLEMENTED ELSEWHERE                     */
/***************************************************************************/

/**
 * @private
 * @property process.mainModule
 * @type {Module}
 * @see https://github.com/joyent/node/tree/master/lib/module.js
 **/