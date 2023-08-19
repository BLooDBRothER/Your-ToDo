import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    const user = await prisma.users.findMany()
    console.log(user)

    return NextResponse.json(user)
}

export async function POST(request: Request) {
    const { email } = await request.json();

    const user = await prisma.users.create({
        data: {
            email
        }
    })

    // console.log(db.isInitialized)
    // await db.initialize();

    // const newUser = await db.sequelize.models?.users?.create({email});/
    // console.log(newUser)

    return NextResponse.json({"message": "User Created"})
}
