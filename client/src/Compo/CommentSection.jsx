import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { Textarea, Button, Alert , Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Comment from "./Comment";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user) || {};
  const [comment, setComment] = useState(""); // ✅ Correct naming
  const [allComments, setAllComments] = useState([]); // ✅ Correct naming
  const [commentError, setCommentError] = useState("");
  const[ showModal , setShowModal] = useState(false);
  const[commentToDelete , setCommentToDelete] = useState(null)
   const navigate = useNavigate();
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("/server/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment, postId, userId: currentUser?._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit comment");

      console.log("Comment posted successfully:", data);
      setComment(""); // ✅ Reset comment input
      setCommentError("");

      // ✅ Refresh comments after posting
      //setAllComments((prevComments) => [data, ...prevComments]);
    } catch (error) {
      setCommentError(error.message);
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`/server/comment/getPostComment/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllComments(data); // ✅ Correct state update
        }
      } catch (error) {
        console.log(error.message + " something went wrong");
      }
    };

    getComments();
  }, [postId, currentUser]); // ✅ Include `currentUser` in dependency
 

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
  
      const token = localStorage.getItem("access_token"); 
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
  
      const res = await fetch(`/server/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to like/unlike the comment");
      }
  
      const data = await res.json();
  
      // ✅ Update the likes in state properly
      setAllComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: data.likes, numberOfLikes: data.numberOfLikes }
            : comment
        )
      );
    } catch (error) {
      console.log("Error liking comment:", error.message);
    }
  };
  
  
  const handleEdit = async (comment, editedComment) => {
    setAllComments(
      allComments.map((c) => {
        return c._id === comment._id ? { ...c, content: editedComment } : c;
      })
    );
  };


  const handleDelete = async (commentToDelete) => {
    setShowModal(false);
    if(!currentUser){
      navigate('/sign-in');
      return;
    }
    if (!commentToDelete) return;
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
  
      const res = await fetch(`/server/comment/deleteComment/${commentToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete the comment");
      }
  
      // Remove the deleted comment from the state
      const data = await res.json();
      setAllComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentToDelete)
      );
  
      // Close the modal after deletion
      setShowModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };
  
  
  return (
    <div className="mt-10 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">💬 Comments</h2>
  
      {currentUser ? (
        <div className="flex items-center space-x-3 pb-4">
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Signed in as:</p>
            <Link to="/dashboard?tag=profile" className="text-blue-600 font-medium hover:underline">
              @{currentUser.username}
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          <p>You must be signed in to comment.</p>
          <Link to="/sign-in" className="text-blue-500 font-medium hover:underline">
            ➡️ Sign In Here
          </Link>
        </div>
      )}
  
      {currentUser && (
        <form onSubmit={handleSubmit} className="border-b pb-4">
          <Textarea
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            rows="2"
            maxLength="200"
            value={comment}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">{200 - comment.length} characters remaining</p>
            <Button className="bg-blue-500 text-white px-4 py-1 rounded-md" type="submit">
              Comment
            </Button>
          </div>
          {commentError && <p className="text-red-500 text-sm mt-2">{commentError}</p>}
        </form>
      )}
  
      {/* Comments List */}
      <div className="mt-6">
        {allComments.length === 0 ? (
          <p className="text-sm my-5 text-gray-600">No Comments Yet!</p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-2">
              <p>Comments</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{allComments.length}</p>
              </div>
            </div>
            {allComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={() => {
                  setShowModal(true);
                  setCommentToDelete(comment._id);
                }}
              />
            ))}
          </>
        )}
        {/* Delete Confirmation Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button color="failure" onClick={() => handleDelete(commentToDelete)}>Delete</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
  export default CommentSection;
