import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
`;

// Styled Components
const AboutContainer = styled.section`
  padding: 4rem 0;
  position: relative;
  background: rgba(10, 10, 10, 1);
  
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out forwards;
  
  &.visible {
    animation-delay: 0.2s;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1E90FF;
  font-family: 'Poppins', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.3rem;
  color: #B0B0B0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContentText = styled.div`
  opacity: 0;
  animation: ${slideInLeft} 1s ease-out forwards;
  
  &.visible {
    animation-delay: 0.4s;
  }
  
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1E90FF;
    margin-bottom: 1.5rem;
    font-family: 'Poppins', sans-serif;
    
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    color: #D0D0D0;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
  
  .highlight {
    color: #1E90FF;
    font-weight: 600;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #D0D0D0;
    
    &::before {
      content: '✨';
      margin-right: 1rem;
      font-size: 1.2rem;
    }
  }
`;

const VisualSection = styled.div`
  position: relative;
  opacity: 0;
  animation: ${slideInRight} 1s ease-out forwards;
  
  &.visible {
    animation-delay: 0.6s;
  }
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const TechCard = styled.div`
  background: rgba(28, 32, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 55, 70, 0.8);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out forwards;
  
  &:nth-child(1) { animation-delay: 0.8s; }
  &:nth-child(2) { animation-delay: 1s; }
  &:nth-child(3) { animation-delay: 1.2s; }
  &:nth-child(4) { animation-delay: 1.4s; }
  &:nth-child(5) { animation-delay: 1.6s; }
  &:nth-child(6) { animation-delay: 1.8s; }
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
    background: rgba(35, 42, 52, 0.95);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    border-color: rgba(30, 144, 255, 0.3);
  }
  
  .tech-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    animation: ${float} 3s ease-in-out infinite;
  }
  
  .tech-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1E90FF;
    margin-bottom: 0.5rem;
  }
  
  .tech-description {
    font-size: 0.9rem;
    color: #B0B0B0;
    line-height: 1.4;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 4rem 0;
  padding: 3rem;
  background: rgba(28, 32, 40, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(45, 55, 70, 0.8);
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
`;

const StatCard = styled.div`
  text-align: center;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out forwards;
  
  &:nth-child(1) { animation-delay: 2s; }
  &:nth-child(2) { animation-delay: 2.2s; }
  &:nth-child(3) { animation-delay: 2.4s; }
  &:nth-child(4) { animation-delay: 2.6s; }
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    color: #1E90FF;
    font-family: 'Poppins', sans-serif;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 1rem;
    color: #B0B0B0;
    font-weight: 500;
  }
  
  .stat-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const ProcessSection = styled.div`
  margin: 4rem 0;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessCard = styled.div`
  background: rgba(28, 32, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 55, 70, 0.8);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out forwards;
  
  &:nth-child(1) { animation-delay: 2.8s; }
  &:nth-child(2) { animation-delay: 3s; }
  &:nth-child(3) { animation-delay: 3.2s; }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1E90FF, #4169E1);
  }
  
  &:hover {
    transform: translateY(-15px);
    background: rgba(35, 42, 52, 0.95);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    border-color: rgba(30, 144, 255, 0.3);
  }
  
  .step-number {
    position: absolute;
    top: -15px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #1E90FF, #4169E1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: #333;
    font-size: 1.2rem;
  }
  
  .process-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    animation: ${rotate} 10s linear infinite;
  }
  
  .process-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1E90FF;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
  }
  
  .process-description {
    color: #C0C0C0;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const techStack = [
    { icon: '⚛️', name: 'React', description: 'Modern UI Framework' },
    { icon: '🤖', name: 'AI/ML', description: 'Advanced Analytics' },
    { icon: '📱', name: 'WebRTC', description: 'Real-time Video' },
    { icon: '🔥', name: 'Node.js', description: 'Backend Server' },
    { icon: '⚡', name: 'Socket.IO', description: 'Live Communication' },
    { icon: '🎨', name: 'Styled', description: 'Beautiful Design' }
  ];

  const stats = [
    { icon: '🎯', number: '98%', label: 'Accuracy Rate' },
    { icon: '👥', number: '10K+', label: 'Active Users' },
    { icon: '📊', number: '50K+', label: 'Analyses Done' },
    { icon: '⚡', number: '<1s', label: 'Response Time' }
  ];

  const processSteps = [
    {
      icon: '📹',
      title: 'Capture',
      description: 'Use your webcam or upload a video of your exercise or posture'
    },
    {
      icon: '🔍',
      title: 'Analyze',
      description: 'Our AI processes your movements and identifies key posture points'
    },
    {
      icon: '📈',
      title: 'Improve',
      description: 'Get detailed feedback and recommendations to perfect your form'
    }
  ];

  return (
    <AboutContainer ref={sectionRef}>
      <Container>
        <SectionHeader className={isVisible ? 'visible' : ''}>
          <SectionTitle>Why Choose AlignIQ?</SectionTitle>
          <SectionSubtitle>
            Experience the future of posture analysis with cutting-edge AI technology 
            designed to help you achieve perfect form and better health.
          </SectionSubtitle>
        </SectionHeader>

        <ContentGrid>
          <ContentText className={isVisible ? 'visible' : ''}>
            <h3>Revolutionary Posture Technology</h3>
            <p>
              AlignIQ uses <span className="highlight">advanced computer vision</span> and 
              machine learning algorithms to provide real-time analysis of your posture 
              and movement patterns. Whether you're working out or working at your desk, 
              our AI gives you the insights you need.
            </p>
            <FeaturesList>
              <li>Real-time posture detection and correction</li>
              <li>Comprehensive analysis reports</li>
              <li>Personalized improvement recommendations</li>
              <li>Multi-exercise support (squats, desk posture, more)</li>
              <li>User-friendly interface with instant feedback</li>
            </FeaturesList>
          </ContentText>

          <VisualSection className={isVisible ? 'visible' : ''}>
            <TechStack>
              {techStack.map((tech, index) => (
                <TechCard key={index}>
                  <div className="tech-icon">{tech.icon}</div>
                  <div className="tech-name">{tech.name}</div>
                  <div className="tech-description">{tech.description}</div>
                </TechCard>
              ))}
            </TechStack>
          </VisualSection>
        </ContentGrid>

        <StatsSection>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <span className="stat-number">{stat.number}</span>
              <div className="stat-label">{stat.label}</div>
            </StatCard>
          ))}
        </StatsSection>

        <ProcessSection>
          <SectionHeader>
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle>
              Get started with AlignIQ in three simple steps and transform your posture today
            </SectionSubtitle>
          </SectionHeader>

          <ProcessGrid>
            {processSteps.map((step, index) => (
              <ProcessCard key={index}>
                <div className="step-number">{index + 1}</div>
                <div className="process-icon">{step.icon}</div>
                <div className="process-title">{step.title}</div>
                <div className="process-description">{step.description}</div>
              </ProcessCard>
            ))}
          </ProcessGrid>
        </ProcessSection>
      </Container>
    </AboutContainer>
  );
};

export default AboutSection;
