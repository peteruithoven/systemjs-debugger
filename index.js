var imports = {};
var systemNormalize = System.normalize;
System.normalize = function (path, importFrom) {
  var promise = systemNormalize.apply(this, arguments);
  promise.then(function (normalizedPath) {
    imports[normalizedPath] = {
      importPath: path,
      path: normalizedPath,
      from: importFrom,
      deps: []
    };
  });
  return promise;
};

var systemLocate = System.locate;
System.locate = function (load) {
  var importData = imports[load.name];
  importData.metadata = load.metadata;
  var fromData = imports[importData.from];
  if (fromData) {
    fromData.deps.push(importData);
  }
  return systemLocate.apply(this, arguments);
};

export function logImport (importData) {
  console.groupCollapsed(importData.importPath);
  console.log('path: ', importData.path);
  var metadata = importData.metadata;
  for (let metaKey in metadata) {
    if (metaKey === 'deps') continue;
    var metaValue = metadata[metaKey];
    if (metaValue !== undefined) {
      console.log(`${metaKey}:`, metaValue);
    }
  }
  console.group('  deps: ', importData.deps.length);
  for (let depData of importData.deps) {
    logImport(depData);
  }
  console.groupEnd();
  console.groupEnd();
}
export function logImports () {
  console.group('Imports');
  for (let index in imports) {
    var importData = imports[index];
    // root imports?
    if (importData.from === undefined) {
      logImport(importData);
    }
  }
  console.groupEnd();
}
export function getImports () {
  return imports;
}
export function loggedImport (path) {
  // log imports on errors
  var orgOnError = window.onerror;
  window.onerror = logImports;
  return System.import(path)
    .then(function () {
      logImports();
      window.onerror = orgOnError;
    })
    .catch(function (err) {
      //console.error(err);
      logImports();
      throw err;
    });
}
