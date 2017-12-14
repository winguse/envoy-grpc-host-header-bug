const grpc = require("grpc");

const { Ping } = grpc.load("./ping.proto").test;


const server = new grpc.Server();
server.addService(Ping.service, {
	send: (call, callback) => {
		console.log("got request", call.request, call.metadata.getMap());
		callback(undefined, { message: "pong" });
	}
});
server.bind("127.0.0.1:10000", grpc.ServerCredentials.createInsecure());
server.start();
