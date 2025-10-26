import React, { useState } from 'react';
import styled from 'styled-components';

const FAQContainer = styled.section`
  padding: 4rem 2rem;
  background: rgba(10, 10, 10, 1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  margin: 2rem 0;
  border: 1px solid rgba(45, 55, 70, 0.8);
`;

const FAQTitle = styled.h2`
  color: #1E90FF;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
`;

const FAQItem = styled.div`
  background: rgba(35, 42, 52, 0.95);
  border-radius: 15px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(45, 55, 70, 0.8);
  
  &:hover {
    background: rgba(42, 48, 58, 0.95);
    border-color: rgba(30, 144, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  color: #FFFFFF;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    color: #1E90FF;
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.isOpen ? '0 1.5rem 1.5rem' : '0'};
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? 1 : 0};
  
  p {
    color: #E0E0E0;
    line-height: 1.6;
    margin: 0;
  }
`;

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "How accurate is the posture analysis?",
      answer: "Our AI-powered system uses advanced computer vision algorithms to provide highly accurate posture analysis with over 95% precision in detecting common posture issues."
    },
    {
      question: "Do I need special equipment?",
      answer: "No special equipment needed! Just a standard webcam or smartphone camera. Our system works with any modern device with camera access."
    },
    {
      question: "Is my video data secure?",
      answer: "Absolutely! All analysis is performed locally on your device. Your video data is never stored or transmitted to our servers, ensuring complete privacy."
    },
    {
      question: "Can I use this for different types of exercises?",
      answer: "Currently, we support squat analysis and desk posture monitoring. We're continuously adding support for more exercises and posture types."
    }
  ];

  return (
    <FAQContainer>
      <FAQTitle>❓ Frequently Asked Questions</FAQTitle>
      {faqData.map((item, index) => (
        <FAQItem key={index}>
          <FAQQuestion onClick={() => toggleItem(index)}>
            {item.question}
            <span style={{ transform: openItems[index] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
              ⌄
            </span>
          </FAQQuestion>
          <FAQAnswer isOpen={openItems[index]}>
            <p>{item.answer}</p>
          </FAQAnswer>
        </FAQItem>
      ))}
    </FAQContainer>
  );
};

export default FAQSection;
