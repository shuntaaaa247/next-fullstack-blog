'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Post } from '@/app/page';
import Edit from '@/components/edit/Edit';
import { useRouter } from "next/navigation";

export default function PostDetail() {
  const params = useParams<{ id: string }>();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const [post, setPost] = useState<Post>();
  const [willEdit, setWillEdit] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(baseUrl + "/api/blog/" + params.id);
        const json = await res.json();
        setPost(json.post);
      } catch(err) {
        console.log("エラー", err);
        // alert("エラーが発生しました");
      }
    }
    getPost();
  })

  const handleDelete = async () => {
    try {
      const res = await fetch(baseUrl + "/api/blog/" + params.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: post?.id
        })
      })
      router.replace("/");
    } catch(err) {
      alert("エラーが発生しました");
      console.log(err);
    }
  }

  if(post)
  return(
    <div className="PostDetail">
      <button onClick={() => { router.back() }}>＜</button> 
      <h1>{post?.title}</h1>
      <hr />
      <p>{post?.date.toString()}</p>
      <p>{post?.description}</p>

      <hr />
      <button onClick={() => setWillEdit(!willEdit)}>
        {willEdit ? <span>編集をやめる</span>: <span>編集する</span>}
      </button>
      {willEdit 
        ? <div>
            <h2>編集エリア</h2>
            <Edit post={post}/>
          </div>
        : <></>
      }
      
      <hr />
      <button onClick={() => handleDelete()}>削除する</button>
    </div>
  )
}