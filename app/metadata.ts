import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Portfolio showcasing Data Analysis, Mobile, and Blockchain projects.',
  openGraph: {
    title: 'My Portfolio',
    description: 'Portfolio showcasing Data Analysis, Mobile, and Blockchain projects.',
    type: 'website',
  },
};

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tools: string[];
  features: string[];
  previewImage: string;
  images: {
    src: string;
    title: string;
    description: string;
  }[];
  githubUrl: string;
  demoUrl?: string;
  videoUrl?: string;
} 