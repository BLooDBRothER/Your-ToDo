import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import conn from "@/lib/db-pg";

export async function PATCH(request: Request) {
    const { sourceId, destinationId, folderToFolder } = await request.json() as {
        sourceId: string
        destinationId: string | null
        folderToFolder: boolean
    };

    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    const folderQuery = "UPDATE public.folders SET parent_folder_id=$1 WHERE id=$2 AND created_by=$3";
    const todoQuery = "UPDATE public.todo SET folder_id=$1 WHERE id=$2 AND created_by=$3";
    
    await conn.query(folderToFolder ? folderQuery : todoQuery, [destinationId, sourceId, userId])

    return NextResponse.json({"message": "Moved Successfully"});
} 
