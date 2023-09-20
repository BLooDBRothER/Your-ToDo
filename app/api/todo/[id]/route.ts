import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(_: Request, { params }: { params: {id: string}}) {
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    const data = await prisma.todo.findFirst({
        where: {
            id: params.id,
            createdBy: userId
        },
        select: {
            todoContent: {
                select: {
                    id: true,
                    value: true,
                    isCompleted: true,
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    console.log(data)

    return NextResponse.json({"msg": "ok", todoContent: data?.todoContent ?? []})
}

export async function POST(request: Request, { params }: { params: {id: string}}) {
    const { value } = await request.json();

    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    const newTodoContent = await prisma.todoContent.create({
        data: {
            todoId: params.id,
            value,
            createdBy: userId
        }
    });

    return NextResponse.json({"msg": "ok", todoContentId: newTodoContent.id})
}

export async function PATCH(request: Request, { params }: { params: {id: string}}){
    const { field, value } = await request.json();
  
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    await prisma.todo.update({
        where: {
            id: params.id,
            createdBy: userId
        },
         data: {
            [field]: value
         }
    })

    return NextResponse.json({"message": "Updated Successfully"});
}

export async function DELETE(_: Request, { params }: { params: {id: string}}) {
    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;
    
    await prisma.todo.delete({
        where: {
            id: params.id,
            createdBy: userId
        }
    })

    return NextResponse.json({"message": "Updated Successfully"});
}
