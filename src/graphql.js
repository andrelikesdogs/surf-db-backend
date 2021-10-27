const { gql } = require("apollo-server");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { ApolloServer } = require("apollo-server-express");
const { getAllMaps, getInfluxMaps } = require("./api/maps");
const { getUserTimes } = require("./api/user");
const { getProfileSummary } = require("./api/steamapi");
const { httpServer } = require("./app");

const typeDefs = gql`
  enum Category {
    LINEAR
    STAGES
    COMBAT
  }

  type Time {
    user: User!
    map: Map!
    variant: MapVariant
    run: Run!
    mode: Int
    style: Int
    rank: Int
    rectime: Float
    recdate: Date
    jumpnum: Int
  }

  type Map {
    mapid: ID!
    mapname: String!
  }

  type Description {
    id: ID!
    name: String!
    category: Category
    tags: [String]
    tier: Int
    stages: Int
    bonusStages: Int
    aestheticRatings: [Int]
  }

  type MapVariant {
    name: String!
    mapid: ID!
    descriptionid: ID!
    game: String
    description: Description!
  }

  type User {
    uid: ID!
    steamid: String
    name: String
    joindate: Date
    recordCount: Int
    completedCount: Int
  }

  type Run {
    runid: ID!
    map: Map
  }

  scalar Date
  scalar DateTime

  type UserStats {
    completed: [Time]!
    records: [Time]!
    user: User!
  }

  type SteamAvatar {
    small: String!
    medium: String!
    large: String!
  }
  type SteamProfile {
    avatar: SteamAvatar!
    steamID: ID!
    created: DateTime!
    lastLogOff: DateTime!
    nickname: String!
    primaryGroupID: ID!
    personaState: Int!
    personaStateFlags: Int!
    commentPermission: Int!
    visibilityState: Int!
  }

  type Query {
    map(id: ID!): Map
    maps: [Map]
    influxMaps: [Map]
    GetUserStats(steamId: ID!): UserStats
    GetUserSteamProfile(steamId: ID!): SteamProfile
  }
`;

const resolvers = {
  Query: {
    // maps: getAllMaps,
    // influxMaps: getInfluxMaps,
    GetUserStats: (parent, args, context, info) => getUserTimes(args.steamId),
    GetUserSteamProfile: (parent, args, context, info) =>
      getProfileSummary(args.steamId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [new ApolloServerPluginDrainHttpServer({ httpServer })],
});
module.exports = server;
