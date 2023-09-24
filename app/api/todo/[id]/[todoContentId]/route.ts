import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route";

const ALLOWED_FIELD = ["value", "isCompleted"]

export async function PATCH(request: Request, { params }: { params: {id: string, todoContentId: string}}){
    const { field, value} = await request.json();
     
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;
    
    if(!ALLOWED_FIELD.find(f => f === field)) return NextResponse.json({"message": "Invalid Field"}, {status: 400});
    
    const res = await prisma.todoContent.update({
        where: {
            id: params.todoContentId,
            createdBy: userId
        },
        data: {
            [field]: value
        }
    })

    return NextResponse.json({"message": "Updated Successfully"});

}

export async function DELETE(_: Request, { params }: { params: {id: string, todoContentId: string}}){
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    await prisma.todoContent.delete({
        where: {
            id: params.todoContentId,
            createdBy: userId
        }
    });

    return NextResponse.json({"message": "Updated Successfully"});
}
