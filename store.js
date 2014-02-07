var rbush = require('rbush');
var IntervalTree = require('./IntervalTree');

// # Store
// Stores info about trips
function Store () {
  var self = this;

  self.tree = new rbush(9, ['.lng', '.lat', '.lng', '.lat']);
  self.trips = {};
  self.pts = 0;

  // kinda gross but it needs a center point
  self.interval = new IntervalTree(Math.floor((Date.now() / 1000) + 50000));
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

    if (event.event == "end") {
      self.trips[event.tripId].fare = event.fare;
      self.interval.add([self.trips[event.tripId].time, event.time]);
    }
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

// ## numTripsAt
// Num of trips at particular time
Store.prototype.numTripsAt = function (time) {
  var self = this;
  return self.interval.search(time).length;
};

module.exports = Store;
