exports.Context = Context;

exports.NodeScript = {
    NodeScript: NodeScript,
    createContext: createContext,
    runInContext: runInContext,
    runInThisContext: runInThisContext,
    runInNewContext: runInNewContext
};

function Context() {
}

function NodeScript() {
}

function createContext() {
}

function runInContext() {
}

function runInThisContext(source, filename, flag) {
    return eval(source);
}

function runInNewContext() {
}

NodeScript.runInThisContext = runInThisContext;