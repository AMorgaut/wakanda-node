/**
 * @module binding(contextify)
 *
 * @experimental
 *
 * Used by the module "vm"
 * First goal is to be able to run node.js unit tests to check node API implementation in wakanda-node
 * May not behave exactly like the node.js version (but doesn't behave the same between different versions of node by the way...)
 * 
 * Use Workers to create real dedicated global contexts per proposed sandbox objects
 *
 * @see http://nodejs.org/api/vm.html
 **/

// The binding provides a few useful primitives:
// - ContextifyScript(code, { filename = "evalmachine.anonymous",
//                            displayErrors = true } = {})
//   with methods:
//   - runInThisContext({ displayErrors = true } = {})
//   - runInContext(sandbox, { displayErrors = true, timeout = undefined } = {})
// - makeContext(sandbox)
// - isContext(sandbox)
// From this we build the entire documented API.

if (typeof __dirname === 'undefined') {
    __dirname = File(module.filename).parent.path;
}

var sandboxes = [];
var contexts = [];

exports.ContextifyScript = ContextifyScript;
exports.makeContext = makeContext;
exports.isContext = isContext;
exports.deleteContext = deleteContext;

/**
 * @class Context
 * @constructor
 * @param {Object} sandbox
 */
function Context(sandbox) {
    // transform sandbox to an array
    var sandboxArray = Object.getOwnPropertyNames(sandbox).map(function (name) {
        return {name: name, value: sandbox[name]};
    });

    this.worker = new Worker(__dirname + 'contextWorker.js');

    // send the sandbox and code to the prepared context/worker
    this.worker.postMessage({sandboxArray: sandboxArray});
    
    sandboxes.push(sandbox);
    contexts.push(this);
}

/**
 * @param {Object} sandbox
 **/
function makeContext(sandbox) {
    new Context(sandbox);
}

/**
 * @param (Object) sandbox
 * @return boolean
 **/
function isContext(sandbox) {
    return sandboxes.indexOf(sandbox) > -1;
}

/**
 * @param {Object} sandbox
 **/
function deleteContext(sandbox) {
    var index = sandboxes.indexOf(sandbox);
    if (index === -1) return false;
    contexts[index].worker.postMessage({close: true});
    delete sandboxes[index];
    delete contexts[index];
    return true;
}

/**
 * The code is not compiled as in node.js but the Context is really sandboxed and initialized once
 *
 * @class ContextifyScript
 *
 * @constructor
 * @param {string} code
 * @param {Object} options
 **/
function ContextifyScript(code, options) {

    this.filename = options.filename || "evalmachine.anonymous";
    this.displayErrors = options && options.displayErrors;
    if (typeof this.displayErrors !== 'boolean') {
        this.displayErrors = true;
    }
    this.code = code;
    this.sandbox = {};

}


/**
 * @method runInThisContext
 * @param {Object} options
 **/
ContextifyScript.prototype.runInThisContext = function runInThisContext(options) {
    return this.runInContext(this.sandbox, options);
};


/**
 * @method runInContext
 * @param {Object} sandbox
 * @param {Object} options
 **/
ContextifyScript.prototype.runInContext = function runInContext(sandbox, options) {
    // TODO manage this.displayError / options.displayError
    
    var context, result;
    
    if (!isContext(sandbox)) {
        makeContext(sandbox);
    }
    context = contexts[sandboxes.indexOf(sandbox)];

    // set the worker callback to receive the result and send it back
    context.worker.onmessage = function (event) {
        result = event.data.result;
        event.data.sandboxArray.forEach(function (prop) {
            // update the sandbox
            sandbox[prop.name] = prop.value;
        });
        exitWait();
    };

    // send the sandbox and code to the prepared context/worker
    context.worker.postMessage({
        filename: options.filename || this.filename,
        code: this.code
    });
    // wait for the result from the worker (runInContext is synchronous)
    wait();
    return result;
};


