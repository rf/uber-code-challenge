var rbush = require('rbush');

// ## euclidean
// Regular euclidean distance
function euclidean (a, b) {
  return Math.pow(a.lng - b.lng, 2) +  Math.pow(a.lat - b.lat, 2);
}

// ## haversine
// Haversine distance function for calculating distance between lat lons
function haversine (a, b) {
  var lat1 = a.lat;
  var lat2 = b.lat;
  var lon1 = a.lng;
  var lon2 = b.lng;

  var aLat = lat1 * TO_RAD;
  var bLat = lat2 * TO_RAD;
  var dLat2 = (bLat - aLat) * 0.5;
  var dLon2 = (lon2 - lon1) * TO_RAD * 0.5;
  var sindLat = Math.sin(dLat2);
  var sindLon = Math.sin(dLon2);
  var x = sindLat * sindLat + Math.cos(aLat) * Math.cos(bLat) * sindLon * sindLon;
  return R2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// # Store
// Stores info about trips
function Store () {
  var self = this;

  self.tree = new rbush(9, ['.lng', '.lat', '.lng', '.lat']);
  self.trips = {};
  self.pts = 0;
}

// ## stats
// Returns stats of store
Store.prototype.stats = function () {
  var self = this;
  return {trips: Object.keys(self.trips).length, pts: self.pts};
};

// ## add
// Adds a single event to the store
Store.prototype.add = function (event) {
  var self = this;

  if (event.event == "begin") {
    if (self.trips[event.tripId]) throw new Error("duplicate begin event of tripId: " + event.tripId);

    self.trips[event.tripId] = event;
    event.points = [];

    self.tree.insert(event);
  }

  else {
    if (!self.trips[event.tripId]) {
      // We weren't around for the start of this trip :| discard
      return;
    }
    
    self.trips[event.tripId].points.push(event);
    self.tree.insert(event);

    if (event.event == "end") self.trips[event.tripId].fare = event.fare;
  }

  self.pts += 1;
};

// ## numTripsThrough
// Returns # of trips that passed thru a point
Store.prototype.numTripsThrough = function (lng1, lat1, lng2, lat2) {
  var self = this;

  var pts = self.tree.search([lng1, lat1, lng2, lat2]);

  // Mark each tripId in an object then return its length. So, basically,
  // return # of unique tripIds.

  return Object.keys(pts.reduce(function (memo, item) { 
    memo[item.tripId] = true;
    return memo;
  }, {})).length;
};

// ## startStopFare
// returns # of trips that started or stopped in a rect and the total fare
Store.prototype.startStopFare = function (lng1, lat1, lng2, lat2) {
  var self = this;

  var pts = self.tree.search([lng1, lat1, lng2, lat2]);

  var stats = pts.reduce(function (memo, item) {
    if (item.event == "begin") {
      memo.num[item.tripId] == true;
    } else if (item.event == "end") {
      memo.num[item.tripId] = true;
      memo.total += item.fare;
    }
    return memo;
  }, {num: {}, total: 0});

  stats.num = Object.keys(stats.num).length;

  return stats;
};

module.exports = Store;
