'use client';

import { useState, useEffect } from 'react';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import GalaxyScene from '@/components/GalaxyScene';
import ProjectModal from '@/components/ProjectModal';
import { Project } from './projects/metadata';
import { projects } from './projects/data';
import { theme } from './theme';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';

// Add error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#00072D] to-[#000C52] flex items-center justify-center">
        <div className="text-white text-opacity-80 text-center">
          <p>Loading alternate view...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

const allCategories = Array.from(new Set(projects.map(p => p.category)));
const allTechnologies = Array.from(new Set(projects.flatMap(p => p.tools)));

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenTechnology, setIsOpenTechnology] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMenuOpen(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesTechnology = !selectedTechnology || project.tools.includes(selectedTechnology);
    return matchesCategory && matchesTechnology;
  });

  return (
    <div className="relative min-h-screen bg-background-primary">
      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <ErrorBoundary>
          <BackgroundAnimation />
        </ErrorBoundary>
      </div>

      {/* Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white/70 hover:text-white transition-colors p-2 rounded-lg bg-background-secondary/50 backdrop-blur-sm"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="navigation-menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menu Content */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <nav 
            id="navigation-menu"
            className="fixed right-0 top-0 z-50 w-80 h-screen bg-background-secondary/95 shadow-lg transform transition-transform duration-300"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="p-8">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Menu Header */}
              <div className="mb-8 mt-4">
                <h3 className="text-white text-xl font-semibold">Menu</h3>
                <p className="text-white/50 text-sm mt-1">Navigate through sections</p>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {[
                  { id: 'hero', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                  { id: 'projects', label: 'Data Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { id: 'about', label: 'About Me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white/50 text-sm mb-4">Connect with me</h4>
                <div className="flex gap-4">
                  <a
                    href="https://si.linkedin.com/in/jaka-kus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    href="mailto:jakakus10@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 pb-8 pt-20 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left w-full lg:w-[45%] relative">
                <div className="space-y-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-white mb-4 relative">
                    <span className="inline-block animate-float-slow">Welcome to</span>
                    <br />
                    <span className="inline-block bg-gradient-to-r from-[#4F9CF9]/90 via-white to-[#4F9CF9]/90 text-transparent bg-clip-text animate-gradient">
                      My Tech Cosmos
                    </span>
                  </h1>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white/90 mb-6">
                    Hi, I&apos;m{' '}
                    <span className="relative">
                      <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-float">
                        Jaka Kus
                      </span>
                      <span className="absolute -inset-1 bg-white/10 blur-sm rounded-lg -z-10"></span>
                    </span>
                  </h2>

                  <div className="h-16 mb-8 relative">
                    <TypeAnimation
                      sequence={[
                        'Data Visualization Expert',
                        2000,
                        'Business Intelligence Developer',
                        2000,
                        'Your Guide Through Data',
                        2000,
                      ]}
                      wrapper="div"
                      speed={50}
                      className="text-xl sm:text-2xl lg:text-3xl text-white/80"
                      repeat={Infinity}
                    />
                  </div>

                  <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in">
                    <span className="block mb-4">
                      Welcome to my corner of the digital universe, where I transform complex data into clear, 
                      actionable insights that illuminate new business opportunities.
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start animate-fade-in-up">
                    <div className="flex gap-4 w-full sm:w-auto justify-center">
                      <a
                        href="https://github.com/Jakakus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-110"
                        aria-label="GitHub Profile"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                    <button
                      onClick={() => scrollToSection('projects')}
                      className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>Explore Projects</span>
                        <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Galaxy Scene */}
              <div className="w-full lg:w-[55%] h-[400px] sm:h-[500px] lg:h-[600px] relative overflow-visible">
                <div className="absolute inset-0 w-[200%] h-[200%] left-1/2 transform -translate-x-1/2 -translate-y-[25%] scale-100 sm:scale-110">
                  <ErrorBoundary>
                    <GalaxyScene className="w-full h-full" />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section with improved gradient transition */}
        <section id="projects" className="relative py-12 px-4" aria-labelledby="projects-heading">
          <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent via-background-primary to-background-primary"></div>
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background-primary via-background-primary to-transparent opacity-90 pointer-events-none"></div>
          
          <div className="container mx-auto relative z-10">
            <h2 
              id="projects-heading"
              onClick={() => setShowDescription(!showDescription)}
              className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center cursor-pointer hover:text-white/80 transition-colors flex items-center justify-center gap-2"
              role="button"
              aria-expanded={showDescription}
              aria-controls="project-descriptions"
            >
              Portfolio Projects
              <svg 
                className={`w-6 h-6 transition-transform ${showDescription ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h2>

            {showDescription && (
              <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto px-4">
                A collection of sample projects showcasing data analysis and visualization skills. 
                These are personal projects created for demonstration purposes and do not contain any 
                proprietary information or data from previous employers. Each project represents a 
                different aspect of data analysis and visualization techniques.
              </p>
            )}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center px-4 relative z-20">
              {/* Category Filter Vertical Panel */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsOpenCategory(true)}
                  className="w-full sm:w-[200px] px-4 py-2 bg-black/50 text-white rounded-lg transition-colors flex items-center gap-2 hover:bg-black/70 shadow-lg"
                >
                  {selectedCategory ? 
                    (selectedCategory === 'data_analysis' ? 'Data Analysis' :
                     selectedCategory === 'business_intel' ? 'Business Intelligence' :
                     selectedCategory === 'predictive' ? 'Predictive Analytics' :
                     selectedCategory === 'visualization' ? 'Data Visualization' : 
                     selectedCategory) 
                    : 'Filter by Category'}
                  <svg className={`w-4 h-4 ml-auto transition-transform ${isOpenCategory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpenCategory && (
                  <>
                    {/* Dimmed background */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" onClick={() => setIsOpenCategory(false)} />
                    {/* Vertical panel anchored below button */}
                    <div className="absolute left-0 right-0 mt-2 z-40 max-h-[60vh] overflow-y-auto bg-background-secondary/95 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/10 animate-slide-down">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">Select Category</h3>
                        <button
                          onClick={() => setIsOpenCategory(false)}
                          className="text-white/60 hover:text-white text-2xl ml-2"
                          aria-label="Close category filter"
                        >
                          &times;
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setIsOpenCategory(false);
                        }}
                        className={`w-full py-3 text-lg rounded-xl mb-1 bg-white/10 hover:bg-[#4F9CF9]/30 text-white/80 hover:text-white font-semibold transition-all`}
                      >
                        All Categories
                      </button>
                      {allCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsOpenCategory(false);
                          }}
                          className={`w-full py-3 text-lg rounded-xl mb-1 bg-white/10 hover:bg-[#4F9CF9]/30 text-white/80 hover:text-white font-semibold transition-all`}
                        >
                          {category === 'data_analysis' ? 'Data Analysis' :
                           category === 'business_intel' ? 'Business Intelligence' :
                           category === 'predictive' ? 'Predictive Analytics' :
                           category === 'visualization' ? 'Data Visualization' : 
                           category}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Technology Filter Vertical Panel */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsOpenTechnology(true)}
                  className="w-full sm:w-[200px] px-4 py-2 bg-black/50 text-white rounded-lg transition-colors flex items-center gap-2 hover:bg-black/70 shadow-lg"
                >
                  {selectedTechnology || 'Filter by Technology'}
                  <svg className={`w-4 h-4 ml-auto transition-transform ${isOpenTechnology ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpenTechnology && (
                  <>
                    {/* Dimmed background */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" onClick={() => setIsOpenTechnology(false)} />
                    {/* Vertical panel anchored below button */}
                    <div className="absolute left-0 right-0 mt-2 z-40 max-h-[60vh] overflow-y-auto bg-background-secondary/95 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/10 animate-slide-down">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">Select Technology</h3>
                        <button
                          onClick={() => setIsOpenTechnology(false)}
                          className="text-white/60 hover:text-white text-2xl ml-2"
                          aria-label="Close technology filter"
                        >
                          &times;
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTechnology(null);
                          setIsOpenTechnology(false);
                        }}
                        className={`w-full py-3 text-lg rounded-xl mb-1 bg-white/10 hover:bg-[#4F9CF9]/30 text-white/80 hover:text-white font-semibold transition-all`}
                      >
                        All Technologies
                      </button>
                      {allTechnologies.map(tech => (
                        <button
                          key={tech}
                          onClick={() => {
                            setSelectedTechnology(tech === selectedTechnology ? null : tech);
                            setIsOpenTechnology(false);
                          }}
                          className={`w-full py-3 text-lg rounded-xl mb-1 bg-white/10 hover:bg-[#4F9CF9]/30 text-white/80 hover:text-white font-semibold transition-all`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-background-secondary/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 h-[350px] flex flex-col"
                >
                  <div className="relative w-full h-48 bg-black/30">
                    {project.videoUrl ? (
                      <>
                        <video 
                          className="absolute inset-0 w-full h-full object-cover"
                          src={project.videoUrl}
                          muted
                          loop
                          preload="metadata"
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/70 group-hover:opacity-0 transition-opacity">
                            Hover to preview
                          </span>
                        </div>
                      </>
                    ) : project.previewImage ? (
                      <Image
                        src={project.previewImage}
                        alt={`${project.title} preview`}
                        width={500}
                        height={300}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/50">No preview available</span>
                      </div>
                    )}
                  </div>
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${theme.colors.categories[project.category].light}20, ${theme.colors.categories[project.category].dark}40)`
                    }}
                  />
                  <div className="relative flex-1 p-6 flex flex-col">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                      <p className="text-white/70 mb-4 line-clamp-3">{project.description}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.tools.slice(0, 5).map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-sm rounded-full bg-white/10 text-white/80"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About Section - Now merged with Portfolio Overview */}
        <section id="about" className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background-primary to-background-secondary/50 opacity-50 pointer-events-none"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Exploring My Data Universe</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#4F9CF9]/90 to-white mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column - Interactive Star Map */}
              <div className="bg-background-secondary/30 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/5 transform hover:scale-102 transition-all duration-300 h-full">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#4F9CF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  My Cosmic Journey
                </h3>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  As a Data & Business Analyst, I navigate through the vast cosmos of information, charting new paths 
                  through data galaxies. Each project represents a unique constellation in my professional universe, 
                  where I transform complex data patterns into clear, actionable insights that guide business decisions.
                </p>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  My journey through the tech cosmos has equipped me with a unique perspective on data visualization 
                  and analytics. Like a cosmic cartographer, I map out data landscapes and create interactive 
                  visualizations that reveal hidden patterns and insights.
                </p>
                
                <div className="mt-6 flex justify-end">
                  <a 
                    href="https://github.com/Jakakus" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#4F9CF9] hover:text-white transition-colors"
                  >
                    <span>Explore my constellation</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Right Column - Portfolio Skills Map */}
              <div className="bg-background-secondary/30 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/5 transform hover:scale-102 transition-all duration-300 h-full">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#4F9CF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Portfolio Nebula
                </h3>

                <div className="space-y-6 text-white/80">
                  <p className="mb-4">
                    This portfolio showcases a collection of data science and analytics projects demonstrating a range of 
                    techniques from exploratory data analysis to advanced machine learning. Each project represents 
                    real-world business challenges solved through data-driven approaches.
                  </p>

                  <div className="grid grid-cols-1 gap-6 mt-4">
                    <div className="bg-white/5 rounded-xl p-5 transform transition-all hover:bg-white/10 hover:translate-y-[-5px] duration-300">
                      <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#4F9CF9]/20 flex items-center justify-center text-[#4F9CF9]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </span>
                        Technical Superpowers
                      </h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm">
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Data preprocessing
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Statistical analysis
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Machine learning
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Time series forecasting
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Data visualization
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> NLP techniques
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-5 transform transition-all hover:bg-white/10 hover:translate-y-[-5px] duration-300">
                      <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#4F9CF9]/20 flex items-center justify-center text-[#4F9CF9]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        Business Galaxies Explored
                      </h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm">
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Marketing analytics
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Customer segmentation
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Predictive maintenance
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> HR analytics
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> SEO optimization
                        </li>
                        <li className="flex items-center gap-1 text-white/70">
                          <span className="text-[#4F9CF9]">•</span> Economic impact analysis
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-white/60 italic">
                &ldquo;Data science, like astronomy, reveals patterns invisible to the naked eye. <br />
                Both require curiosity, tools, and a willingness to explore the unknown.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#4F9CF9]/5"></div>
          <div className="container mx-auto max-w-4xl relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s Connect</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Ready to explore new possibilities? Whether you&apos;re interested in data visualization, 
                analytics solutions, or just want to discuss the latest trends in tech, I&apos;m always 
                excited to connect with fellow data enthusiasts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Methods */}
              <div className="bg-background-secondary/50 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Contact Methods</h3>
                <div className="space-y-6">
                  <a
                    href="mailto:jakakus10@gmail.com"
                    className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#4F9CF9]/20 flex items-center justify-center group-hover:bg-[#4F9CF9]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#4F9CF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm">jakakus10@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://si.linkedin.com/in/jaka-kus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#0077B5]/20 flex items-center justify-center group-hover:bg-[#0077B5]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">LinkedIn</div>
                      <div className="text-sm">Connect Professionally</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/Jakakus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">GitHub</div>
                      <div className="text-sm">View My Projects</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick Message */}
              <div className="bg-background-secondary/50 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Message</h3>
                <p className="text-white/70 mb-6">
                  Have a specific project in mind? Let&apos;s discuss how we can work together to bring your data to life.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:jakakus10@gmail.com?subject=Project%20Inquiry"
                    className="block w-full px-6 py-3 bg-[#4F9CF9]/20 hover:bg-[#4F9CF9]/30 text-white rounded-lg transition-all duration-300 text-center group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Start a Conversation</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
