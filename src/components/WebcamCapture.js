import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import config from '../config/config';

// Keyframe animations
// Removed unused animation keyframes for cleaner interface

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Styled Components
const WebcamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  position: relative;
`;

const VideoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isAnalyzing'].includes(prop),
})`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(20px);
  padding: 4px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: rgba(40, 40, 40, 0.6);
    z-index: -1;
  }
  
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  
  transition: all 0.3s ease;
`;

const WebcamElement = styled(Webcam)`
  width: 640px;
  height: 480px;
  object-fit: cover;
  border-radius: 16px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 480px;
    height: auto;
  }
`;

const OverlayIndicators = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
  pointer-events: none;
`;

const LiveIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isLive'].includes(prop),
})`
  background: ${props => props.isLive ? '#FF4444' : 'rgba(0, 0, 0, 0.6)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  
  .live-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const QualityIndicator = styled.div`
  background: rgba(30, 30, 30, 0.8);
  color: ${props => {
    if (props.quality === 'excellent') return '#4CAF50';
    if (props.quality === 'good') return '#1E90FF';
    return '#FF6B6B';
  }};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ControlButton = styled.button`
  position: relative;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 50px;
  background: ${props => {
    if (props.variant === 'start') return 'rgba(30, 30, 30, 0.9)';
    if (props.variant === 'stop') return 'rgba(40, 40, 40, 0.9)';
    return 'rgba(30, 30, 30, 0.8)';
  }};
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(80, 80, 80, 0.4);
  overflow: hidden;
  

  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ${ripple} 0.6s linear;
    pointer-events: none;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(28, 32, 40, 0.95);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  border: 1px solid rgba(45, 55, 70, 0.8);
  min-width: 350px;
  position: relative;
  overflow: hidden;
  color: #ffffff;
  transition: all 0.3s ease;
  

  
  @media (max-width: 768px) {
    min-width: 300px;
    padding: 1.5rem;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  
  .status-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => {
      if (props.status === 'analyzing') return '#1E90FF';
      if (props.status === 'connected') return '#4CAF50';
      return '#f44336';
    }};

  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 15px;
  border: 1px solid rgba(80, 80, 80, 0.4);
  
  .score-label {
    font-size: 1rem;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  
  .score-value {
    font-size: 2.5rem;
    font-weight: 900;
    font-family: 'Poppins', sans-serif;
    color: ${props => {
      const score = props.score || 0;
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#1E90FF';
      return '#FF6B6B';
    }};
  }
`;

const FeedbackContainer = styled.div`
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
  text-align: left;
  max-width: 600px;
  border: 1px solid rgba(80, 80, 80, 0.4);
  color: #ffffff;
  
  h4 {
    font-size: 1.2rem;
    color: #ffffff;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FeedbackItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(80, 80, 80, 0.4);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #ffffff;
  
  &:last-child {
    border-bottom: none;
  }
  
  .feedback-icon {
    font-size: 1.2rem;
    margin-top: 0.1rem;
  }
  
  .feedback-content {
    flex: 1;
  }
  
  .feedback-type {
    font-weight: bold;
    color: ${props => props.isGood ? '#4CAF50' : '#FF6B6B'};
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }
  
  .feedback-text {
    color: #D0D0D0;
    line-height: 1.5;
    font-size: 0.95rem;
  }
`;

const AnalysisStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  
  .stat-item {
    text-align: center;
    
    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1E90FF;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #B0B0B0;
      margin-top: 0.25rem;
    }
  }
