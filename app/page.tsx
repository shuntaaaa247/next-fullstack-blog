'use client'
import { revalidatePath } from "next/cache";
import { useEffect, useState } from "react";

interface Post {
  id: number,
  title: string,
  description: string,
  date: Date
}

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getBlogList = async () => {
      const res = await fetch(baseUrl + "/api/blog"); //res自体には無駄なデータがたくさん入っている
      const json = await res.json(); //jsonにはapiから受け取ったpostsの配列がjsonの中で書かれている(posts: Array(3))みたいな感じで
      console.log("あああ", json.posts)
      setPosts(json.posts); //json.postsで投稿の配列が取り出せる
    }
    getBlogList()
  }, []);

  const addPost = async (formData: FormData) => {
    const title: FormDataEntryValue | null = formData.get("title");
    if(!title) return;

    const description: FormDataEntryValue | null = formData.get("description");
    if(!description) return;

    alert(title);
    alert(description);

    try {
      const res = await fetch(baseUrl + "/api/blog", {
        method: "POST",
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

      setPosts([...posts, newPost]);
    } catch(err) {
      console.log(err);
      alert("エラーが発生しました");
    }
  }

  return (
    <div>
      <h1>Home</h1>

      <div className="CreatePostsArea">
        <form action={addPost}>
          <input type="text" name="title" placeholder="タイトル"/>
          <input type="text" name="description" placeholder="本文"/>
          <button>投稿</button>
        </form>
      </div>

      <div className="PostsListArea">
        {posts.map((post: Post) => {
          return(
            <div key={post.id}>
              <hr />
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <p>{post.date.toString()}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}
