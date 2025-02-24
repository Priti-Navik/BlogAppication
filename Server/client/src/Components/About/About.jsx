import React from 'react';
import { Card, Flowbite, DarkThemeToggle } from 'flowbite-react';
import { motion } from 'framer-motion';

function About() {
  return (
    <Flowbite>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white p-5">
        <DarkThemeToggle className="absolute top-4 right-4" />
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-4xl font-bold mb-4 text-pink-400">Welcome to My Blog</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Explore the latest insights on <strong>React, JavaScript, Next.js, and modern web development</strong>.
            Whether you're a beginner or an experienced developer, you'll find valuable content to
            <strong> enhance your skills, stay updated, and build amazing projects</strong>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">What You'll Get Here</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg space-y-2">
              <li>🔥 <strong>Latest updates & trends in web development</strong></li>
              <li>📖 <strong>Deep-dive tutorials & guides on React, Next.js, and more</strong></li>
              <li>🚀 <strong>Practical projects & real-world coding tips</strong></li>
              <li>🛠 <strong>Best tools & libraries to boost your development workflow</strong></li>
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6"
        >
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <strong>Stay tuned, keep coding, and build something amazing! 💖</strong>
          </p>
        </motion.div>
      </div>
    </Flowbite>
  );
}

export default About;
