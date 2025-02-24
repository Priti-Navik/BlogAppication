import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Compo/DashSidebar";
import DashProfile from "../../Compo/DashProfile";
import DashPost from "../../Compo/DashPost";
import DashUsers from "../../Compo/DashUsers";
import DashComment from "../../Compo/DashComment";
import DashboardComp from "../../Compo/DashboardComp";
function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    console.log(tabFromUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
    {/* Sidebar */}
    <div className=" border md:w-56 ">{/* Sidebar should also fill full height */}
      <DashSidebar />
    </div>-
  
    {/* Content - Profile */}
   
      {tab === "profile" && <DashProfile />}
      {tab=== "posts" && <DashPost/>}
      {tab=== "users" && <DashUsers/>}
      {tab=== "comments" && <DashComment/>}

      {tab=== "dash" && <DashboardComp/>}
    </div>
 
    
  );
}

export default Dashboard;
