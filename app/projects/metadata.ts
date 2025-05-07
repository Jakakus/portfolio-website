import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my portfolio of Data Analysis, Mobile Development, and Blockchain projects.',
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Explore my portfolio of Data Analysis, Mobile Development, and Blockchain projects.',
    type: 'website',
  },
};

export type Project = {
  id: string;
  title: string;
  category: 'data_analysis' | 'visualization' | 'business_intel' | 'predictive';
  description: string;
  longDescription: string;
  tools: string[];
  features: string[];
  previewImage?: string;
  images?: Array<{
    src: string;
    title: string;
    description: string;
  }>;
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'tree-species-classifier',
    title: 'Tree Species Classifier',
    category: 'predictive',
    description: 'Deep learning model for identifying tree species from images using EfficientNetB0 architecture.',
    longDescription: `A deep learning-based classification system for identifying tree species from images. The project uses EfficientNetB0 architecture and advanced training techniques to classify 10 different tree species common in Slovenia. Features include:
    • Two-phase training strategy with transfer learning
    • Advanced data augmentation pipeline
    • Mixup training (α=0.3)
    • Learning rate scheduling and early stopping
    • Comprehensive performance monitoring`,
    tools: ['Python', 'TensorFlow', 'EfficientNetB0', 'Data Augmentation', 'Transfer Learning'],
    features: [
      'Deep learning model for tree species classification',
      'Advanced data augmentation pipeline',
      'Two-phase training strategy',
      'Performance monitoring and visualization',
      'Dataset creation and management'
    ],
    previewImage: 'https://raw.githubusercontent.com/Jakakus/TreeSpeciesClassifier/master/training_results/confusion_matrix.png',
    images: [
      {
        src: 'https://raw.githubusercontent.com/Jakakus/TreeSpeciesClassifier/master/training_results/confusion_matrix.png',
        title: 'Confusion Matrix',
        description: 'Normalized confusion matrix showing inter-class confusion patterns'
      },
      {
        src: 'https://raw.githubusercontent.com/Jakakus/TreeSpeciesClassifier/master/training_results/training_history.png',
        title: 'Training History',
        description: 'Training and validation metrics over both phases'
      }
    ],
    githubUrl: 'https://github.com/Jakakus/TreeSpeciesClassifier'
  },
  // ... existing projects ...
]; 