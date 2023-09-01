import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    const query = "SELECT name,id FROM public.folders WHERE created_by = $1 AND parent_folder_id IS NULL ORDER BY created_at"
    const todoQuery = "SELECT title, id FROM public.todo WHERE created_by = $1 and folder_id IS NULL ORDER BY created_at"
    
    const data = await conn?.query(query, [userId]);
    const todoData = await conn?.query(todoQuery, [userId])

    return NextResponse.json({"msg": "ok", folders: data.rows, todo: todoData.rows})
}

export async function POST(request: Request){
    const { name, folderId } = await request.json();

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    const newFolder = await prisma.folder.create({
        data: {
            name,
            parentFolderId: folderId,
            createdBy: userId
        }
    });

    console.log(newFolder);

    return NextResponse.json({"message": "Created Successfully", "folderId": newFolder.id});

}
