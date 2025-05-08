'use client';

import { Project } from './metadata';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.main 
      className="container mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">{project.title}</h1>
        <p className="text-white/80 mb-8">{project.longDescription}</p>
        
        {project.images && project.images.length > 0 && (
          <div className="mb-8">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={project.images[currentImageIndex].src}
                alt={project.images[currentImageIndex].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {project.images.map((image: { src: string; title: string; description: string }, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-[#4F9CF9]' : ''
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Tools Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
            <ul className="space-y-2">
              {project.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-white/80">
                  <span className="text-[#4F9CF9]">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {project.githubUrl && (
          <div className="mt-8">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#4F9CF9] hover:text-white transition-colors"
            >
              <span>View on GitHub</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </motion.main>
  );
} 