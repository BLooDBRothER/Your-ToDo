import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg";

export async function GET(request: NextRequest){
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const onlyFolder  = request.nextUrl.searchParams.get("onlyFolder") ?? false; 

    const userId = session.user.id as string;

    const query = "SELECT name,id FROM public.folders WHERE created_by = $1 AND parent_folder_id IS NULL ORDER BY created_at"
    const data = await conn?.query(query, [userId]);
    
    if(onlyFolder)
        return NextResponse.json({"msg": "ok", folders: data.rows, todo: []})
        
    const todoQuery = "SELECT title, id, due_date as duedate FROM public.todo WHERE created_by = $1 and folder_id IS NULL ORDER BY due_date NULLS LAST, created_at"
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

    return NextResponse.json({"message": "Created Successfully", "folderId": newFolder.id});

}
