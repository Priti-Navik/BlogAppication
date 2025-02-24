import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import PostCaed from "./PostCaed";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";

export default function Postpage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("access_token");
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`/server/post/getposts?slug=${postSlug}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await res.json();
        setPost(data.post[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`/server/post/getposts?limit=2`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          // console.log("posts 3 fetched");
          setRecentPosts(data.post);
        } else {
          throw new Error(data.message || "Failed to fetch recent posts");
        }
      } catch (error) {
        console.log("Error fetching recent posts:", error.message);
      }
    };

    fetchRecentPosts();
  }, []); //  Dependency array remains empty for one-time execution

  useEffect(() => {
    console.log("Updated recentPosts:", recentPosts);
  }, [recentPosts]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" color="purple" />
      </div>
    );

  if (error || !post)
    return (
      <div className="text-center text-red-600 dark:text-red-400 text-xl font-semibold mt-20">
        ⚠️ Oops! Something went wrong while loading the post.
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mt-8 text-center text-gray-900 dark:text-gray-100 leading-snug">
        {post.title}
      </h1>

      {/* Category Tag */}
      <div className="flex justify-center mt-4">
        <Link to={`/search?category=${post.category}`}>
          <Button color="purple" pill size="sm" className="px-5 py-2 shadow-md">
            {post.category}
          </Button>
        </Link>
      </div>

      {/* Post Image */}
      <div className="mt-10 flex justify-center">
        <img
          src={post.image}
          alt={post.title}
          className="rounded-2xl shadow-2xl max-h-[500px] w-full object-cover border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Meta Information */}
      <div className="mt-6 text-center">
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          📅 {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          ⏳ {(post.content.length / 1000).toFixed(0)} min read
        </p>
      </div>

      {/* Post Content */}
      <div
        className="mt-6 p-6 text-lg leading-relaxed text-gray-800 dark:text-gray-200 max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* Call to Action Section */}
      <div className="mt-16 ">
        <CallToAction />
      </div>

      {/* Comment Section */}
      <div className="mt-10 w-full border-t border-gray-300 dark:border-gray-600 pt-5">
        <CommentSection postId={post._id} />
      </div>

      <h1 className="text-xl mt-5 border-b border-gray-300 dark:border-gray-600 pb-2 w-full text-center font-semibold">
          Recent Articles
        </h1>
      <div className="flex flex-wrap justify-center gap-7 mt-5">
  {recentPosts &&
    recentPosts.map((post) => (
      <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-5">
        <PostCaed post={post} />
      </div>
    ))}
</div>

    </div>
  );
}
