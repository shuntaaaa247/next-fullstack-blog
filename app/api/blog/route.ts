import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

//データベースからデータを取得
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connect();
    const posts = await prisma.post.findMany(); //Postスキーマ -> post
    return NextResponse.json({ posts }, { status: 200 })
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//ブログ投稿
export const POST = async (req: NextRequest, res: NextResponse) => {
  const { title, description } = await req.json(); //req.body -> req.json()

  if(title === "" || title == null) {
    return NextResponse.json({ message: "タイトルを入力してください" }, { status: 400 })
  }

  if(description === "" || description == null) {
    return NextResponse.json({ message: "本文を入力してください" }, { status: 400 })
  }

  try {
    await connect();
    const post = await prisma.post.create({
      data: {
        title: title,
        description: description
      }
    })

    return NextResponse.json({ message: "投稿完了", post: post }, { status: 200 });
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "投稿失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect
  }
}