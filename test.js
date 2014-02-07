var Store = require('./store');
var assert = require('assert');

var trip1 = [ { event: 'begin',
    tripId: 1,
    lat: 1,
    lng: 35 },
  { event: 'update',
    tripId: 1,
    lat: 2,
    lng: 35 },
  { event: 'update',
    tripId: 1,
    lat: 3,
    lng: 35 },
  { event: 'update',
    tripId: 1,
    lat: 2,
    lng: 35 },
  { event: 'update',
    tripId: 1,
    lat: 2,
    lng: 36 },
  { event: 'update',
    tripId: 1,
    lat: 2,
    lng: 37 },
  { event: 'update',
    tripId: 1,
    lat: 1,
    lng: 37 },
  { event: 'update',
    tripId: 1,
    lat: 0,
    lng: 37 },
  { event: 'update',
    tripId: 1,
    lat: -1,
    lng: 37 },
  { event: 'update',
    tripId: 1,
    lat: -2,
    lng: 37 },
  { event: 'end',
    tripId: 1,
    lat: -3,
    lng: 37,
    fare: 14 } ];

var trip2 = [ { event: 'begin',
    tripId: 2,
    lat: 8,
    lng: 9 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 10 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 11 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 12 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 13 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 14 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 15 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 16 },
  { event: 'update',
    tripId: 2,
    lat: 8,
    lng: 17 },
  { event: 'end',
    tripId: 2,
    lat: 8,
    lng: 18,
    fare: 29 } ];

function addTrip(startTime, store, trip) {
  var currTime = startTime;
  for (var i = 0; i < trip.length; i++) {
    trip[i].time = currTime;
    currTime += 1;

    store.add(trip[i]);
  }
}

var store = new Store();

addTrip(0, store, trip1);
assert(store.numTripsThrough(34, 0, 36, 2) == 1);

assert(store.numTripsAt(4) == 1);

addTrip(5, store, trip2);
assert(store.numTripsThrough(34, 0, 36, 2) == 1);
assert(store.numTripsThrough(12, 0, 36, 8) == 2);

assert(store.numTripsAt(4) == 1);
assert(store.numTripsAt(8) == 2);
