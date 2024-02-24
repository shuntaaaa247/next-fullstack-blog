import CreatePost from "@/components/create/Create";
import Link from "next/link";
import { PostType } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

const getBlogList = async () => {
  const res = await fetch(baseUrl + "/api/blog", { cache: 'no-store' }); //res自体には無駄なデータがたくさん入っている。第二引数でSSRを設定する
  const json = await res.json(); //jsonにはapiから受け取ったpostsの配列がjsonの中で書かれている(posts: Array(3))みたいな感じで
  return json.posts;
}

export default async function Home() {

  const posts: PostType[] = await getBlogList();

  return (
    <div>
      <h1>Home</h1>

      <CreatePost />

      <div className="PostsListArea">
        {posts.map((post: PostType) => {
          return(
            <div key={post.id}>
              <Link href={"/post/" + post.id}>
                <hr />
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p>{post.date.toString()}</p>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
}