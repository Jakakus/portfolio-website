import { projects } from '../data';
import dynamic from 'next/dynamic';

const ProjectDetailClient = dynamic(() => import('./ProjectDetailClient'), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return <ProjectDetailClient project={project} />;
} 