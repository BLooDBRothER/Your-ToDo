import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import conn from "@/lib/db-pg";

export async function GET(_: Request ,{ params }: { params: {id: string}}){
    const folderId = params.id;

    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});

    const query = "WITH RECURSIVE ancestors as ( SELECT id, name, parent_folder_id FROM public.folders where id=$1 UNION ALL SELECT f.id, f.name, f.parent_folder_id FROM public.folders f join ancestors a on a.parent_folder_id = f.id ) SELECT * FROM ancestors;"
    // const query = "WITH RECURSIVE ancestors as ( SELECT id, name, parent_folder_id FROM public.folders WHERE name='storeroom' UNION ALL SELECT f.id, f.name, f.parent_folder_id FROM public.folders f  join ances a on a.parent_folder_id = f.id ) select * from ances;"
    // const data = await conn?.query(query);
    const data = await conn?.query(query, [folderId]);

    console.log(data);

    return NextResponse.json({"msg": "ok", folders: data.rows})
}
