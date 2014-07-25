var assert = require('assert');
var level =  require('level-packager')(require('memdown'));
var caql = require('./');

var entries = [
  { name: 'Postini', founded_year: 1999, total_money_raised: '$0' },
  { name: 'Digg', founded_year: 2004, total_money_raised: '$45M' },
  { name: 'Airbnb', founded_year: 2007, total_money_raised: '$120M' },
  { name: 'TripIt', founded_year: 2006, total_money_raised: '$13.1M' },
  { name: 'Twitter', founded_year: 2006, total_money_raised: '$1.16B' },
  { name: 'Spotify', founded_year: 2006, total_money_raised: '$183M' },
  { name: 'Airbnb', founded_year: 2008, total_money_raised: '$776.4M' }
];

describe('level-caql', function() {
  var db = level('./test_data');
  caql(db);

  before(function(done) {

    db.open(function() {
      var idCounter = 1;
      var ops = entries.map(function(entry) {
        return { type: 'put', key: idCounter++, value: entry };
      });

      db.batch(ops, { valueEncoding: 'json' }, function(err) {
        done();
      });
    });
  });

  it('runs a simple query', function(done) {
    var query = 'select *';

    db.find(query, function(err, values) {
      assert.deepEqual(values, entries);
      done();
    });
  });

  it('maps aliases', function(done) {
    var query = 'select name, founded_year as origin where name="Spotify"';

    db.find(query, function(err, values) {
      assert.equal(values[0].origin, 2006);
      done();
    });
  });

  it('runs multiple filters', function(done) {
    var query = 'select name where founded_year >= 2006 and total_money_raised="$120M"';

    db.find(query, function(err, values) {
      assert.equal(values[0].name, 'Airbnb');
      done();
    });
  });

  it('passes on options to db.createReadStream()', function(done) {
    var query = 'select *';
    var options = { reverse: true };

    db.find(query, options, function(err, values) {
      assert.deepEqual(values.reverse(), entries);
      done();
    });
  });

  it('defaults valueEncoding to json when not present in options', function(done) {
    var query = 'select *';
    var options = { valueEncoding: null };

    db.find(query, options, function(err, values) {
      assert.equal(typeof values[0], 'object');
      done();
    });
  });

  it('overrides valueEncoding when passed in as an option', function(done) {
    var query = 'select *';
    var options = { valueEncoding: 'utf8' };

    db.find(query, options, function(err, values) {
      assert.equal(typeof values[0], 'string');
      done();
    });
  });

});
