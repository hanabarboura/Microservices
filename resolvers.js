const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const hotelProtoPath = 'hotel.proto';
const roomProtoPath = 'room.proto';
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const roomProtoDefinition = protoLoader.loadSync(roomProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;
const roomProto = grpc.loadPackageDefinition(roomProtoDefinition).room;
const clientHotels = new hotelProto.HotelService('localhost:50051', grpc.credentials.createInsecure());
const clientRooms = new roomProto.RoomService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    hotel: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientHotels.getHotel({ hotel_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotel);
          }
        });
      });
    },
    hotels: () => {
      return new Promise((resolve, reject) => {
        clientHotels.searchHotels({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotels);
          }
        });
      });
    },
    room: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientRooms.getRoom({ room_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.room);
          }
        });
      });
    },
    rooms: () => {
      return new Promise((resolve, reject) => {
        clientRooms.searchRooms({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.rooms);
          }
        });
      });
    },
  },
  Mutation: {
    createHotel: (_, { id, name, location }) => {
      return new Promise((resolve, reject) => {
        clientHotels.createHotel({ hotel_id: id, name: name, location: location }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotel);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
