import React from 'react';
import styled from 'styled-components';

const TestimonialsContainer = styled.section`
  padding: 4rem 2rem;
  background: rgba(10, 10, 10, 1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  margin: 2rem 0;
  text-align: center;
  border: 1px solid rgba(45, 55, 70, 0.8);
`;

const TestimonialsSection = () => {
  return (
    <TestimonialsContainer>
      <h2 style={{ color: '#1E90FF', fontSize: '2.5rem', marginBottom: '2rem' }}>
        🌟 What Our Users Say
      </h2>
      <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
        Join thousands of users who have improved their posture with our AI-powered analysis system.
      </p>
      <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(35, 42, 52, 0.95)', borderRadius: '15px', border: '1px solid rgba(45, 55, 70, 0.8)', transition: 'all 0.3s ease' }}>
        <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '1rem' }}>
          "This app completely transformed my workspace setup. The real-time analysis helped me fix years of poor posture habits!"
        </p>
        <strong style={{ color: '#1E90FF' }}>- Sarah Johnson, Software Developer</strong>
      </div>
    </TestimonialsContainer>
  );
};

export default TestimonialsSection;
