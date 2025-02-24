import {
  Navbar,
  TextInput,
  Button,
  Dropdown,
  Avatar,
  Modal,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

function Header() {
  const location = useLocation();
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const[searchTerm , setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(()=>{
const urlParams = new URLSearchParams(location.search);
const searchTermFromUrl = urlParams.get('searchTerm');
if(searchTermFromUrl){
  setSearchTerm(searchTermFromUrl);
  
}
} , [location.search])


  const handleSignOut = async () => {
    setIsModalOpen(false); // Close modal

    try {
      const response = await fetch("/server/user/signout", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      } else {
        alert(`Failed to sign out: ${data.message}`);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  const handleSubmit = (e)=>{
e.preventDefault();
const urlParams = new URLSearchParams(location.search);
urlParams.set('searchTerm' , searchTerm);
const searchQuery = urlParams.toString();
navigate(`/search?${searchQuery}`)
  };

  return (
    <>
      {/* Sign-out Confirmation Modal */}

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Confirm Sign Out</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setIsModalOpen(false)}>
                No, Cancel
              </Button>
              <Button color="failure" onClick={handleSignOut}>
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Navbar */}
      <Navbar className="border-b-2 px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Krishna
          </span>
          <span className="ml-1">Radha</span>
        </Link>

        {/* Centered Search Bar */}
        <form onSubmit={handleSubmit} className="hidden md:flex w-1/3">
          <TextInput
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            rightIcon={AiOutlineSearch}
            className="w-full"
            aria-label="Search"
          />
        </form>

        {/* Right Side - Navigation & Profile */}
        <div className="flex items-center gap-5">
          {/* Navigation Links */}
          <div className="hidden lg:flex gap-6 text-lg font-medium">
            <Link
              to="/"
              className={`hover:text-blue-500 ${
                location.pathname === "/" ? "text-blue-600 font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`hover:text-blue-500 ${
                location.pathname === "/about" ? "text-blue-600 font-bold" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`hover:text-blue-500 ${
                location.pathname === "/projects"
                  ? "text-blue-600 font-bold"
                  : ""
              }`}
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className={`hover:text-blue-500 ${
                location.pathname === "/contact"
                  ? "text-blue-600 font-bold"
                  : ""
              }`}
            >
              Contact
            </Link>

            {/* Theme Toggle */}
            <div className="flex gap-2 md:order-2">
              <Button
                className="w-12 h-10 hidden sm:inline"
                color="gray"
                pill
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle Theme" // Accessibility enhancement
              >
                {theme === "light" ? <FaSun /> : <FaMoon />}
              </Button>
            </div>
          </div>

          {/* Profile Dropdown */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture || "/default-avatar.png"}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setIsModalOpen(true)}>
                Sign Out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </Navbar>
    </>
  );
}

export default Header;
