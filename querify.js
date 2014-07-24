var JSCompiler = require('caql-js-compiler');

module.exports = function(db) {
  db.find = function(query, cb) {
    var compiler = new JSCompiler();

    compiler.compile(query);

    var buffer = [];

    db.createReadStream()
      .on('data', function(data) {
        var result;
        if (result = compiler.filterOne(JSON.parse(data.value))) {
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
