import { Button, Table, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComment() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const COMMENTS_PER_PAGE = 2;
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/server/comment/getcomments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
          setComments(data.comments);
          setDisplayedComments(data.comments.slice(0, COMMENTS_PER_PAGE));
          setShowMore(data.comments.length > COMMENTS_PER_PAGE);
        }
      } catch (error) {
        console.error(error.message + " - Response not coming");
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = () => {
    const nextComments = comments.slice(
      displayedComments.length,
      displayedComments.length + COMMENTS_PER_PAGE
    );
    setDisplayedComments((prev) => [...prev, ...nextComments]);
    if (displayedComments.length + nextComments.length >= comments.length) {
      setShowMore(false);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/server/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setDisplayedComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && displayedComments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number Of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              
            </Table.Head>
            <Table.Body>
              {displayedComments.map((comment) => (
                <Table.Row key={comment._id}>
                  <Table.Cell>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "N/A"}
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setCommentIdToDelete(comment._id);
                        setShowModal(true);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
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
        <p>You have no comments yet.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-grey-400 dark:text-grey-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-grey-500 dark:grey-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="grey" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashComment;
