const { gql } = require("apollo-server");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { ApolloServer } = require("apollo-server-express");

const { httpServer } = require("./app");

const { getMaps } = require("./api/maps");
const { getUserTimes } = require("./api/user");
const { getProfileSummary } = require("./api/steamapi");
const { getServerStatus } = require("./api/server");

const typeDefs = gql`
  enum Category {
    Linear
    Stages
    Combat
  }

  type Time {
    user: User!
    map: Map!
    variant: MapVariant
    run: Run!
    mode: Int
    style: Int
    rank: Int
    rankcount: Int
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
    ratings: [Int]
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

  enum ServerStatus {
    ONLINE
    OFFLINE
  }

  type Player {
    name: String!
    playTimeSeconds: Float!
  }

  type Server {
    status: ServerStatus!
    name: String
    map: String
    playerCount: Int
    maxPlayerCount: Int
    players: [Player]
  }

  type Query {
    GetMaps: [Description]
    GetUserStats(steamId: ID!): UserStats
    GetUserSteamProfile(steamId: ID!): SteamProfile
    GetServerStatus(serverId: ID!): Server
  }
`;

const resolvers = {
  Query: {
    // maps: getAllMaps,
    // influxMaps: getInfluxMaps,
    GetMaps: (parent, args, context, info) => getMaps(),
    GetUserStats: (parent, args, context, info) => getUserTimes(args.steamId),
    GetUserSteamProfile: (parent, args, context, info) =>
      getProfileSummary(args.steamId),
    GetServerStatus: (parent, args, context, info) =>
      getServerStatus(args.serverId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [new ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => {
    return { user: req.user };
  },
});
module.exports = server;
