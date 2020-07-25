const { PrismaClient } = require("@prisma/client")
// or 
// import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newLink = await prisma.link.create({
        data: {
            artist: 'Foo Fighters',
            title: 'Everlong', 
            description: 'Hit Single found on 1997 album "The Colour And the Shape"', 
            url: 'https://www.discogs.com/Foo-Fighters-Colour-The-Shape/master/62129 ; https://www.youtube.com/watch?v=C5oeWHngDS4',
            tags: 'Rock'
        },
    })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main() 
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.disconnect()
    })