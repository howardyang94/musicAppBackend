async function feed(parent, args, context, info) {
    const where = args.filter
        ? {
            OR: [
                { description: { contains: args.filter } },
                { title: { contains: args.filter } },
                { artist: { contains: args.filter } },
                { genre: { contains: args.filter } },
            ],
        }
        : {}
    if(args.id) {
        where.id = Number(args.id)
    }
    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
    })

    const count = await context.prisma.link.count({ where })
    return {
        links,
        count,   
    }
}
async function findLinkId(parent, args, context, info) {
    const link = context.prisma.link.findOne( {where: {id: Number(args.id)} })

    return link
}
module.exports = {
    feed,
    findLinkId,
}