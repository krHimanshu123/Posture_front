import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Enhanced keyframe animations
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

const scoreAnimation = keyframes`
  from {
    stroke-dashoffset: 440;
  }
  to {
    stroke-dashoffset: calc(440 - (440 * var(--progress) / 100));
  }
`;

// Removed unused animation keyframes for cleaner interface

const chartBarGrow = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--height);
  }
`;

const AnalysisContainer = styled.div`
  background: rgba(28, 32, 40, 0.95);
  border-radius: 25px;
  padding: 3rem;
  margin: 3rem 0;
  backdrop-filter: blur(20px);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(45, 55, 70, 0.8);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  color: #ffffff;
`;

const AnalysisHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #1E90FF;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
  }
  
  .analysis-type {
    background: rgba(255, 215, 0, 0.15);
    padding: 1rem 2rem;
    border-radius: 25px;
    display: inline-block;
    font-weight: 600;
    font-size: 1.1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    color: #ffffff;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    }
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 0;
  position: relative;
`;

const ScoreCircle = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircularProgress = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  position: absolute;
  
  circle {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
  }
  
  .background {
    stroke: rgba(255, 255, 255, 0.1);
  }
  
  .progress {
    stroke: ${props => {
      const score = props.score || 0;
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#1E90FF';
      return '#FF6B6B';
    }};
    stroke-dasharray: 440;
    stroke-dashoffset: calc(440 - (440 * ${props => props.score || 0} / 100));
    transition: stroke-dashoffset 2s ease-out, stroke 0.5s ease;
  }
`;

const ScoreText = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  
  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => {
      const score = props.score || 0;
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#1E90FF';
      return '#FF6B6B';
    }};
  }
  
  .score-label {
    font-size: 1rem;
    opacity: 0.8;
    margin-top: 0.5rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const SummaryCard = styled.div`
  background: rgba(28, 32, 40, 0.95);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 55, 70, 0.8);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  color: #ffffff;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(35, 42, 52, 0.95);
    border-color: rgba(30, 144, 255, 0.3);
    transform: translateY(-5px);
  }
  
  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-family: 'Poppins', sans-serif;
  }
  
  .card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1E90FF;
    font-family: 'Poppins', sans-serif;
  }
`;

const FeedbackSection = styled.div`
  margin: 3rem 0;
  
  h3 {
    margin-bottom: 2rem;
    color: #1E90FF;
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    font-family: 'Poppins', sans-serif;
  }
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeedbackItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(28, 32, 40, 0.95);
  border-radius: 15px;
  border-left: 4px solid ${props => props.isGood ? '#4CAF50' : '#FF6B6B'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isGood ? 
    'rgba(76, 175, 80, 0.3)' : 
    'rgba(255, 107, 107, 0.3)'
  };
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  color: #ffffff;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(35, 42, 52, 0.95);
    transform: translateX(10px);
    border-color: ${props => props.isGood ? 
      'rgba(76, 175, 80, 0.5)' : 
      'rgba(255, 107, 107, 0.5)'
    };
  }
  
  .feedback-icon {
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }
  
  .feedback-content {
    flex: 1;
    
    .feedback-type {
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
      color: ${props => props.isGood ? '#4CAF50' : '#ff6b6b'};
    }
    
    .feedback-text {
      opacity: 0.9;
      line-height: 1.4;
    }
  }
`;

const VideoSummary = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  
  h4 {
    margin-bottom: 1rem;
    color: #ffffff;
  }
  
  .summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .stat-item {
    text-align: center;
    color: #ffffff;
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.25rem;
      color: #ffffff;
    }
    
    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #ffffff;
    }
  }
`;

const IssueTypesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const IssueTag = styled.span`
  background: rgba(60, 60, 60, 0.8);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  border: 1px solid rgba(80, 80, 80, 0.6);
`;

