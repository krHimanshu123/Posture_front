import React, { useState, useEffect } from 'react';
import WebcamCapture from './components/WebcamCapture';
import VideoUpload from './components/VideoUpload';
import PostureAnalysis from './components/PostureAnalysis';
import Header from './components/Header';
import AnimatedHero from './components/AnimatedHero';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import './App.css';

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="floating-particles">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="particle"></div>
      ))}
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🏃‍♂️</div>
        <div className="text-2xl font-bold text-white mb-4">AlignIQ Loading...</div>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

function App() {
  const [mode, setMode] = useState('webcam'); // 'webcam' or 'upload'
  const [analysisType, setAnalysisType] = useState('squat'); // 'squat' or 'desk'
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('.analysis-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="App">
      <LoadingScreen isLoading={isLoading} />
      
      {/* Animated Background */}
      <div className="app-background"></div>
      <FloatingParticles />
      
      {/* Navigation Header */}
      <Header onNavigate={scrollToSection} currentSection={currentSection} />
      
      <main className="main-content">
        {/* Hero Section */}
        <section id="hero" className="content-section">
          <AnimatedHero onGetStarted={() => scrollToSection('analysis')} />
        </section>

        {/* About Section */}
        <section id="about" className="content-section">
          <AboutSection />
        </section>

        {/* Analysis Section */}
        <section id="analysis" className="content-section analysis-section-dark">
          <div className="text-center mb-8 analysis-header-dark">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Your Analysis
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Choose your analysis type and method to get started with professional posture assessment
            </p>
          </div>

          {/* Analysis Type Selector */}
          <div className="analysis-type-selector">
            <button 
              className={`type-button ${analysisType === 'squat' ? 'active' : ''}`}
              onClick={() => setAnalysisType('squat')}
            >
              <span className="mr-2">🏋️</span>
              Squat Analysis
            </button>
            <button 
              className={`type-button ${analysisType === 'desk' ? 'active' : ''}`}
              onClick={() => setAnalysisType('desk')}
            >
              <span className="mr-2">💺</span>
              Desk Posture
            </button>
          </div>

          {/* Mode Selector */}
          <div className="mode-selector">
            <button 
              className={`mode-button ${mode === 'webcam' ? 'active' : ''}`}
              onClick={() => setMode('webcam')}
            >
              <span className="mr-2">📹</span>
              Live Webcam Analysis
            </button>
            <button 
              className={`mode-button ${mode === 'upload' ? 'active' : ''}`}
              onClick={() => setMode('upload')}
            >
              <span className="mr-2">📁</span>
              Upload Video
            </button>
          </div>

          {/* Analysis Component */}
          <div className="mt-8">
            {mode === 'webcam' ? (
              <WebcamCapture 
                analysisType={analysisType}
                onAnalysisComplete={handleAnalysisComplete}
              />
            ) : (
              <VideoUpload 
                analysisType={analysisType}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
          </div>

          {/* Analysis Results */}
          {analysisResults && (
            <div className="analysis-results mt-8">
              <PostureAnalysis results={analysisResults} />
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="content-section">
          <TestimonialsSection />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="content-section">
          <FAQSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="content-section">
          <ContactSection />
        </section>
      </main>

      {/* Scroll to Top Button */}
      <button
        className="fixed bottom-8 right-8 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 z-10"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>


    </div>
  );
}

export default App;
