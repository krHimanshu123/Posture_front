import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import config from '../config/config';

// Keyframe animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const borderGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const progressFill = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress); }
`;

// Styled Components
const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  position: relative;
`;

const DropzoneContainer = styled.div`
  position: relative;
  border: 3px dashed ${props => props.isDragActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 20px;
  padding: 4rem 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.isDragActive 
    ? 'rgba(40, 40, 40, 0.8)'
    : 'rgba(30, 30, 30, 0.8)'
  };
  backdrop-filter: blur(20px);
  min-width: 450px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isDragActive 
      ? 'rgba(50, 50, 50, 0.6)'
      : 'none'
    };
    pointer-events: none;
  }
  
  &:hover {
    border-color: #ffffff;
    background: rgba(40, 40, 40, 0.8);
    transform: translateY(-5px) scale(1.02);
  }
  
  &.drag-over {
    transform: scale(1.05);
    border-color: #ffffff;
    background: rgba(50, 50, 50, 0.8);
  }
  
  @media (max-width: 768px) {
    min-width: 320px;
    padding: 3rem 2rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: ${props => props.isDragActive ? 1 : 0.8};
  color: #ffffff;
  transition: all 0.3s ease;
`;

const UploadText = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
`;

const UploadSubtext = styled.div`
  font-size: 1rem;
  opacity: ${props => props.isDragActive ? 1 : 0.8};
  color: #ffffff;
  line-height: 1.5;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
