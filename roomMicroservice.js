const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const roomProtoPath = 'room.proto';
const roomProtoDefinition = protoLoader.loadSync(roomProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const roomProto = grpc.loadPackageDefinition(roomProtoDefinition).room;

const roomService = {
  getRoom: (call, callback) => {
    const room = {
      id: call.request.room_id,
      title: 'Example Room',
      description: 'This is an example room.',
    };
    callback(null, { room });
  },
  searchRooms: (call, callback) => {
    const { query } = call.request;

    const rooms = [
      {
        id: '1',
        title: '581',
        description: 'Single Room',
      },
      {
        id: '2',
        title: '458',
        description: 'Double Room',
      },
    ];
    callback(null, { rooms });
  },
};

const server = new grpc.Server();
server.addService(roomProto.RoomService.service, roomService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${port}`);
  server.start();
});
console.log(`Room microservice running on port ${port}`);
