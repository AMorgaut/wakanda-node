
var
    BASE_PATH = File(module.filename).parent.path,
    NODE_SOURCE = loadText(BASE_PATH + 'node/src/node.js');

// add a path to require to find raw node modules
//require.paths.push(BASE_PATH + 'lib_node/');

// add a path to require to find patched node modules
//require.paths.push(BASE_PATH + 'lib/');


// Update process APIs
require('./src/process');

// load and run node.js core
eval(NODE_SOURCE)(process);