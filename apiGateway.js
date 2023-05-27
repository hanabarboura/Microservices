const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const hotelProtoPath = 'hotel.proto';
const roomProtoPath = 'room.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

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

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );
});

app.get('/hotels', (req, res) => {
  clientHotels.searchHotels({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.hotels);
    }
  });
});

app.post('/hotel', (req, res) => {
  const { id, name, location } = req.body;
  clientHotels.createHotel({ hotel_id: id, name: name, location: location }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.hotel);
    }
  });
});

app.get('/hotels/:id', (req, res) => {
  const id = req.params.id;
  clientHotels.getHotel({ hotelId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.hotel);
    }
  });
});

app.get('/rooms', (req, res) => {
  clientRooms.searchRooms({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.rooms);
    }
  });
});

app.get('/rooms/:id', (req, res) => {
  const id = req.params.id;
  clientRooms.getRoom({ roomId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.room);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