`;

const WebcamCapture = ({ analysisType, onAnalysisComplete }) => {
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [analysisInterval, setAnalysisInterval] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('good');
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(config.SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketRef.current.on('analysis-result', (data) => {
      if (data.result && data.result.analysis) {
        const analysis = data.result.analysis;
        setCurrentFeedback(analysis);
        setCurrentScore(analysis.score || 0);
        
        // Update analysis statistics
        setAnalysisCount(prev => {
          const newCount = prev + 1;
          const newAvg = Math.round(((avgScore * prev) + (analysis.score || 0)) / newCount);
          setAvgScore(newAvg);
          return newCount;
        });
        
        onAnalysisComplete(data.result);
      }
    });

    socketRef.current.on('analysis-error', (error) => {
      console.error('Analysis error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [onAnalysisComplete]);

  const captureFrame = () => {
    if (webcamRef.current && isConnected) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.emit('analyze-frame', {
          imageData: imageSrc,
          analysisType: analysisType
        });
      }
    }
  };

  const addRippleEffect = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const startAnalysis = (event) => {
    if (!isConnected) {
      alert('Not connected to server. Please wait and try again.');
      return;
    }
    
    addRippleEffect(event);
    setIsAnalyzing(true);
    setCurrentFeedback(null);
    setAnalysisCount(0);
    setAvgScore(0);
    
    // Capture frame immediately
    captureFrame();
    // Set up interval for continuous analysis
    const interval = setInterval(captureFrame, config.ANALYSIS_INTERVAL);
    setAnalysisInterval(interval);
  };

  const stopAnalysis = (event) => {
    addRippleEffect(event);
    setIsAnalyzing(false);
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
  };

  const getStatusText = () => {
    if (!isConnected) return 'Connecting to server...';
    if (isAnalyzing) return 'Analyzing posture...';
    return 'Ready to analyze';
  };

  const getStatusType = () => {
    if (!isConnected) return 'disconnected';
    if (isAnalyzing) return 'analyzing';
    return 'connected';
  };

  return (
    <WebcamContainer className="fade-in">
      <VideoContainer isAnalyzing={isAnalyzing}>
        <OverlayIndicators>
          <LiveIndicator isLive={isAnalyzing}>
            <div className="live-dot"></div>
            {isAnalyzing ? 'LIVE' : 'STANDBY'}
          </LiveIndicator>
          <QualityIndicator quality={connectionQuality}>
            {connectionQuality.toUpperCase()}
          </QualityIndicator>
        </OverlayIndicators>
        
        <WebcamElement
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
          mirrored={true}
        />
      </VideoContainer>
      
      <ControlsContainer>
        <ControlButton
          variant="start"
          onClick={startAnalysis}
          disabled={!isConnected || isAnalyzing}
        >
          {isAnalyzing ? '⏸️ Analyzing...' : '🚀 Start Analysis'}
        </ControlButton>
        
        <ControlButton
          variant="stop"
          onClick={stopAnalysis}
          disabled={!isAnalyzing}
        >
          ⏹️ Stop Analysis
        </ControlButton>
      </ControlsContainer>

      <StatusContainer>
        <StatusIndicator status={getStatusType()}>
          <div className="status-dot"></div>
          {getStatusText()}
        </StatusIndicator>
        
        {currentFeedback && (
          <>
            <ScoreDisplay score={currentScore}>
              <div className="score-label">Current Posture Score</div>
              <div className="score-value">{currentScore}%</div>
            </ScoreDisplay>
            
            <AnalysisStats>
              <div className="stat-item">
                <div className="stat-value">{analysisCount}</div>
                <div className="stat-label">Frames</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{avgScore}%</div>
                <div className="stat-label">Avg Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{currentFeedback.issues?.length || 0}</div>
                <div className="stat-label">Issues</div>
              </div>
            </AnalysisStats>
            
            <FeedbackContainer>
              <h4>
                <span>🎯</span>
                Real-time Feedback
              </h4>
              
              {currentFeedback.feedback && currentFeedback.feedback.length > 0 ? (
                currentFeedback.feedback.map((feedback, index) => (
                  <FeedbackItem key={index} isGood={false}>
                    <div className="feedback-icon">⚠️</div>
                    <div className="feedback-content">
                      <div className="feedback-type">Issue Detected</div>
                      <div className="feedback-text">{feedback}</div>
                    </div>
                  </FeedbackItem>
                ))
              ) : (
                <FeedbackItem isGood={true}>
                  <div className="feedback-icon">✅</div>
                  <div className="feedback-content">
                    <div className="feedback-type">Excellent Posture!</div>
                    <div className="feedback-text">Your posture looks great! Keep it up!</div>
                  </div>
                </FeedbackItem>
              )}
            </FeedbackContainer>
          </>
        )}
      </StatusContainer>
    </WebcamContainer>
  );
};

export default WebcamCapture;
