import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    const data = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            emailRemainder: true,
            relativeTime: true
        }
    });


    return NextResponse.json({...data})
}

export async function PATCH(request: Request){
    const { field, value } = await request.json();
  
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    await prisma.user.update({
        where: {
            id: userId
        },
         data: {
            [field]: value
         }
    })

    return NextResponse.json({"message": "Updated Successfully"});
}
