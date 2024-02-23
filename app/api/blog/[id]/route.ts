import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

//インスタンスを作成
const prisma = new PrismaClient();

//データベースに接続
export const connect = async () => {
  try {
    //prismaでデータベースに接続
    prisma.$connect;
  } catch(err) {
    console.log(err);
    return Error("データベースに接続できませんでした")
  }
}

//取得
export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    const targetId: number = Number(params.id);

    await connect();
    const post = await prisma.post.findFirst({
      where: { id: targetId }
    });

    if(!post) {
      return NextResponse.json({ message: "idに一致する投稿がありません" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  }
}

//削除
export const DELETE = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    const targetId: number =  Number(params.id); //urlが[id]なのでparams.id

    await connect();
    const post = await prisma.post.delete({
      where: { id: targetId }
    });

    return NextResponse.json({ message: "削除成功" }, { status: 200 });
  } catch(err) {

    if (!await prisma.post.findFirst({ where: { id: Number(params.id) }})) {
      return NextResponse.json({ message: "idに一致する投稿がありません" }, { status: 404 });
    }

    console.log(err);
    return NextResponse.json({ message: "削除失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//編集
export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
  const { title, description } = await req.json(); //req.body -> req.json()

  if(title === "" || title == null) {
    return NextResponse.json({ message: "タイトルを入力してください" }, { status: 400 });
  }

  if(description === "" || description == null) {
    return NextResponse.json({ message: "本文を入力してください" }, { status: 400 });
  }

  try {
    const targetId: number = Number(params.id);
    await connect();

    const post = await prisma.post.update({
      where: {
        id: targetId
      }, 
      data: {
        title: title,
        description: description
      }
    })

    return NextResponse.json({ message: "更新完了" }, { status: 200 });
  } catch(err) {
    if (!await prisma.post.findFirst({ where: { id: Number(params.id) }})) {
      return NextResponse.json({ message: "idに一致する投稿がありません" }, { status: 404 });
    }

    return NextResponse.json({ message: "削除失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}