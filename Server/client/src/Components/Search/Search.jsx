import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Ensure correct import
import PostCaed from "../../Compo/PostCaed";
function Search() {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "all", // Default to 'all' to represent no category filter
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSideBarData((prev) => ({
      ...prev,
      searchTerm: urlParams.get("searchTerm") || "",
      sort: urlParams.get("sort") || "desc",
      category: urlParams.get("category") || "all", // Default to 'all'
    }));
  }, [location.search]);

  // Fetch posts whenever sidebarData changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { searchTerm, sort, category } = sidebarData;
      const queryParams = new URLSearchParams({
        searchTerm,
        sort,
        ...(category !== "all" && { category }), // Include category only if it's not "all"
      });
    
      try {
        const res = await fetch(`/server/post/getposts?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
    
        const data = await res.json();
        setPosts(data.post);
        setShowMore(data.post.length === 9);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [sidebarData]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSideBarData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebarData);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/server/post/getposts?${searchQuery}`);
      if (!res.ok) throw new Error("Failed to fetch more posts");

      const data = await res.json();
      setPosts((prevPosts) => [...prevPosts, ...data.post]);
      setShowMore(data.post.length === 9);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="all">All</option>
              <option value="reactjs">React JS</option>
              <option value="javascript">JavaScript</option>
              <option value="nextjs">Next.js</option>
              <option value="uncategorized">Uncategorized</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink">
            Apply Filter
          </Button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Post Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}

          {!loading &&
            posts &&
            posts.map((post) => <PostCaed key={post._id} post={post} />)}

          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-xl hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;