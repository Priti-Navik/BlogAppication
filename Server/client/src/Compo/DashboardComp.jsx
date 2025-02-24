import { Button, Table, TableCell } from "flowbite-react";
import { React, useEffect, useState } from "react";
import { HiAnnotation, HiArrowCircleUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`/server/user/getUsers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`/server/post/getposts?limit=5`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.post);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/server/comment/getComments?limit=5`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setTotalComments(data.totalComments);
          setComments(data.comments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {}
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className=" flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>

            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowCircleUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
              <p className="text-2xl">{totalComments}</p>
            </div>

            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowCircleUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>

            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowCircleUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>


      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className=" flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Users</h1>
              <Button gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=users"}>See All</Link>
              </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && users.map((user)=>(
            <Table.Body key={user._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell>
                  <img src = {user.profilePicture} alt='user' className="w-10 h-10 rounded-full bg-gray-500"/>
                </TableCell>

                <TableCell>
                  {user.username}
                </TableCell>

              </Table.Row>
            </Table.Body>
            ))}
          </Table>
        </div>


        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className=" flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Comments</h1>
              <Button gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=comments"}>See All</Link>
              </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.map((comment)=>(
            <Table.Body key={comment._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="w-96">
                  <p className="line-clamp-2">{comment.content}</p>
                </TableCell>

                <TableCell>
                  {comment.numberOfLikes}
                </TableCell>
                
              </Table.Row>
            </Table.Body>
            ))}
          </Table>
        </div>



        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className=" flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Post</h1>
              <Button gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=posts"}>See All</Link>
              </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
            </Table.Head>
            {posts && posts.map((post)=>(
            <Table.Body key={post._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell>
                  <img src = {post.image} alt='user' className="w-14 h-10 rounded-md bg-gray-500"/>
                </TableCell>

                <TableCell className="w-96">
                  {post.title}
                </TableCell>
                <TableCell className="w-5">
                  {post.category}
                </TableCell>
                
              </Table.Row>
            </Table.Body>
            ))}
          </Table>
        </div>


      </div>
    </div>
  );
}

export default DashboardComp;
