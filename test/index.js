require('wakanda-node');

function runTest(api) {
    try {
        require('../test_node/simple/test-' + api);
        console.info('PASSED - ' + api);
    }
    catch (e) {
        console.error('FAILED - ' + api + ':', e);
    }
}

TESTS = [
    'global',
    'punycode', // fail
    'querystring', 
    'url', 
    'util'
]

TESTS.forEach(runTest);

console.content;
