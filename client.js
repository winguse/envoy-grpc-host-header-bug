const grpc = require("grpc");

const { Ping } = grpc.load("./ping.proto").test;

const metadata = new grpc.Metadata();
metadata.add("host", "ping.pong:10000");
metadata.add("authority", "ping.pong:10000");

const client = new Ping("127.0.0.1:10001", grpc.credentials.createInsecure());
client.send({ message: "ping via envoy" }, metadata, (error, response) => {
	if (error) {
		console.log("error", error);
	}
	console.log("response", response);
});



const directClient = new Ping("127.0.0.1:10000", grpc.credentials.createInsecure());
directClient.send({ message: "ping directly" }, metadata, (error, response) => {
	if (error) {
		console.log("error", error);
	}
	console.log("response", response);
});

