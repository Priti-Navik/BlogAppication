import { Button, Table, Modal, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [allPosts, setAllPosts] = useState([]); // Store all posts fetched from the server
  const [displayedPosts, setDisplayedPosts] = useState([]); // Store the posts currently displayed
  const [showMore, setShowMore] = useState(true);
  const POSTS_PER_PAGE = 2; // Number of posts to display initially and per load
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const[postIdDelete,setPostIdDelete] = useState('');
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/server/post/getPosts`);
        const data = await res.json();
        console.log(data); // Check the structure of data

        if (res.ok) {
          setAllPosts(data.post);
          setDisplayedPosts(data.post.slice(0, POSTS_PER_PAGE)); // Display only the first 2 posts initially
          if (data.post.length <= POSTS_PER_PAGE) {
            setShowMore(false); // Hide "Show More" if there are no more posts to load
          }
        }
      } catch (error) {
        console.log(error.message + " - Response not coming");
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = () => {
    const nextPosts = allPosts.slice(
      displayedPosts.length,
      displayedPosts.length + POSTS_PER_PAGE
    );
    setDisplayedPosts((prev) => [...prev, ...nextPosts]);
    if (displayedPosts.length + nextPosts.length >= allPosts.length) {
      setShowMore(false); // No more posts to load
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
  
    try {
      const token = localStorage.getItem("access_token");
      console.log(postIdDelete, currentUser.id);
      const res = await fetch(`/server/post/deletepost/${postIdDelete}/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        setAlertMessage("The post has been deleted");
        setAlertType("success");
        setShowAlert(true);
  
        setAllPosts((prev) => prev.filter((post) => post._id !== postIdDelete));
        setDisplayedPosts((prev) => prev.filter((post) => post._id !== postIdDelete));
      } else {
        setAlertMessage(data.message || "Failed to delete post");
        setAlertType("failure");
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage("An error occurred while deleting the post");
      setAlertType("failure");
      setShowAlert(true);
    }
  };
  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && displayedPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {displayedPosts.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    {post.updatedAt
                      ? new Date(post.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-12 w-20 object-cover bg-grey-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdDelete(post._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <button className="text-green-500 hover:underline cursor-pointer">
                        Edit
                      </button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-grey-400 dark:text-grey-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-grey-500 dark:grey-400">
              Are you sure you want to delete your post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="grey" onClick={() => setShowModal(false)}>
                No Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteUser}>
                Yes , I'm sure
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {showAlert && (
        <Alert
          color={alertType}
          onDismiss={() => setShowAlert(false)}
          className="mb-4"
        >
          <span>{alertMessage}</span>
        </Alert>
      )}
    </div>
  );
}

export default DashPost;
