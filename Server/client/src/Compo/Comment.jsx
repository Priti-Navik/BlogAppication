import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react"; // Flowbite Textarea



function Comment({ comment, onLike , onEdit ,onDelete }) {
  const { currentUser } = useSelector((state) => state.user) || {};
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(comment.content);
  const isLiked = currentUser && comment.likes.includes(currentUser._id);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/server/user/${comment.userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log("Error fetching user:", error.message);
      }
    };

    getUser();
  }, [comment.userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/server/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editComment }), // ✅ Fixed JSON Body
      });

      if (!response.ok) throw new Error("Failed to update comment");

      const updatedComment = await response.json(); // ✅ Fetch updated comment
      onEdit( comment , editComment); // ✅ Update UI
      setIsEditing(false); // ✅ Exit edit mode

    } catch (error) {
      console.log("Error updating comment:", error.message);
    }
  }

  return (
    <div className="flex gap-3 p-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {user && (
        <>
          {/* User Avatar */}
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt={user.username || "Anonymous"}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
          />

          {/* Comment Content */}
          <div className="flex flex-col w-full">
            {/* Username + Time */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-200">
                {user.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {moment(comment.createdAt).fromNow()}
              </p>
            </div>

            {isEditing ? (
              <>
              <Textarea
               defaultValue={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="mt-2 p-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end gap-2 text-xs mt-1">
                 <Button type="button" size='sm' gradientDuoTone="purpleToBlue" onClick={handleSave}>Save</Button>
                 <Button type="button"  size='sm' gradientDuoTone="purpleToBlue" onClick={()=>setIsEditing(false)}>Cancel</Button>
              </div>
              </>

            ) : (
              <p className="text-gray-800 dark:text-gray-300 mt-1 text-sm">
                {comment.content}
              </p>
            )}

            {/* Buttons Section */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              {/* Like Button */}
              <button
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1 ${
                  isLiked ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-400 transition-all duration-200`}
              >
                <FaThumbsUp />
                <span>
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      " " +
                      (comment.numberOfLikes === 1 ? "Like" : "Likes")}
                </span>
              </button>

              {/* Edit Button (Only for Comment Owner or Admin) */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-700 hover:text-blue-500 transition-all duration-200"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={()=>onDelete(comment._id)}
                    className="text-gray-700 hover:text-red-500 transition-all duration-200"
                  >
                    Delete
                  </button>
                  </>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Comment;
