import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg"

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

            const query = "SELECT * FROM public.users WHERE email = $1";
            const res = await conn.query(query, [user.email]);

            if(res.rowCount === 0){
                const userInsertQuery = "INSERT INTO public.users(email, profile_pic, name, updated_at) VALUES($1, $2, $3, now())"
                const res = await conn.query(userInsertQuery, [user.email, user.image, user.name]);
                console.log(res);
            }
            // const dbUser = await prisma.user.findUnique({
            //     where: {
            //         email: user.email as string
            //     }
            // })

            // if(!dbUser){
            //     await prisma.user.create({
            //         data: {
            //             email: user.email,
            //             profilePic: user.image,
            //             name: user.name
            //         }
            //     })
            // }

            return true
        },
        async session({ session, token }: any) {
            session.user.id = token.id;
            return session
        },
        async jwt({ token }:any) {
            const query = "SELECT * FROM public.users WHERE email = $1";
            const res = await conn.query(query, [token.email]);
            // const dbUser = await prisma.user.findUnique({
            //     where: {
            //         email: token.email as string
            //     }
            // })
            token.id = res.rows[0]?.id
          return token
        }
      }
  }

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
