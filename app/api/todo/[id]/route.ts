import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route";
import { v4 as uuidv4 } from 'uuid';

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
    const { value, todos, isMultiple } = await request.json() as {
        value: string
        todos: {value: string, isCompleted: boolean}[]
        isMultiple: boolean
    };

    const session = await getServerSession(authOptions);
    
    if(!session) return NextResponse.json({"message": "Please Login"}, {status: 401});
    const userId = session.user.id as string;

    if(isMultiple){
        const allTodo = todos.map(todo => ({...todo, id: uuidv4(), todoId: params.id, createdBy: userId, isCompleted: todo.isCompleted ? true : false }))
        await prisma.todoContent.createMany(
            {
                data: allTodo
            }
        )
        return NextResponse.json({todo: allTodo})
    }

    const newTodoContent = await prisma.todoContent.create({
        data: {
            todoId: params.id,
            value,
            isCompleted: false,
            createdBy: userId
        }
    });

    return NextResponse.json({todoContentId: newTodoContent.id})
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
