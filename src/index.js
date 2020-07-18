const { GraphQLServer, PubSub } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const pubsub = new PubSub()
const prisma = new PrismaClient()
const Subscription = require('./resolvers/Subscription')

const resolvers = {
    Query, 
    Mutation,
    Subscription,
    User,
    Link,
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
            pubsub,
        }
    }
})

server.start(() => console.log('Server is running on http://localhost:4000'))