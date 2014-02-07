var io = require('socket.io-client').connect("localhost", {port: 5555});
var Store = require('./store');

var app = require('express')();

store = new Store();

io.on('event', function (event) {
  store.add(event);
});

app.get('/stats', function (req, res) {
  var stats = store.stats();
  stats.mem = process.memoryUsage().rss / 1000000;
  res.json(stats);
});

app.get('/numTripsThrough/:x1/:y1/:x2/:y2', function (req, res) {
  res.json(200, store.numTripsThrough(req.params['x1'], req.params['y1'], req.params['x2'], req.params['y2']));
});

app.get('/startStopFare/:x1/:y1/:x2/:y2', function (req, res) {
  res.json(store.startStopFare(req.params['x1'], req.params['y1'], req.params['x2'], req.params['y2']));
});

app.get('/numTripsAt/:time', function (req, res) {
  res.json(store.numTripsAt(parseInt(req.params['time'], 10)));
});

app.listen(3000);
