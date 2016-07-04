var imports = {};
var systemNormalize = System.normalize;
System.normalize = function (path, importFrom) {
  var promise = systemNormalize.apply(this, arguments);
  promise.then(function (normalizedPath) {
    updateData(normalizedPath, {
      importPath: path,
      path: normalizedPath,
      from: importFrom,
      deps: []
    });
  });
  return promise;
};

var systemLocate = System.locate;
System.locate = function (load) {
  var importData = updateData(load.name, {
    metadata: load.metadata
  })
  var fromData = imports[importData.from];
  if (fromData) {
    fromData.deps.push(importData);
  }
  return systemLocate.apply(this, arguments);
};

function updateData(normalizedPath, data) {
  // create data if doesn't exist
  var currData = imports[normalizedPath] = imports[normalizedPath] || {};
  // extend data
  for(var key in data) {
    currData[key] = data[key];
  }
  return currData;
}

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
  if (importData.deps) {
    console.group('  deps: ', importData.deps.length);
    for (let depData of importData.deps) {
      logImport(depData);
    }
    console.groupEnd();
  }
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
    .then(function (module) {
      logImports();
      window.onerror = orgOnError;
      return module;
    })
    .catch(function (err) {
      //console.error(err);
      logImports();
      throw err;
    });
}