`;

const SelectedFile = styled.div`
  background: rgba(35, 42, 52, 0.95);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  border: 1px solid rgba(45, 55, 70, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(42, 48, 58, 0.95);
    border-color: rgba(30, 144, 255, 0.3);
  }
  
  .file-info {
    flex: 1;
    text-align: left;
  }
  
  .file-name {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  .file-size {
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

const AnalyzeButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  background: rgba(30, 30, 30, 0.9);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(80, 80, 80, 0.4);
  
  &:hover {
    background: rgba(40, 40, 40, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  }
  
  &:disabled {
    background: rgba(60, 60, 60, 0.6);
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  color: #ffffff;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(80, 80, 80, 0.4);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
  
  .progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    transition: width 0.3s ease;
    width: ${props => props.progress}%;
  }
`;

const ProgressText = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ffffff;
`;

// Enhanced file preview component
const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(28, 32, 40, 0.95);
  border-radius: 15px;
  margin-top: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 55, 70, 0.8);
  animation: ${slideInUp} 0.5s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(35, 42, 52, 0.95);
    border-color: rgba(30, 144, 255, 0.3);
    box-shadow: 0 10px 30px rgba(30, 144, 255, 0.1);
  }
`;

const FileIcon = styled.div`
  font-size: 2.5rem;
  color: #1E90FF;
  filter: drop-shadow(0 0 10px rgba(30, 144, 255, 0.3));
`;

const FileDetails = styled.div`
  flex: 1;
  
  .file-name {
    font-weight: 600;
    color: #1E90FF;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    text-shadow: 0 0 10px rgba(30, 144, 255, 0.3);
  }
  
  .file-size {
    font-size: 0.95rem;
    opacity: 0.8;
    color: #D0D0D0;
  }
  
  .file-type {
    font-size: 0.85rem;
    opacity: 0.6;
    color: #A0A0A0;
    margin-top: 0.25rem;
  }
`;

// Enhanced progress components
const EnhancedProgressContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 2rem 0;
  position: relative;
`;

const ProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  background: rgba(28, 32, 40, 0.95);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(45, 55, 70, 0.8);
`;

const EnhancedProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1E90FF, #4169E1, #FF6B6B);
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${props => props.progress}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #D0D0D0;
`;

const ProgressPercentage = styled.span`
  font-weight: 700;
  color: #1E90FF;
  text-shadow: 0 0 10px rgba(30, 144, 255, 0.3);
  font-size: 1.1rem;
`;

const StatusMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 15px;
  background: ${props => {
    if (props.type === 'success') return 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))';
    if (props.type === 'error') return 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))';
    if (props.type === 'processing') return 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => {
    if (props.type === 'success') return 'rgba(76, 175, 80, 0.3)';
    if (props.type === 'error') return 'rgba(244, 67, 54, 0.3)';
    if (props.type === 'processing') return 'rgba(255, 215, 0, 0.3)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  animation: ${slideInUp} 0.5s ease-out;
  transition: all 0.3s ease;
  
  .status-icon {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
    display: block;
    animation: ${props => props.type === 'processing' ? pulse : 'none'} 1.5s ease-in-out infinite;
  }
  
  .status-text {
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.6;
    color: ${props => {
      if (props.type === 'success') return '#4CAF50';
      if (props.type === 'error') return '#F44336';
      if (props.type === 'processing') return '#1E90FF';
      return '#FFFFFF';
    }};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
  
  button {
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease;
    }
    
    &:hover::before {
      width: 300px;
      height: 300px;
    }
    
    &.primary {
      background: linear-gradient(135deg, #1E90FF, #4169E1);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(30, 144, 255, 0.3);
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(30, 144, 255, 0.4);
      }
      
      &:active {
        transform: translateY(-1px);
      }
    }
    
    &.secondary {
      background: rgba(35, 42, 52, 0.95);
      color: #FFFFFF;
      border: 1px solid rgba(45, 55, 70, 0.8);
      
      &:hover {
        background: rgba(42, 48, 58, 0.95);
        border-color: rgba(30, 144, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(30, 144, 255, 0.1);
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

const ResultVideo = styled.video`
  max-width: 100%;
  border-radius: 20px;
  margin-top: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: ${slideInUp} 0.6s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.5);
  }
`;

const VideoUpload = ({ analysisType, onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setIsDragOver(false);
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadProgress(0);
      setUploadStatus('');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': config.SUPPORTED_FORMATS
    },
    maxFiles: 1,
    maxSize: config.MAX_FILE_SIZE
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file) => {
    const extension = file.name.split('.').pop().toUpperCase();
    return `${extension} Video`;
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
    setAnalysisResult(null);
  };

  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing video analysis...');

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('analysisType', analysisType);    try {
      const response = await axios.post(`${config.API_URL}/api/upload-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
          
          if (progress === 100) {
            setUploadStatus('Processing video...');
          }
        },
      });

      setUploadStatus('Analysis complete!');
      onAnalysisComplete(response.data);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadStatus('Error analyzing video. Please try again.');
      
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('');
  };

  return (
    <UploadContainer className="fade-in">
      {!selectedFile ? (
        <DropzoneContainer 
          {...getRootProps()} 
          isDragActive={isDragActive || isDragOver}
          className={isDragActive ? 'drag-over' : ''}
        >
          <input {...getInputProps()} />
          <UploadIcon isDragActive={isDragActive}>
            {isDragActive ? '📥' : '🎥'}
          </UploadIcon>
          <UploadText isDragActive={isDragActive}>
            {isDragActive ? 'Drop your video here!' : 'Upload Video for Analysis'}
          </UploadText>
          <UploadSubtext isDragActive={isDragActive}>
            {isDragActive ? 
              'Release to upload your video file' :
              'Drag and drop a video file here, or click to browse'
            }
            <br />
            <strong>Supported:</strong> MP4, AVI, MOV, WMV, MKV, WebM (Max: 100MB)
          </UploadSubtext>
        </DropzoneContainer>
      ) : (
        <>
          <FilePreview>
            <FileIcon>🎬</FileIcon>
            <FileDetails>
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              <div className="file-type">{getFileType(selectedFile)}</div>
            </FileDetails>
            <button
              onClick={resetUpload}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1.2rem',
                background: 'none',
                border: '1px solid rgba(255, 107, 107, 0.5)',
                color: '#ff6b6b',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ❌
            </button>
          </FilePreview>

          <ActionButtons>
            <button
              className="primary"
              onClick={analyzeVideo}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span style={{animation: `${pulse} 1s infinite`}}>🔄</span>
                  Processing...
                </>
              ) : (
                <>
                  🔍 Analyze {analysisType === 'squat' ? 'Squat Form' : 'Desk Posture'}
                </>
              )}
            </button>
          </ActionButtons>
        </>
      )}

      {isUploading && (
        <EnhancedProgressContainer>
          <ProgressWrapper>
            <EnhancedProgressBar progress={uploadProgress} />
          </ProgressWrapper>
          <ProgressInfo>
            <span>{uploadStatus}</span>
            <ProgressPercentage>{uploadProgress}%</ProgressPercentage>
          </ProgressInfo>
        </EnhancedProgressContainer>
      )}

      {uploadStatus && !isUploading && (
        <StatusMessage type={uploadStatus.includes('Error') ? 'error' : uploadStatus.includes('Complete') ? 'success' : 'processing'}>
          <span className="status-icon">
            {uploadStatus.includes('Error') ? '❌' : 
             uploadStatus.includes('Complete') ? '✅' : '⏳'}
          </span>
          <div className="status-text">{uploadStatus}</div>
        </StatusMessage>
      )}

      {analysisResult && (
        <ResultVideo controls>
          <source src={analysisResult} type="video/mp4" />
          Your browser does not support the video tag.
        </ResultVideo>
      )}
    </UploadContainer>
  );
};

export default VideoUpload;
