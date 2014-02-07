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
```

there are also some shitty tests

```
$ node test.js
```


