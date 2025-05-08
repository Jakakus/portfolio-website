'use client';

import { projects } from './data';
import { Project } from './metadata';
import ProjectDetailClient from './project-detail';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p: Project) => p.id === params.id);

  if (!project) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-white">Project not found</h1>
      </div>
    );
  }

  return <ProjectDetailClient project={project} />;
} 