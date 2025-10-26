import React, { useState } from 'react';
import styled from 'styled-components';

const ContactContainer = styled.section`
  padding: 4rem 2rem;
  background: rgba(10, 10, 10, 1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  margin: 2rem 0;
  border: 1px solid rgba(45, 55, 70, 0.8);
`;

const ContactTitle = styled.h2`
  color: #1E90FF;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  h3 {
    color: #1E90FF;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(35, 42, 52, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(45, 55, 70, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(42, 48, 58, 0.95);
    border-color: rgba(30, 144, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.5rem;
    color: #1E90FF;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 0.25rem;
    }
    
    .value {
      color: #E0E0E0;
      font-size: 0.9rem;
    }
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  h3 {
    color: #1E90FF;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #FFFFFF;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #1E90FF;
    box-shadow: 0 0 10px rgba(30, 144, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #1E90FF;
    box-shadow: 0 0 10px rgba(30, 144, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1E90FF, #4169E1);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(30, 144, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <ContactContainer>
      <ContactTitle>📞 Get In Touch</ContactTitle>
      <ContactGrid>
        <ContactInfo>
          <h3>Contact Information</h3>
          <ContactItem>
            <div className="icon">📧</div>
            <div className="content">
              <div className="label">Email</div>
              <div className="value">support@aligniq.com</div>
            </div>
          </ContactItem>
          <ContactItem>
            <div className="icon">💬</div>
            <div className="content">
              <div className="label">Live Chat</div>
              <div className="value">Available 24/7 for instant support</div>
            </div>
          </ContactItem>
          <ContactItem>
            <div className="icon">🌐</div>
            <div className="content">
              <div className="label">Community</div>
              <div className="value">Join our Discord community</div>
            </div>
          </ContactItem>
          <ContactItem>
            <div className="icon">📖</div>
            <div className="content">
              <div className="label">Documentation</div>
              <div className="value">Comprehensive guides and tutorials</div>
            </div>
          </ContactItem>
        </ContactInfo>
        
        <ContactForm onSubmit={handleSubmit}>
          <h3>Send us a Message</h3>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="subject">Subject</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">Message</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your question or feedback..."
              required
            />
          </FormGroup>
          <SubmitButton type="submit">
            Send Message 🚀
          </SubmitButton>
        </ContactForm>
      </ContactGrid>
    </ContactContainer>
  );
};

export default ContactSection;
