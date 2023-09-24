import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { verifySignature } from "@/lib/verifySignature";

export async function POST(_: Request) {
    try{   
        await prisma.user.findFirst({});
        return NextResponse.json({"status": true})
    }
    catch(err){
        return NextResponse.json({"status": false})
    }
}
