import React from 'react'
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from '../components/Navbar';
import DevCards from '../components/DevCards';

function Sobre() {
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <>
      <Navbar />
      <main className="sobreMain">
        <section className="sobreHeader" style={{
          textAlign: "center",
          marginTop: "1rem",
          paddingTop: "1.2rem",
          marginBottom: "0.4rem",
        }}>
          <h2 style={{
            color: darkMode ? "#fff" : "#222",
            fontSize: "1.6rem",
            fontFamily: "inherit",
          }}>
            <b>Nossa Equipe</b>
          </h2>
        </section>

        <section className="teamDetails" style={{
          padding: "0 1rem 0 1rem",
          margin: "0 auto 0 auto",
          maxWidth: "1000px",
        }}>
          {/* Tab Navigation */}
          <ul style={{
            display: "flex",
            listStyle: "none",
            padding: "0",
            margin: "0 0 2rem 0",
            borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}>
            <li 
              onClick={() => setActiveTab('frontend')}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                borderBottom: activeTab === 'frontend' ? 
                  (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                color: darkMode ? "#fff" : "#222",
                fontWeight: activeTab === 'frontend' ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
            >
              Front-End
            </li>
            <li 
              onClick={() => setActiveTab('backend')}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                borderBottom: activeTab === 'backend' ? 
                  (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                color: darkMode ? "#fff" : "#222",
                fontWeight: activeTab === 'backend' ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
            >
              Back-End
            </li>
            <li 
              onClick={() => setActiveTab('fullstack')}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                borderBottom: activeTab === 'fullstack' ? 
                  (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                color: darkMode ? "#fff" : "#222",
                fontWeight: activeTab === 'fullstack' ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
            >
              Full-Stack
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tabContent" style={{
            minHeight: "400px",
            padding: "1rem",
            color: darkMode ? "#fff" : "#222",
          }}>
            {activeTab === 'frontend' && (
              <div className="frontendContent">
                <DevCards category="frontend" />
              </div>
            )}

            {activeTab === 'backend' && (
              <div className="backendContent">
                <DevCards category="backend" />
              </div>
            )}

            {activeTab === 'fullstack' && (
              <div className="fullstackContent">
                <DevCards category="fullstack" />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default Sobre
