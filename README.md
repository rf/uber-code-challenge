# uber code challenge thing

To use run the producer

```
$ node producer_service.js
```

which will then start listening and you can start the consumer

```
$ node consumer_service.js
```

which can then be queried over http

```
$ curl localhost:3000/startStopFare/5/5/20/20
$ curl localhost:3000/numTripsAt/`date +%s`
$ curl localhost:3000/numTripsThrough/5/5/20/20

$ curl localhost:3000/stats
```

there are also some shitty tests. they suck and I feel badly about this.

```
$ node test.js
```

`fuzzer.js` is the fuzzer. It tries to generate somewhat realistic random
trips, with somewhere between 5 and 300 points. They travel in one direction
each point and change direction periodically.

The stats endpoint will give you RSS and the # of stored trips and points.
On my mbp, I get ~20ms query time with about 8k trips and 221k points.

### Interval tree stolen from https://github.com/shinout/interval-tree
