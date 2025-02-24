import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../../Compo/CallToAction.jsx";
import PostCaed from "../../Compo/PostCaed.jsx";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch(`/server/post/getPosts`, {
        method: "GET",
      });
      const data = await res.json();

      if (res.ok) {
        setPosts(data.post);
        //console.log("home" ,posts);
      }
    };
    getPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-4xl font-bold text-pink-600 dark:text-white lg:text-6xl">
          Welcome to My Space 🚀
        </h1>
        <p className="mt-4 text-lg text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          This is where I share my journey—my projects, ideas, and everything
          I’m learning along the way. Whether you love tech, enjoy exploring new
          ideas, or just stumbled here out of curiosity, I hope you find
          something interesting. Feel free to look around and see what I’ve been
          up to! 😊✨
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 text-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-blue-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semi-bold text-center">
              Recent posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {posts.map((post) => (
                <PostCaed ket={post._id} post={post} />
              ))}
            </div>
            <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">
            view all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
