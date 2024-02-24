import { useState } from "react";
import { PostType } from "@/app/types";

interface Props {
  post: PostType
}

export default function Edit({ post }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const [titleOnEdit, setTitleOnEdit] = useState<string>(post.title);
  const [descriptionOnEdit, setDescriptionOnEdit] = useState<string>(post.description);

  const editPost = async (formData: FormData) => {
    const title: FormDataEntryValue | null = formData.get("title");
    if(!title) return;

    const description: FormDataEntryValue | null = formData.get("description");
    if(!description) return;

    try {
      const res = await fetch(baseUrl + "/api/blog/" + post.id, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      })

      const json = await res.json();
      const newPost = json.post;

    } catch(err) {
      console.log(err);
      alert("エラーが発生しました");
    }
  }

  return(
    <div className="CreatePostsArea">
      <form action={editPost}>
        <input type="text" name="title" placeholder="タイトル" value={titleOnEdit} onChange={(e) => setTitleOnEdit(e.target.value)}/>
        <input type="text" name="description" placeholder="本文" value={descriptionOnEdit} onChange={(e) => setDescriptionOnEdit(e.target.value)}/>
        <button>投稿</button>
      </form>
    </div>
  )
}