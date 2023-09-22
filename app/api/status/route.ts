import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { verifySignature } from "@/lib/verifySignature";

export async function POST(request: Request) {
    // const signature = request.headers.get("upstash-signature");

    // if (!signature) {
    //     return NextResponse.json({msg: "`Upstash-Signature` header is missing"}, { status: 400 })
    // }
    
    // const keys = { currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string, nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string };

    // if(! await verifySignature({ signature }, keys)){
    //     return NextResponse.json({msg: "Invalid Signature"}, { status: 403 })
    // }

    try{   
        await prisma.user.findFirst({});
        return NextResponse.json({"status": true})
    }
    catch{
        return NextResponse.json({"status": false})
    }
}
