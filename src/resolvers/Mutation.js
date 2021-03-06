const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)

    const user = await context.prisma.user.create({ data: { ...args, password } })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

function post(parent, args, context, info) {
    const userId = getUserId(context)
    const newLink = context.prisma.link.create({
        data: {
            title: args.title,
            artist: args.artist,
            tags: args.tags,
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId} },
        }
    })
    context.pubsub.publish("NEW_LINK", newLink)

    return newLink
}

function edit(parent, args, context, info) {
    
    const editLink = context.prisma.link.update({ 
        where: {id: Number(args.id)},
        data: {
            title: args.title,
            artist: args.artist,
            url: args.url,
            description: args.description,
            tags: args.tags        
        }
    })
    // context.pubsub.publish("NEW_LINK", editLink)
    return editLink
}

function remove (parent, args, context, info) {
    const link = context.prisma.link.delete({ where: {id: Number(args.id)} })
    return link
}

module.exports = {
    signup,
    login,
    post,
    edit,
    remove,
}