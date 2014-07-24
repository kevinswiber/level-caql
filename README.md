# level-caql

Adds CaQL query support to LevelUP.

## Install

`npm install level-caql`

## Example

```js
var levelup = require('levelup');
var caql = require('level-caql');

var db = levelup('./db');
caql(db);

var entries = [
  { name: 'Postini', founded_year: 1999, total_money_raised: '$0' },
  { name: 'Digg', founded_year: 2004, total_money_raised: '$45M' },
  { name: 'Airbnb', founded_year: 2007, total_money_raised: '$120M' },
  { name: 'TripIt', founded_year: 2006, total_money_raised: '$13.1M' },
  { name: 'Twitter', founded_year: 2006, total_money_raised: '$1.16B' },
  { name: 'Spotify', founded_year: 2006, total_money_raised: '$183M' },
  { name: 'Airbnb', founded_year: 2008, total_money_raised: '$776.4M' }
];

var query =   'select name, founded_year, total_money_raised as worth '
            + 'where founded_year >= 1999 and name not like "%air%" '
            + 'order by founded_year desc, name';

db.open(function() {
  var idCounter = 1;
  var ops = entries.map(function(entry) {
    return { type: 'put', key: idCounter++, value: JSON.stringify(entry) };
  });

  db.batch(ops, function(err) {
    db.find(query, function(err, results) {
      console.log(results);
    });
  });
});


// Output:
//
// [ { name: 'Spotify', founded_year: 2006, worth: '$183M' },
//  { name: 'TripIt', founded_year: 2006, worth: '$13.1M' },
//  { name: 'Twitter', founded_year: 2006, worth: '$1.16B' },
//  { name: 'Digg', founded_year: 2004, worth: '$45M' },
//  { name: 'Postini', founded_year: 1999, worth: '$0' } ]
```

## Usage

The `level-caql` module adds a function to the LevelUP database, `db.find`.

### db.find(query, callback)

Executes a query over a LevelUP database. Entries must be stringified JSON (for now). 

`query`: A valid CaQL query string.  Learn more: [Calypso Query Language Specification](https://github.com/kevinswiber/caql).

`callback`: A function that takes two parameters: `err` and `results`.  The `results` parameter is an array with objects found in the database.

## License

MIT
