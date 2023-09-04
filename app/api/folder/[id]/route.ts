import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg";

export async function GET(request: NextRequest, { params }: { params: {id: string}}){
    const folderId = params.id;

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    const onlyFolder  = request.nextUrl.searchParams.get("onlyFolder") ?? false; 

    try {
        const query = "SELECT name, id FROM public.folders WHERE created_by = $1 AND parent_folder_id = $2 ORDER BY created_at";
        const data = await conn?.query(query, [userId, folderId]);
        if(onlyFolder)
            return NextResponse.json({"msg": "ok", folders: data.rows, todo: []})

        const todoQuery = "SELECT title, id FROM public.todo WHERE created_by = $1 and folder_id = $2 ORDER BY created_at"
        const todoData = await conn?.query(todoQuery, [userId, folderId]);
        
        return NextResponse.json({"msg": "ok", folders: data.rows, todo: todoData.rows})
    }
    catch {
        return NextResponse.json({"message": "Folder Not Found"}, {status: 404});
    }
    
}

export async function PATCH(request: Request, { params }: { params: {id: string}}){
    const folderId = params.id;

    const { name } = await request.json();

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    try{
        await prisma.folder.update({
            where: {
                id: folderId,
                createdBy: userId
            },
             data: {
                name
             }
        });
        return NextResponse.json({"message": "Updated Successfully"});
    }
    catch {
        return NextResponse.json({"message": "Folder Not Found"}, {status: 404});
    }

}

export async function DELETE(_: Request, { params }: { params: {id: string}}){
    const folderId = params.id;

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    try {
        await prisma.folder.delete({
            where: {
                id: folderId,
                createdBy: userId
            }
        });
        return NextResponse.json({"message": "Deleted Successfully"});
    }
    catch {
        return NextResponse.json({"message": "Folder Not Found"}, {status: 404});
    }


}
