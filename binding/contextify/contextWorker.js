// Initialize a node friendly context
require('wakanda-node');

self.onmessage = function () {
    // arguments is used to not pollute the scope with more names
    // TODO add arguments[0].data.filename in stack traces

    if (arguments[0].data.sandboxArray) {
        // initialize the context with the sanbox
        arguments[0].data.sandboxArray.forEach(function (prop) {
            Object.defineProperty(global, prop.name, {
                get: function () {
                    return prop.value;
                },
                set: function (newValue) {
                    prop.value = newValue;
                }
            });    
        });
    }

    if (arguments[0].data.code) {
        self.postMessage({
            // run the code and return the result
            result: eval(arguments[0].data.code),
            // also return the potentially modified sandbox
            sandbox: arguments[0].data.sandboxArray
        });
    }

    if (arguments[0].data.close) {
        self.close();
    }
};