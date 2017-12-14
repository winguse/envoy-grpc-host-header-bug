# Envoy bug of eating and omitting `host` header

1. run `npm install` for node packages
2. run Envoy by `envoy -c envoy-config.yaml`
3. run server code `node server.js`
4. run client code `node client.js`

The client will make two calls, one go through envoy, which server will print something like this:

```text
got request { message: 'ping via envoy' } { authority: 'ping.pong:10000',
  'user-agent': 'grpc-node/1.7.3 grpc-c/5.0.0 (linux; chttp2; gambit)',
  'x-forwarded-proto': 'http',
  'x-request-id': '0bcd8b61-fbe5-94cd-b568-8a6baf9299b7',
  'x-envoy-expected-rq-timeout-ms': '15000' }
```

one call directly, and server will print:

```text
got request { message: 'ping directly' } { host: 'ping.pong:10000',
  authority: 'ping.pong:10000',
  'user-agent': 'grpc-node/1.7.3 grpc-c/5.0.0 (linux; chttp2; gambit)' }
```

See, the first one get `host` header missing.

Also check Envoy's log file:

```
[2017-12-14T09:16:04.446Z] "POST /test.Ping/Send HTTP/2" 200 - 21 11 9 8 "-" "grpc-node/1.7.3 grpc-c/5.0.0 (linux; chttp2; gambit)" "0bcd8b61-fbe5-94cd-b568-8a6baf9299b7" "127.0.0.1:10001" "127.0.0.1:10000"
```

We can see `%REQ(:AUTHORITY)%` equals to `127.0.0.1:10001` is not set as correctly as expected to be `ping.pong:10000`.

This bug will resulting in we cannot route the traffic base on virtual host name.

