import { Button } from 'flowbite-react';
import React from 'react';

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-6 border border-teal-500 justify-center rounded-3xl text-center items-center bg-gray-100 shadow-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center sm:items-start">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Want to Learn JavaScript?</h2>
        <p className="text-gray-600 my-3 text-lg dark:text-gray-200">Check out resources with 100+ JavaScript projects.</p>
        <Button gradientDuoTone="purpleToPink" className="rounded-xl mt-2 w-full sm:w-auto">
          <a href="https://www.100jsprojects.com/" target="_blank" rel="noopener noreferrer" className="text-white">
            Learn More
          </a>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex-1 p-5">
        <img
          src="https://dlabs.ai/wp-content/uploads/2021/01/JS-w-Machine-Learning.png"
          alt="JavaScript Learning"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-md"
        />
      </div>
    </div>
  );
}

export default CallToAction;
