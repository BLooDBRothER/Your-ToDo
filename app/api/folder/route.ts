import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import conn from "@/lib/db-pg";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id as string;

    const query = "SELECT f.name, f.id FROM public.folders f join public.users u on f.created_by = u.id where u.id = $1 and parent_folder_id IS NULL ORDER BY f .created_at"
    const data = await conn?.query(query, [userId]);

    return NextResponse.json({"msg": "ok", folders: data.rows})
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
