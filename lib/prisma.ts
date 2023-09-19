import { PrismaClient } from "@prisma/client";

declare global {
    var prisma : PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

// prisma.$on('query', (e) => {
//     console.log('Query: ' + e.query)
//     console.log('Params: ' + e.params)
//     console.log('Duration: ' + e.duration + 'ms')
//   })

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
