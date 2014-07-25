var JSCompiler = require('caql-js-compiler');

module.exports = function(db) {
  db.find = function(query, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (!options.valueEncoding) {
      options.valueEncoding = 'json';
    }

    var compiler = new JSCompiler();

    compiler.compile(query);

    var buffer = [];

    db.createReadStream(options)
      .on('data', function(data) {
        var result;
        if (result = compiler.filterOne(data.value)) {
          buffer.push(result);
        }
      })
      .on('end', function() {
        cb(null, compiler.sort(buffer));
      })
      .on('error', function(err) {
        cb(err);
      });
  };

  return db;
};
