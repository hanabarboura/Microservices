const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Hotel {
    id: String!
    title: String!
    description: String!
  }

  type Room {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    hotel(id: String!): Hotel
    hotels: [Hotel]
    room(id: String!): Room
    rooms: [Room]
  }

  type Mutation {
    createHotel(id: String!, title: String!, description: String!): Hotel
  }
`;

module.exports = typeDefs;
