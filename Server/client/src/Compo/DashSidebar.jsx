import { Sidebar } from 'flowbite-react';
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/server/user/signout", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        dispatch(signoutSuccess());
        alert("Want signout click Ok if yes");
        navigate("/sign-in");
      } else {
        alert("Failed to sign out: " + data.message);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
             
          { currentUser && currentUser.isAdmin && (
              <Sidebar.Item 
                as={Link} 
                to="/dashboard?tab=dash" 
                active={tab === 'dash' || !tab} 
                icon={HiChartPie}
               
              >
               Dashboard
              </Sidebar.Item>
            )}

            <Sidebar.Item 
              as={Link} 
              to="/dashboard?tab=profile" 
              active={tab === 'profile'} 
              icon={HiUser} 
              label={currentUser.isAdmin ? 'Admin' : 'User'} 
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>

            {currentUser.isAdmin && (
              <Sidebar.Item 
                as={Link} 
                to="/dashboard?tab=posts" 
                active={tab === 'posts'} 
                icon={HiDocumentText}
              >
                Posts
              </Sidebar.Item>
            )}

            {currentUser.isAdmin && (
              <Sidebar.Item 
                as={Link} 
                to="/dashboard?tab=users" 
                active={tab === 'users'} 
                icon={HiOutlineUserGroup}
              >
                Users
              </Sidebar.Item>
            )}

           {currentUser.isAdmin && (
              <Sidebar.Item 
                as={Link} 
                to="/dashboard?tab=comments" 
                active={tab === 'comments'} 
                icon={HiAnnotation}
              >
                Comments
              </Sidebar.Item>
            )}

            <Sidebar.Item 
              icon={HiArrowSmRight} 
              onClick={handleSignOut} 
              className="cursor-pointer"
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default DashSidebar;
