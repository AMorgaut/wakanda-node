var os = global.os;

var hw, hwLabels;
var EOL = os.isWindows ? '\r\n' : '\n';

function getHw() {
    var hwStr, ncpu, speed, model;
    if (!hw) {
        hwStr = SystemWorker.exec('sysctl -a').output.toString();
        hw = {};
        hwStr.split(EOL).forEach(function (line) {
            line = line.split(' = ');
            if (!hwLabels[line[0]]) return;
            hw[hwLabels[line[0]]] = line[1];
        });
        hw.CPUs = [];
        speed = hw.cpufrequency / 1000000;
        model = '';
        //model += 'Intel(R) Core(TM) i7 CPU       M 620  @ ';
        model += (speed / 1024).toFixed(2) + 'Ghz';
        for (ncpu = hw.ncpu; ncpu > 0; ncpu -= 1) {
            hw.CPUs.push({
                model: model,
                speed: speed,
                times: {
                    nice: 0,
                    irq: 0
                }
            });
        }
    }
    return hw;
}

hwLabels = {
    'kern.ostype': 'type',
    'kern.osrelease': 'release',
    'kern.osrevision': 'revision',
    'kern.hostname': 'hostname',
    'hw.memsize': 'totalmem',
    'hw.byteorder': 'byteorder',
    'hw.ncpu': 'ncpu',
    'hw.cpufrequency': 'cpufrequency'
};

exports.getOSType = function getOSType() {
    // Returns the operating system name.
    return getHw().type;
};

exports.getOSRelease = function getOSRelease() {
    // Returns the operating system release.
    return getHw().release;
};

exports.getHostname = function getHostname() {
    // Returns the hostname of the operating system.
    return getHw().hostname;
};

exports.getTotalMem = function getTotalMem() {
    // Returns the total amount of system memory in bytes.
    return getHw().totalmem;
};

exports.getEndianness = function getEndianness() {
    // TBD
    // Returns the endianness of the CPU. Possible values are "BE" or "LE".
    return getHw().byteorder === '1234' ? 'LE' : 'BE';
};

exports.getLoadAvg = function getLoadAvg() {

    //    Returns an array containing the 1, 5, and 15 minute load averages.
    //    The load average is a measure of system activity, calculated by the operating system and expressed as a fractional number. 
    //    As a rule of thumb, the load average should ideally be less than the number of logical CPUs in the system.
    //    The load average is a very UNIX-y concept; there is no real equivalent on Windows platforms. 
    //    That is why this function always returns [0, 0, 0] on Windows.
    if (os.isWindows) return [0, 0, 0];

    var result = SystemWorker.exec('sysctl -n vm.loadavg').output.toString();
    var avg = result.split(' ');
    return [avg[1], avg[2], avg[3]];
};


exports.getUptime = function getUptime() {
    // TBD
    // Returns the system uptime in seconds.
    console.warn('Current value returned by os.uptime() is not yet the same than the one returned by node.js');
    return SystemWorker.exec('uptime').output.toString();
};

exports.getFreeMem = function getFreeMem() {
    // TBD
    // Returns the amount of free system memory in bytes.
    console.warn('os.freemem() is not yet implemented');
    return;
};

exports.getCPUs = function getCPUs() {
    // Partial support for MacOS / BSD
    var iostatStr, iostat;
    var regex = /[\s]+/;
    iostatStr = SystemWorker.exec('iostat').output.toString();
    iostat = iostatStr.split(EOL)[2];
    iostat = iostat.trim().split(regex);
    console.warn('Current values returned by os.cpus() are not yet the same than the ones returned by node.js');
    return getHw().CPUs.map(function (current) {
        // TODO
        // should provide different values in "times" for each CPU
        current.times.user = iostat[3];
        current.times.sys = iostat[4];
        current.times.idle = iostat[5];
        return current;
    });
};

exports.getInterfaceAddresses = os.networkInterfaces;


global.os = require('os');

global.os.isWindows = os.isWindows;
global.os.isMac = os.isMac;
global.os.isLinux = os.isLinux;