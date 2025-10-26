import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animations

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
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

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: #1E90FF; }
`;

// Styled Components
const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  overflow: hidden;
  background: rgba(10, 10, 10, 1);
  
  @media (max-width: 768px) {
    min-height: 80vh;
    padding: 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1000px;
  z-index: 2;
  position: relative;
`;

const MainTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #ffffff;
  animation: ${slideInUp} 1s ease-out;
  font-family: 'Poppins', sans-serif;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SubTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  color: #f9f8f8ff;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${slideInUp} 1s ease-out 0.5s forwards;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const TypewriterText = styled.p`
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 3rem;
  min-height: 2rem;
  font-family: 'Inter', sans-serif;
  
  span {
    display: inline-block;
    overflow: hidden;
    border-right: 2px solid #1E90FF;
    white-space: nowrap;
    animation: ${typewriter} 2s steps(40, end) 2s forwards, ${blink} 0.75s step-end infinite 2s;
    width: 0;
  }
  
  &.completed span {
    border-right: none;
    width: auto;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${slideInUp} 1s ease-out 1.5s forwards;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PrimaryButton = styled.button`
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(30, 30, 30, 0.9);
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: transparent;
  color: #fcf8f8ff;
  border: 2px solid rgba(22, 22, 22, 1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(7, 7, 7, 0.95);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  opacity: 0;
  animation: ${slideInUp} 1s ease-out 2s forwards;
`;

const FeatureCard = styled.div`
  background: rgba(10, 9, 9, 1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(11, 10, 10, 1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(30, 144, 255, 0.5);
    box-shadow: 0 5px 15px rgba(6, 6, 6, 1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  &:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1E90FF;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
`;

const FeatureDescription = styled.p`
  color: #ffffff;
  line-height: 1.6;
  font-size: 1rem;
`;



const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  opacity: 0;
  animation: ${slideInUp} 1s ease-out 2.8s forwards;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    color: #1E90FF;
    font-family: 'Poppins', sans-serif;
    display: block;
  }
  
  .stat-label {
    font-size: 1rem;
    color: #ffffff;
    margin-top: 0.5rem;
  }
`;

const AnimatedHero = ({ onGetStarted }) => {
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  
  const texts = [
    "Perfect your squat form with AI precision",
    "Improve your desk posture for better health",
    "Get real-time feedback on your movements",
    "Transform your fitness journey today"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypewriterComplete(true);
    }, 4000);

    const textTimer = setInterval(() => {
      setCurrentText(prev => (prev + 1) % texts.length);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(textTimer);
    };
  }, [texts.length]);

  return (
    <HeroContainer>
      <HeroContent>
        <MainTitle>
          Perfect Your Posture
        </MainTitle>
        
        <SubTitle>
          AI-Powered Analysis for Better Health & Performance
        </SubTitle>
        
        <TypewriterText className={typewriterComplete ? 'completed' : ''}>
          <span>{texts[currentText]}</span>
        </TypewriterText>
        
        <CTAContainer>
          <PrimaryButton onClick={onGetStarted}>
            🚀 Start Analysis
          </PrimaryButton>
          <SecondaryButton onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
            📖 Learn More
          </SecondaryButton>
        </CTAContainer>
        
        <StatsContainer>
          <StatItem>
            <span className="stat-number">98%</span>
            <div className="stat-label">Accuracy Rate</div>
          </StatItem>
          <StatItem>
            <span className="stat-number">10K+</span>
            <div className="stat-label">Users Helped</div>
          </StatItem>
          <StatItem>
            <span className="stat-number">24/7</span>
            <div className="stat-label">Available</div>
          </StatItem>
        </StatsContainer>
        
        <FeatureCards>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Real-Time Analysis</FeatureTitle>
            <FeatureDescription>
              Get instant feedback on your posture with our advanced AI algorithms that analyze your movements in real-time.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Detailed Reports</FeatureTitle>
            <FeatureDescription>
              Receive comprehensive analysis reports with personalized recommendations to improve your posture and health.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💪</FeatureIcon>
            <FeatureTitle>Multiple Exercises</FeatureTitle>
            <FeatureDescription>
              Analyze various exercises and daily activities including squats, desk posture, and more coming soon.
            </FeatureDescription>
          </FeatureCard>
        </FeatureCards>
      </HeroContent>
    </HeroContainer>
  );
};

export default AnimatedHero;
