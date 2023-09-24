
import { verifySignature } from "@/lib/verifySignature";
import { NextRequest, NextResponse } from "next/server";
import conn from "@/lib/db-pg";
import prisma from "@/lib/prisma"
import { parseDate } from "@/lib/pareseDate";
import { sendMail } from "@/lib/mail";
import { RemainderEmail } from "@/lib/RemainderEmail";


export async function POST(req: NextRequest){
    const signature = req.headers.get("upstash-signature");
    if (!signature) {
        return NextResponse.json({msg: "`Upstash-Signature` header is missing"}, { status: 400 })
    }
    
    const keys = { currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string, nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string };

    if(! await verifySignature({ signature }, keys)){
        return NextResponse.json({msg: "Invalid Signature"}, { status: 403 })
    }

    const today = new Date();
    const tomorrow = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
    const later = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));

    
    const query = "SELECT t.id todo_id, t.title, t.folder_id, u.email FROM public.todo t join public.users u on t.created_by = u.id AND u.email_remainder AND t.due_date > $1 and t.due_date < $2 ORDER BY u.id";
    
    const data = await conn.query(query, [parseDate(today), parseDate(later)]);

    const { rows } = data;

    const remainderEmail = RemainderEmail(tomorrow);

    remainderEmail.processEmail(rows);
    await remainderEmail.sendUserEmail();
   
    return NextResponse.json({msg: data})
}

