# wakanda-node


## About

### Wakanda

To make its **Server-Side JavaScript** as most standard and compatible with Client-Side JavaScript, [Wakanda](http://wakanda.org) has been mostly based on the native support of **CommonJS** and **HTML5 API on the server** like

* [W3C Blob](http://doc.wakanda.org/BLOB/BLOB.100-866245.en.html)
* [W3C FileSystem](http://doc.wakanda.org/Files-and-Folders/Files-and-Folders.100-588941.en.html)
* [W3C Web Sockets](http://doc.wakanda.org/WebSocket-Client/WebSocket-Client.100-1038292.en.html) (from Wakanda 9)
* [W3C Web Storage](http://doc.wakanda.org/Storage/Storage.100-941570.en.html)
* [W3C Web Workers](http://doc.wakanda.org/Web-Workers/Web-Workers.100-688487.en.html)
* [W3C XMLHttpRequest](http://doc.wakanda.org/XMLHttpRequest/XMLHttpRequest.100-867248.en.html)

but it still already support some **node.js API** including:

* [Assert](http://doc.wakanda.org/Unit-Testing/Unit-Testing.100-1019075.en.html)
* [Buffer](http://doc.wakanda.org/Buffer/Buffer.100-805374.en.html)
* [Crypto](http://doc.wakanda.org/Crypto/Crypto.100-1052580.en.html) (partial)
* [Events](http://doc.wakanda.org/Events/Events.100-967582.en.html)
* [Net](http://doc.wakanda.org/Net/Net.100-967781.en.html)
* [Process](http://doc.wakanda.org/Global-Application/Application/process.303-933138.en.html) (partial & partial documentation)
* [TLS](http://doc.wakanda.org/TLS-SSL/TLS-SSL.100-967962.en.html) (partial)

### wakanda-node

This [wakanka-node](https://github.com/AMorgaut/wakanda-node) package is meant to add more [node.js](http://nodejs.org) API support to [Wakanda Server](http://wakanda.org) to make more node.js modules compatible with Wakanda (and to also directly bring additionnal nice features for your own code).

This is mostly done using some **original node.js JavaScript source files** from its [official github repository](https://github.com/joyent/node/), but will also include some patches and polyfil to make Wakanda even more node compliant.

Current wakanda-node version is based on node.js version 0.11.13

## Additional Node.js API


This version of the package add the following API:

* [Globals](http://nodejs.org/api/globals.html) (partial) ([local node doc](./doc_node/globals.markdown))
	* **`global`**: ([node doc](http://nodejs.org/api/globals.html#globals_global) | [local node doc](./doc_node/globals.markdown#global))
* **[Os](http://nodejs.org/api/os.html)** (miss `os.cpus()`, `os.freemem()`, `os.tmbdir()`, `os.uptime()`) ([local node doc](./doc_node/os.markdown))
* **[Punycode](http://nodejs.org/api/punycode.html):** used via `require('punnycode')` ([local node doc](./doc_node/punycode.markdown))
* [Process](http://nodejs.org/api/process.html) (partial) ([local node doc](./doc_node/process.markdown))
	* **`process.platform`**
	* **`process.env`** (empty, still useful as is to prevent exceptions)
	* **`process.versions`** (almost empty)
	* **`process.binding`** (internal)
* **[Query Strings](http://nodejs.org/api/querystring.html):** used via `require('querystring')`([local node doc](./doc_node/querystring.markdown))
* **[Url](http://nodejs.org/api/url.html):** used via `require('url')`([local node doc](./doc_node/url.markdown))
* **[Utilities](http://nodejs.org/api/util.html):** used via `require('util')`([local node doc](./doc_node/util.markdown))

## How to use

Once installed, just start your code with this simple line

`javascript
require('wakanda-node');
`

All code that will then be executed in this thread, either from the same file, included files, or modules loaded with `require()`), will have access to the additionnal Node.js API. 

If you call a dedicated or shared worker that need such additionnal node.js API, make sure to initialize them with this line too

__TIPS:__ 

This code be added to the **required.js** file at the [project](http://doc.wakanda.org/Architecture-of-Wakanda-Applications/Project.200-1022680.en.html#1022932) or [solution](http://doc.wakanda.org/Architecture-of-Wakanda-Applications/Solution.200-1022674.en.html#1022744) level to automatically initialyse all of their Wakanda thread with **wakanda-node**


## Architecture

### [index.js](./blob/master/index.js)

Add *[lib_node](./tree/lib_node)* the `require()` paths so it can find the additionnal core node modules

### [binding](./master/tree/binding)

Polyfils written in JS of C node.js modules called from JavaScript via `process.binding(id)`

### [lib](./master/tree/lib)

Polyfil files to extend current Wakanda support of some node.js API

### [lib_node](./master/tree/lib_node)

Contains conform copies of some **node.js JavaScript source files** from the [**"lib"**](https://github.com/joyent/node/tree/master/lib) folder of its [official github repository](https://github.com/joyent/node/) 

### [doc_node](./master/tree/doc_node)

Contains conform copies of some **node.js Markdown doc files** from the [**"doc/api"**](https://github.com/joyent/node/tree/master/doc/api) folder of its [official github repository](https://github.com/joyent/node/) 

## License

Copyright (c) 2014 Alexandre Morgaut

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.