const PostureAnalysis = ({ results }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const containerRef = useRef(null);

  const isVideoAnalysis = results?.results && results.results.summary;
  const analysisData = isVideoAnalysis ? results.results : results;
  
  useEffect(() => {
    if (!results) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate score counter
          const targetScore = analysisData?.overallScore || analysisData?.summary?.overallPostureScore || 0;
          let currentScore = 0;
          const increment = targetScore / 50; // 50 steps for smooth animation
          const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
              setAnimatedScore(targetScore);
              clearInterval(timer);
            } else {
              setAnimatedScore(Math.floor(currentScore));
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [results, analysisData]);

  // Early return after all hooks
  if (!results) return null;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#1E90FF';
    return '#FF6B6B';
  };

  const getScoreRating = (score) => {
    if (score >= 80) return 'Excellent Posture';
    if (score >= 60) return 'Good Posture';
    if (score >= 40) return 'Fair Posture';
    return 'Needs Improvement';
  };

  const formatIssueType = (issueType) => {
    return issueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isVideoAnalysis) {
    const { summary, frames } = analysisData;
    
    return (
      <AnalysisContainer className="fade-in">
        <AnalysisHeader>
          <h2>📊 Analysis Results</h2>
          <div className="analysis-type">
            {results.analysisType === 'squat' ? '🏋️ Squat Analysis' : '💺 Desk Posture Analysis'}
          </div>
        </AnalysisHeader>

        <ScoreContainer>
          <ScoreCircle score={summary.averageScore}>
            <div className="score-text">{summary.averageScore}%</div>
          </ScoreCircle>
        </ScoreContainer>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: getScoreColor(summary.averageScore) }}>
            {getScoreRating(summary.averageScore)}
          </h3>
          <p style={{ opacity: 0.8 }}>Overall Rating: {summary.overallRating}</p>
        </div>

        <VideoSummary>
          <h4>📹 Video Analysis Summary</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-label">Frames Analyzed</div>
              <div className="stat-value">{summary.frameCount || frames.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Issues</div>
              <div className="stat-value">{summary.totalIssues}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Avg Score</div>
              <div className="stat-value">{summary.averageScore}%</div>
            </div>
          </div>
          
          {summary.issueTypes && summary.issueTypes.length > 0 && (
            <>
              <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Common Issues Detected:
              </div>
              <IssueTypesList>
                {summary.issueTypes.map((issueType, index) => (
                  <IssueTag key={index}>
                    {formatIssueType(issueType)}
                  </IssueTag>
                ))}
              </IssueTypesList>
            </>
          )}
        </VideoSummary>

        <SummaryGrid>
          <SummaryCard>
            <div className="card-icon">🎯</div>
            <div className="card-title">Accuracy</div>
            <div className="card-value">{summary.averageScore}%</div>
          </SummaryCard>
          <SummaryCard>
            <div className="card-icon">⚠️</div>
            <div className="card-title">Issues Found</div>
            <div className="card-value">{summary.totalIssues}</div>
          </SummaryCard>
          <SummaryCard>
            <div className="card-icon">⭐</div>
            <div className="card-title">Rating</div>
            <div className="card-value">{summary.overallRating}</div>
          </SummaryCard>
        </SummaryGrid>
      </AnalysisContainer>
    );
  }

  // Real-time analysis display
  const analysis = analysisData.analysis || analysisData;
  
  return (
    <AnalysisContainer className="fade-in">
      <AnalysisHeader>
        <h2>🎯 Real-time Analysis</h2>
        <div className="analysis-type">
          {analysis.postureType === 'squat' ? '🏋️ Squat Analysis' : '💺 Desk Posture Analysis'}
        </div>
      </AnalysisHeader>

      <ScoreContainer>
        <ScoreCircle score={analysis.score}>
          <div className="score-text">{analysis.score}%</div>
        </ScoreCircle>
      </ScoreContainer>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: getScoreColor(analysis.score) }}>
          {getScoreRating(analysis.score)}
        </h3>
      </div>

      <FeedbackSection>
        <h3>💡 Feedback & Recommendations</h3>
        <FeedbackList>
          {analysis.issues && analysis.issues.length > 0 ? (
            analysis.feedback.map((feedback, index) => (
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
                <div className="feedback-text">
                  Your posture looks great! Keep maintaining this good form.
                </div>
              </div>
            </FeedbackItem>
          )}
        </FeedbackList>
      </FeedbackSection>
    </AnalysisContainer>
  );
};

export default PostureAnalysis;
