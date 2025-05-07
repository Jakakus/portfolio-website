'use client';

import { useRouter } from 'next/navigation';
import { projects } from '../data';
import { motion } from 'framer-motion';
import { use } from 'react';

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const project = projects.find(p => p.id === resolvedParams.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <motion.main 
      className="container mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Projects
      </button>

      <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6" />
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-600 mb-6">{project.longDescription}</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <motion.div
            {...fadeIn}
            className="bg-white rounded-lg p-6 shadow-lg mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {(project.demoUrl || project.githubUrl) && (
            <motion.div {...fadeIn} className="flex gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  View Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-900 transition-colors"
                >
                  View Code
                </a>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.main>
  );
} 