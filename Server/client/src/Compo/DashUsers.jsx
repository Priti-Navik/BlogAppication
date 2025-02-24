import { Button, Table, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]); // Store all users fetched from the server
  const [displayedUsers, setDisplayedUsers] = useState([]); // Store the users currently displayed
  const [showMore, setShowMore] = useState(false);
  const USERS_PER_PAGE = 2; // Number of users to display initially and per load
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/server/user/getusers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
          setUsers(data.users);
          setDisplayedUsers(data.users.slice(0, USERS_PER_PAGE));
          setShowMore(data.users.length > USERS_PER_PAGE);
        }
      } catch (error) {
        console.error(error.message + " - Response not coming");
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleShowMore = () => {
    const nextUsers = users.slice(
      displayedUsers.length,
      displayedUsers.length + USERS_PER_PAGE
    );
    setDisplayedUsers((prev) => [...prev, ...nextUsers]);
    if (displayedUsers.length + nextUsers.length >= users.length) {
      setShowMore(false); // No more users to load
    }
  };

  const handleDeleteUser = async (id) => {
    setShowModal(false); // Close the modal immediately
    try {
      const token = localStorage.getItem("access_token"); // Retrieve the token from localStorage

      const res = await fetch(`/server/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id)); // Filter out the deleted user by id
        setShowModal(false); // Close the modal again after successful deletion
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && displayedUsers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell> {/* Added Email column */}
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {displayedUsers.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell className="text-grey-900 dark:text-white-600">
                    {user.email}
                  </Table.Cell>{" "}
                  {/* Display Email */}
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setUserIdToDelete(user._id); // Set the user ID to delete
                        setShowModal(true); // Show the confirmation modal
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
        <p>You have no users yet.</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="grey" onClick={() => setShowModal(false)}>
                No Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashUsers;
