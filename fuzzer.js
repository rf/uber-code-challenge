var _ = require('lodash');

// ## rand
function rand (begin, end) {
  return Math.floor((Math.random() * end) + begin);
}

// ## generateTrip
// Generates a random trip. Returns an array of objects
function generateTrip (id) {
  var trip = [];

  var start = {
    event: "begin",
    tripId: id,
    lat: rand(0, 50),
    lng: rand(0, 50)
  }

  trip.push(start);

  var curr = start;
  var dir = rand(0, 3);

  for (var i = 0; i < rand(5, 300); i++) {
    // Make a new point based on the current point and push it 

    curr = _.clone(curr);
    curr.event = "update";

    // randomly change direction
    if (rand(0, 3) == 0) dir = rand(0, 3);

    switch (dir) {
      case 0:   curr.lat += 1;    break;
      case 1:   curr.lat -= 1;    break;
      case 2:   curr.lng += 1;    break;
      case 3:   curr.lng -= 1;    break;
    }

    trip.push(curr);
  }

  curr.event = "end";
  curr.fare = rand(0, 100);

  return trip;
}

module.exports = {
  rand: rand,
  generateTrip: generateTrip
};
