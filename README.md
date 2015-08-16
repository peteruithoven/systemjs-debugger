SystemJS Debugger
=================

Enables debugging SystemJS (JSPM) configuration.

After import it will keep a record of all imports and their information. You can log them in a readable way to a console using `logImports()`. You can also visualize them in your own way by retrieving the imports data using `getImports()`.

Usage
---------------
``` javascript
// import debugger first
System.import('systemjs-debugger').then(function(systemJSDebugger) {
  // log imports when import succeeds or fails
  systemJSDebugger.loggedImport('app.js')
});
```
Manually calling logImports()
``` javascript
// import debugger first
System.import('systemjs-debugger').then(function(systemJSDebugger) {
  System.import('app.js')
    .then(function() {
      // log imports after import
      systemJSDebugger.logImports();
      window.onerror = null;
    })
    .catch(function(err) {
      console.error(err);
      // log imports on errors
      systemJSDebugger.logImports();
    });
    // log imports on errors
    window.onerror = systemJSDebugger.logImports;
});
```
Example output
---------------
![Example output](https://github.com/peteruithoven/systemjs-debugger/raw/master/systemjs-debugger-logs-example.png)
