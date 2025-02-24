import React from 'react';
import CallToAction from '../../Compo/CallToAction';


const projects = [
  {
    name: "Blog Website",
    description: "A full-stack MERN blog platform with authentication and CRUD operations.",
    repo: "https://github.com/Priti-Navik/mern-Project/tree/main/BlogWebsite",
    image: "../../../images/websiteblog.jpg" // Adjusted path
  },
  {
    name: "Password Generator",
    description: "A secure password generator with customizable length and character types.",
    repo: "https://github.com/Priti-Navik/mern-Project/tree/main/PasswordGenerator",
    image: "../../../images/password.jpg"
  },
  {
    name: "To-Do List",
    description: "A simple React-based task manager with local storage support.",
    repo: "https://github.com/Priti-Navik/mern-Project/tree/main/TodoList",
    image: "../../../images/todo.jpg"
  },
  {
    name: "Background Changer",
    description: "A real-time background changer application built with React.",
    repo: "https://github.com/Priti-Navik/mern-Project/tree/main/bgChanger",
    image: "../../../images/bgchanger.jpg"
  },
  {
    name: "Tic Tac Toe",
    description: "A classic Tic Tac Toe game built with React and hooks.",
    repo: "https://github.com/Priti-Navik/TicTacToe-Project",
    image: "../../../images/tictactoe.jpg"
  },
];


function Project() {
  return (
    <div className='min-h-screen max-w-4xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className="text-lg text-gray-400 text-center">
        Explore my latest <strong>MERN stack projects, innovative web apps, and hands-on coding experiences</strong>.  
        Stay inspired and build something incredible! 🚀💡
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md">
            <img 
              src={project.image} 
              alt={project.name} 
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{project.name}</h2>
            <p className="text-gray-500">{project.description}</p>
            <a 
              href={project.repo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              View on GitHub →
            </a>
          </div>
        ))}
      </div>

      <CallToAction />
    </div>
  );
}

export default Project;
