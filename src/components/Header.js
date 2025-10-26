import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const typeWriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: #1E90FF; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(5deg); }
  66% { transform: translateY(5px) rotate(-3deg); }
`;

// Removed glow animation for cleaner look

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 1);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  animation: ${float} 4s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: #1E90FF;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  color: #ffffff;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
  
  span {
    display: inline-block;
    overflow: hidden;
    border-right: 2px solid #1E90FF;
    white-space: nowrap;
    animation: ${typeWriter} 3s steps(40, end), ${blink} 0.75s step-end infinite;
    animation-delay: 1s;
    width: 0;
  }
  
  &.typed span {
    width: 100%;
    border-right: none;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavItem = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  background: none;
  border: none;
  color: ${props => props.active ? '#1E90FF' : '#ffffff'};
  font-family: 'Poppins', sans-serif;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    color: #1E90FF;
    background: rgba(30, 144, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(30, 144, 255, 0.15);
    box-shadow: 0 0 15px rgba(30, 144, 255, 0.2);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4CAF50;
  
  .status-dot {
    width: 8px;
    height: 8px;
    background: #4CAF50;
    border-radius: 50%;
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const FeatureIcons = styled.div`
  position: absolute;
  top: 50%;
  right: -100px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0.3;
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const FloatingIcon = styled.div`
  font-size: 1.5rem;
  animation: ${float} ${props => props.delay || 3}s ease-in-out infinite;
  animation-delay: ${props => props.offset || 0}s;
`;

const Header = ({ onNavigate, currentSection }) => {
  const [isTyped, setIsTyped] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyped(true);
    }, 4000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <HeaderContainer>
      <NavContainer>
        <LogoSection>
          <LogoIcon onClick={() => onNavigate('hero')}>🏃‍♂️</LogoIcon>
          <LogoText>
            <Title onClick={() => onNavigate('hero')}>AlignIQ</Title>
            <Subtitle className={isTyped ? 'typed' : ''}>
              <span>AI-Powered Posture Analysis for Better Health</span>
            </Subtitle>
          </LogoText>
        </LogoSection>
        
        <Navigation>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              active={currentSection === item.id}
              className={currentSection === item.id ? 'active' : ''}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </NavItem>
          ))}
          
          <StatusIndicator>
            <div className="status-dot"></div>
            {isOnline ? 'Online' : 'Offline'}
          </StatusIndicator>
        </Navigation>
      </NavContainer>
      
      <FeatureIcons>
        <FloatingIcon delay="2" offset="0">💪</FloatingIcon>
        <FloatingIcon delay="2.5" offset="0.5">🎯</FloatingIcon>
        <FloatingIcon delay="3" offset="1">📊</FloatingIcon>
        <FloatingIcon delay="2.2" offset="1.5">⚡</FloatingIcon>
      </FeatureIcons>
    </HeaderContainer>
  );
};

export default Header;
