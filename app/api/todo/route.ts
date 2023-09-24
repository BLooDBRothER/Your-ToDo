import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg";

export async function POST(request: Request){
    const { title, folderId } = await request.json();

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    if(folderId){
        const folderQuery = "SELECT * FROM public.folders WHERE created_by=$1 and id=$2";
        const folderData = await conn?.query(folderQuery, [userId, folderId]);
    
    
        if(folderData.rowCount !== 1) return NextResponse.json({"message": "Invalid Folder"}, {status: 404});
    }

    const newTodo = await prisma.todo.create({
        data: {
            title,
            folderId: folderId,
            createdBy: userId
        }
    });

    return NextResponse.json({"message": "Created Successfully", "todoId": newTodo.id});

}
