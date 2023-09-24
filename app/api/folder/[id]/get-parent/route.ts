import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import conn from "@/lib/db-pg";

export async function GET(_: Request ,{ params }: { params: {id: string}}){
    const folderId = params.id;

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const userId = session.user.id;

    const query = `WITH RECURSIVE ancestors as ( 
                                                 SELECT id, name, parent_folder_id, 1 as generation_level FROM public.folders where id=$1 AND created_by=$2
                                                 UNION ALL 
                                                 SELECT f.id, f.name, f.parent_folder_id, a.generation_level + 1 FROM public.folders f join ancestors a on a.parent_folder_id = f.id 
                                                ) 
                                                SELECT * FROM ancestors ORDER BY generation_level DESC;`

    try {
        const data = await conn?.query(query, [folderId, userId]);

        return NextResponse.json({"msg": "ok", folders: data.rows})
    }
    catch {
        return NextResponse.json({"message": "No folder Found"}, {status: 404});
    }


}
