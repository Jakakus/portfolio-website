'use client';

import { Project } from '@/app/projects/metadata';
import { useEffect } from 'react';

// Helper function to parse markdown-style bold text
const convertMarkdownToHtml = (text: string) => {
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black/90" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-background-secondary rounded-lg shadow-xl overflow-y-auto max-h-[90vh] modal-content">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white z-10 bg-black/20 rounded-full p-2"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col">
          {/* Video Section with Description */}
          {project.videoUrl && (
            <div className="mb-8">
              <div className="w-full pt-[56.25%] relative bg-black">
                <video
                  className="absolute inset-0 w-full h-full object-contain"
                  src={project.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <p>Animated visualization demonstrating the progression of COVID-19 cases across different countries, with smooth transitions and dynamic updates.</p>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
            <p className="text-gray-400 mb-6">{project.description}</p>

            {/* Project Background */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Project Background</h3>
              <div 
                className="text-gray-400 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(project.longDescription) }}
              />
            </div>

            {/* Project Images */}
            {project.images && project.id !== 'sql-analysis' && project.id !== 'customer-churn-prediction' && project.id !== 'covid-impact-analysis' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Analysis & Visualizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.images.map((image, index) => (
                    <div key={index}>
                      <div className="bg-black/30 rounded-lg overflow-hidden">
                        <img 
                          src={image.src}
                          alt={image.title}
                          className="w-full"
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        <h4 className="text-lg text-white/80 mb-1">{image.title}</h4>
                        <p>{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.id === 'customer-churn-prediction' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Model Performance & Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/Customer-Churn-Prediction/master/images/logistic_regression_confusion_matrix.png"
                        alt="Logistic Regression Confusion Matrix"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Logistic Regression Results</h4>
                      <p>Confusion matrix showing model performance with 72% true negatives and 54% true positives, demonstrating balanced prediction capabilities.</p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/Customer-Churn-Prediction/master/images/random_forest_confusion_matrix.png"
                        alt="Random Forest Confusion Matrix"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Random Forest Results</h4>
                      <p>Random Forest model showing improved performance with 68% true negatives and 48% true positives, indicating better handling of class imbalance.</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/Customer-Churn-Prediction/master/images/random_forest_feature_importance.png"
                        alt="Feature Importance from Random Forest"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Feature Importance Analysis</h4>
                      <p>Analysis of key predictors showing monthly charges, tenure, and age as the most significant factors in customer churn prediction, with customer support calls and contract type having moderate impact.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {project.id === 'covid-impact-analysis' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Analysis & Visualizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/COVID-19-Economic-Impact/master/images/barplot_avg_decline_by_sector.png"
                        alt="Average Revenue Decline by Sector"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Sector Impact Overview</h4>
                      <p>Bar plot showing average revenue decline across different sectors, with services and healthcare experiencing the highest impact (35-37% decline).</p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/COVID-19-Economic-Impact/master/images/boxplot_decline_by_sector.png"
                        alt="Revenue Decline Distribution by Sector"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Decline Distribution Analysis</h4>
                      <p>Box plot revealing the distribution of revenue decline across sectors, highlighting variability within each industry and identifying outliers.</p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/COVID-19-Economic-Impact/master/images/hist_decline_percent.png"
                        alt="Distribution of Revenue Decline"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Overall Impact Distribution</h4>
                      <p>Histogram showing the distribution of revenue decline percentages across all businesses, with most experiencing 20-50% reduction.</p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                      <img 
                        src="https://raw.githubusercontent.com/Jakakus/COVID-19-Economic-Impact/master/images/scatter_pre_vs_post_revenue.png"
                        alt="Pre vs Post COVID Revenue Comparison"
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <h4 className="text-lg text-white/80 mb-1">Revenue Change Analysis</h4>
                      <p>Scatter plot comparing pre-COVID vs post-COVID revenue by sector, with the diagonal line representing no change. Points below the line indicate revenue decline.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {project.id === 'sql-analysis' && project.images && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Analysis & Visualizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.images.map((image, index) => (
                    <div key={index}>
                      <div className="bg-black/30 rounded-lg overflow-hidden">
                        <img 
                          src={image.src}
                          alt={image.title}
                          className="w-full"
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        <h4 className="text-lg text-white/80 mb-1">{image.title}</h4>
                        <p>{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  View Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Show Code - GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal; 