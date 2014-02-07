var io = require('socket.io').listen(5555);
var fuzzer = require('./fuzzer');

var TOTAL_TRIPS = 500;

var trips = [];
// lastId keeps increasing, but regular `id` is referring to the slot in
// `trips`. So each slot in `trips` is an active trip, and there are exactly
// `TOTAL_TRIPS` of them inthe array.
var lastId = 500;

// ## step
// Steps a particular trip by one of its points and spits that point at the
// consumer
function step (id) {
  var next = trips[id].shift();

  next.time = Math.floor(Date.now() / 1000);

  // If a trip ends, replace it with a new trip
  if (next.event == "end") {
    trips[id] = fuzzer.generateTrip(lastId++);
  }

  io.sockets.volatile.emit("event", next);
}

for (var i = 0; i < TOTAL_TRIPS; i++) (function (id) {
  trips.push(fuzzer.generateTrip(id));

  setInterval(function () {
    step(id);
  }, fuzzer.rand(900, 1100));
}(i));

setInterval(function () {
  console.log("lastId: ", lastId);
}, 10000);
