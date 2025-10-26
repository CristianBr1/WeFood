import React, { useContext } from 'react';
import { ThemeContext } from "../context/ThemeProvider";

import placeholder1 from "../assets/images/placeholder1.png";

// Dados da equipe
const teamMembers = {
  backend: [
    {
      id: 1,
      name: "Gabriel",
      role: "Lead & Dev Back-End",
      icon: placeholder1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
      technologies: ["Gestão", "Banco de Dados"],
      github: "https://github.com/gabriel-username"
    }
  ],
  fullstack: [
    
  ],
  frontend: [
    {
      id: 2,
      name: "Guilherme",
      role: "Dev Front-End",
      icon: placeholder1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.",
      technologies: ["React", "CSS"],
      github: "https://github.com/Gui99S"
    },
    {
      id: 3,
      name: "Cristian",
      role: "Dev Front-End",
      icon: placeholder1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut.",
      technologies: ["React", "Tailwind"],
      github: "https://github.com/CristianBr1"  
    },
    {
      id: 4,
      name: "João",
      role: "Dev Front-End",
      icon: placeholder1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
      technologies: ["React", "CSS"],
      github: "https://github.com/joao-username"
    }
  ],
};

// Componente individual do card
const DevCard = ({ member }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div style={{ 
      padding: "2rem",
      borderRadius: "12px",
      background: darkMode ? "#333" : "#f8f9fa",
      textAlign: "center",
      border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
      maxWidth: "350px",
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: darkMode ? "#555" : "#ddd",
        margin: "0 auto 1rem auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
      }}>
        <img src={member.icon} alt={member.name} style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
        }} />
      </div>
      
      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
        {member.name}
      </h4>
      
      <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", opacity: "0.8" }}>
        {member.role} | <a 
          href={member.github} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: darkMode ? "#58a6ff" : "#0969da",
            textDecoration: "none",
          }}
          onMouseOver={(e) => {
            e.target.style.textDecoration = "underline";
          }}
          onMouseOut={(e) => {
            e.target.style.textDecoration = "none";
          }}
        >
          GitHub
        </a>
      </p>
      
      <p style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
        {member.description}
      </p>
      
      <div style={{ marginTop: "1rem" }}>
        {member.technologies.map((tech, index) => (
          <span 
            key={index}
            style={{ 
              background: darkMode ? "#444" : "#e9ecef", 
              padding: "0.3rem 0.6rem", 
              borderRadius: "15px", 
              fontSize: "0.8rem",
              margin: "0.2rem",
              display: "inline-block"
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

// Componente principal DevCards
const DevCards = ({ category }) => {
  const { darkMode } = useContext(ThemeContext);
  
  // Função para obter membros baseado na categoria
  const getMembers = (category) => {
    switch(category) {
      case 'frontend':
        return [...teamMembers.frontend, ...teamMembers.fullstack].sort((a, b) => a.id - b.id);
      case 'backend':
        return [...teamMembers.backend, ...teamMembers.fullstack].sort((a, b) => a.id - b.id);
      case 'fullstack':
        return teamMembers.fullstack;
      default:
        return [];
    }
  };

  const members = getMembers(category);
  const isFullstackOnly = category === 'fullstack';

  return (
    <div style={{ 
      display: isFullstackOnly ? "flex" : "grid", 
      gridTemplateColumns: isFullstackOnly ? "none" : "repeat(auto-fit, minmax(280px, 1fr))",
      justifyContent: isFullstackOnly ? "center" : "initial",
      gap: "2rem" 
    }}>
      {members.map((member) => (
        <DevCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default DevCards;
export { teamMembers };