const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const hotelProtoPath = 'hotel.proto';
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;

const hotelService = {
  getHotel: (call, callback) => {
    const hotel = {
      id: call.request.hotel_id,
      name: 'Example Hotel',
      location: 'Example Location',
    };
    callback(null, { hotel });
  },
  searchHotels: (call, callback) => {
    const { query } = call.request;

    const hotels = [
      {
        id: '1',
        name: 'Iberostar',
        location: 'Mahdia',
      },
      {
        id: '2',
        name: 'Mouradi Palace',
        location: 'Hamammet',
      },
    ];
    callback(null, { hotels });
  },
  createHotel: (call, callback) => {
    const hotel = {
      id: call.request.hotel_id,
      name: call.request.name,
      location: call.request.location,
    };
    callback(null, { hotel });
  },
};

const server = new grpc.Server();
server.addService(hotelProto.HotelService.service, hotelService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${port}`);
  server.start();
});
console.log(`Hotel microservice running on port ${port}`);
