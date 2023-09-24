import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        })
    ],
    callbacks: {
        async signIn({ user }: any) {
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
        async session({ session, token }: any) {
            session.user.id = token.id;
            return session
        },
        async jwt({ token, user }:any) {
            if(user)
                token.id = user.id
          return token
        }
      }
  }

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
