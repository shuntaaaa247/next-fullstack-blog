"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

const createPost = async ({ title, description }: { title: string, description: string }) => {
  const res = await fetch(baseUrl + "/api/blog", { //エラーの場合はエラーのメッセージが入ったresが帰ってくる
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description })
  })

  return res;
}

export default function CreatePost() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(titleRef.current?.value && descriptionRef.current?.value) {
      toast.loading("Sending a post", { id: "sending_a_post"});
      try {
        const res = await createPost({ title: titleRef.current.value, description: descriptionRef.current.value });
        if(res.status !== 200) {
          //エラーハンドリング
          console.log("res = ", res);
          console.log("res.json() = ", await res.json());
          throw new Error(await res.json());
        }
        toast.success("Success", { id: "sending_a_post"});
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        
      } catch(err) {
        toast.error("Error", { id: "sending_a_post"});
      }

      router.push("/");
      router.refresh();
    } else {
      toast("text is empty ...", { icon: "😞" })
    }
  }

  return(
    <div>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <input ref={titleRef} type="text" name="title" placeholder="タイトル"/>
        <br />
        <textarea ref={descriptionRef} name="description" placeholder="本文"></textarea>
        <br />
        <button>投稿</button>
      </form>
    </div>
  )
}