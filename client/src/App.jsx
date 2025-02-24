
import { BrowserRouter as Router , Routes, Route } from "react-router-dom"
import Home from "./Components/Home/Home"
import About from "./Components/About/About"
import ContactMe from "./Components/Contact/ContactMe"
import SignIn from "./Components/Account/SignIn"
import SignUp from "./Components/Account/SignUp"
import Dashboard from "./Components/Dashboard/Dashboard"
import PrivateRoute from "./Compo/PrivateRoute"
import OnlyAdminPrivateRoute from "./Compo/OnlyAdminPrivateRoute"
import Project from "./Components/Project/Project"
import Header from "./Compo/Header"
import 'flowbite/dist/flowbite.css'; // Ensure this is in your entry file
import FooterCom from "./Compo/FooterCom"
import CreatePost from "./Components/Admin/CreatePost"
import UpdatePost from "./Components/Admin/UpdatePost"
import Postpage from "./Compo/Postpage"
import ScrollToTop from "./Compo/ScrollToTop"
import Search from "./Components/Search/Search"


function App() {
 

  return (
    <Router>
      <ScrollToTop/>
      <Header/>
       <Routes>
        <Route path ="/" element ={<Home/>} />
        <Route path ="/about" element ={<About/>} />
        <Route path ="/contact" element ={<ContactMe/>} />
        <Route path ="/sign-in" element ={<SignIn/>} />
        <Route path ="/sign-up" element ={<SignUp/>} />
        <Route path ="/search" element ={<Search/>} />
        <Route element={<PrivateRoute/>}>
        <Route path ="/dashboard" element ={<Dashboard/>} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
        <Route path ="/create-post" element ={<CreatePost/>} />
        <Route path ="/update-post/:postId" element ={<UpdatePost/>} />
        </Route>
        
        

        <Route path ="/projects" element ={<Project/>} />
        <Route path ="/post/:postSlug" element ={<Postpage/>} />
       </Routes>
       <FooterCom/>
    </Router>
  )
}

export default App
