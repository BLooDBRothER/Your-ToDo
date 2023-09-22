import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        })
    ],
    callbacks: {
        async signIn({ user }: any) {
            console.log(user)

            const dbUser = await prisma.user.findFirst({
                where: {
                    email: user.email as string
                }
            })

            if(!dbUser){
                await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email,
                        profilePic: user.image,
                        name: user.name
                    }
                })
            }

            return true
        },
        async session({ session, token, user }: any) {
            console.log('session - ', token, user)
            session.user.id = token.id;
            return session
        },
        async jwt({ token, user }:any) {
            console.log('jwt', token, user)
            // const dbUser = await prisma.user.findUnique({
            //     where: {
            //         email: token.email as string
            //     }
            // })
            if(user)
                token.id = user.id
          return token
        }
      }
  }

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
