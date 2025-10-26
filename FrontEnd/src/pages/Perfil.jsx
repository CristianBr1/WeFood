import React from 'react'
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from '../components/Navbar';

import placeholder1 from "../assets/images/placeholder1.png";

import "../styles/Perfil.css";

const Perfil = () => {
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('bio');

  return (
    <>
      <Navbar />
        <main className="profileMain">

        <section className="profileTop">
          <div className="profileContainer" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "0.7rem",
            paddingTop: "2rem",
            width: "100%",
          }}>
            <div className="profileIconContainer">
              <div className="profileIcon" style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}>
                <img src={placeholder1} alt="" style={{
                  border: darkMode ? "2px solid #444" : "2px solid #ccc",
                  borderRadius: "50%",
                  width: "100%",
                  height: "100%",
                  background: darkMode ? "#333" : "#f0f0f0",
                }}></img>
              </div>
            </div>
                
            <h2 style={{
              color: darkMode ? "#fff" : "#222",
            }}><b>Perfil Placeholder</b></h2>
          </div>
          </section>
          <section className="profileDetails">
            {/* Tab Navigation */}
            <ul style={{
              borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
            }}>
              <li 
                onClick={() => setActiveTab('bio')}
                style={{
                  borderBottom: activeTab === 'bio' ? 
                    (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                  color: darkMode ? "#fff" : "#222",
                  fontWeight: activeTab === 'bio' ? "bold" : "normal",
                }}>
                Dados
              </li>
              <li 
                onClick={() => setActiveTab('favorites')}
                style={{
                  borderBottom: activeTab === 'favorites' ? 
                    (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                  color: darkMode ? "#fff" : "#222",
                  fontWeight: activeTab === 'favorites' ? "bold" : "normal",
                }}>
                Favoritos
              </li>
              <li 
                onClick={() => setActiveTab('restaurants')}
                style={{
                  borderBottom: activeTab === 'restaurants' ? 
                    (darkMode ? "2px solid #fff" : "2px solid #222") : "2px solid transparent",
                  color: darkMode ? "#fff" : "#222",
                  fontWeight: activeTab === 'restaurants' ? "bold" : "normal",
                }}>
                Restaurantes
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tabContent" style={{
              color: darkMode ? "#fff" : "#222",
            }}>
              {activeTab === 'bio' && (
                <div className="bioContent">
                  <h3>Sobre Mim</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto sit ducimus sunt. Necessitatibus at fugit minus veritatis recusandae quibusdam reiciendis enim illum neque? Delectus exercitationem praesentium veritatis? Sit, possimus dicta.
                  </p>
                  <div style={{ marginTop: "1.4rem" }}>
                    <p><strong>Ingressou:</strong> Setembro 2025</p>
                    <p><strong>Local:</strong> Porto Alegre, Brasil</p>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="favoritesContent">
                  <h3>Restaurantes Favoritos</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "1rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: darkMode ? "#333" : "#f5f5f5"
                    }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: darkMode ? "#555" : "#ddd"
                      }}></div>
                      <span>Restaurante Favoritado 1</span>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "1rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: darkMode ? "#333" : "#f5f5f5"
                    }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: darkMode ? "#555" : "#ddd"
                      }}></div>
                      <span>Restaurante Favoritado 2</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'restaurants' && (
                <div className="restaurantsContent">
                  <h3>Afiliado ao(s)</h3>
                  {(() => {
                    // Simulando dados de restaurantes - substituir por dados reais da API talvez?
                    const userRestaurants = [
//                      { name: "McKing", type: "Hamburgueria", rating: 4.5 },
//                      { name: "Burger Donald's", type: "Hamburgueria", rating: 4.2 }
                    ];
                    // Para testar estado vazio, descomente as linha acima dentro do array

                    if (userRestaurants.length === 0) {
                      // Mostra apenas quando não há restaurantes
                      return (
                        <div style={{ 
                          padding: "2rem",
                          borderRadius: "8px",
                          background: darkMode ? "#333" : "#f5f5f5",
                          textAlign: "center",
                          border: darkMode ? "2px dashed #555" : "2px dashed #ccc"
                        }}>
                          <div style={{ 
                            fontSize: "3rem", 
                            marginBottom: "1rem",
                            opacity: "0.5",
                            userSelect: "none",
                          }}>🏪</div>
                          <h4 style={{ 
                            margin: "0 0 0.5rem 0", 
                            color: darkMode ? "#ccc" : "#666"
                          }}>
                            Nenhum restaurante encontrado
                          </h4>
                          <p style={{ 
                            margin: "0", 
                            fontSize: "0.9rem", 
                            opacity: "0.6",
                            color: darkMode ? "#aaa" : "#888"
                          }}>
                            Este usuário ainda não está afiliado a nenhum restaurante
                          </p>
                        </div>
                      );
                    } else {

                      // Mostra apenas quando há restaurantes
                      return (
                        <div style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                          gap: "1rem" 
                        }}>
                        {userRestaurants.map((restaurant, index) => (
                          <div key={index} style={{ 
                            padding: "1rem",
                            borderRadius: "8px",
                            background: darkMode ? "#333" : "#f5f5f5"
                          }}>
                            <h4 style={{ margin: "0 0 0.5rem 0" }}>{restaurant.name}</h4>
                            <p style={{ margin: "0", fontSize: "0.9rem", opacity: "0.8" }}>
                              {restaurant.type} • ⭐ {restaurant.rating}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  })()}
                </div>
              )}
            </div>
          </section>
        </main>
    </>
  )
}

export default Perfil