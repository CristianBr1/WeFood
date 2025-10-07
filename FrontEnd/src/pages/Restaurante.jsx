import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from '../components/Navbar';

import "../styles/Restaurante.css";
import placeholder2 from "../assets/images/placeholder2.png";
import placeholder3 from "../assets/images/placeholder4.png";
import placeholder5 from "../assets/images/placeholder5.png";
import placeholder6 from "../assets/images/placeholder6.png";
import placeholder7 from "../assets/images/placeholder7.png";

function Restaurante() {
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('cardapio');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dados mock do restaurante
  const restaurante = {
    id: 1,
    nome: "Burger King",
    categoria: "Hamburgueria",
    rating: 4.5,
    totalAvaliacoes: 248,
    tempoEntrega: "25-35 min",
    taxaEntrega: "R$ 4,99",
    descricao: "Os melhores hambúrgueres da cidade com ingredientes frescos e sabor incomparável.",
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 99999-9999",
    horarioFuncionamento: "10:00 - 23:00",
    imagemCapa: placeholder3,
    imagemLogo: placeholder2,
  };

  const cardapio = [
    {
      id: 1,
      nome: "Whopper",
      descricao: "Hambúrguer com carne grelhada, alface, tomate, cebola e molho especial",
      preco: 18.90,
      categoria: "Hambúrgueres",
      imagem: placeholder5
    },
    {
      id: 2,
      nome: "Big King",
      descricao: "Dois hambúrgueres, alface, queijo, molho especial e pão com gergelim",
      preco: 22.50,
      categoria: "Hambúrgueres",
      imagem: placeholder6
    },
    {
      id: 3,
      nome: "Batata Frita Grande",
      descricao: "Batatas fritas crocantes e douradas",
      preco: 8.90,
      categoria: "Acompanhamentos",
      imagem: placeholder7
    }
  ];

  const avaliacoes = [
    {
      id: 1,
      usuario: "Fulano de Tal",
      rating: 5,
      comentario: "Excelente hambúrguer! Chegou quentinho e muito saboroso.",
      data: "Há 2 dias"
    },
    {
      id: 2,
      usuario: "Ciclana de Tal",
      rating: 4,
      comentario: "Boa qualidade, mas o tempo de entrega poderia ser melhor.",
      data: "Há 1 semana"
    }
  ];

  return (
    <>
      <Navbar />
      <main style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
      }}>
        
        {/* Header do Restaurante */}
        <div className="restaurant-header" style={{
          height: isMobile ? "132px" : "210px",
          backgroundImage: `url(${restaurante.imagemCapa})`,
        }}>
          {/* Overlay escuro */}
          <div className="banner-overlay" />
          
          {/* Info do restaurante */}
          <div className="restaurantInfo">
            <img 
              src={restaurante.imagemLogo} 
              alt={restaurante.nome}
              className="restaurant-logo"
            />
            <div>
              <h1>{restaurante.nome}</h1>

              <p>{restaurante.categoria}</p>

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "15px", 
                fontSize: "0.9rem",
                flexWrap: "wrap",
                justifyContent: "flex-start"
              }}>
                <span>⭐ {restaurante.rating} ({restaurante.totalAvaliacoes})</span>
                <span>🕒 {restaurante.tempoEntrega}</span>
                <span>🚚 {restaurante.taxaEntrega}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div style={{
          background: darkMode ? "#222" : "#fff",
          borderBottom: darkMode ? "1px solid #444" : "1px solid #ddd",
          padding: "0 20px"
        }}>
          <div style={{
            display: "flex",
            gap: isMobile ? "20px" : "30px",
            maxWidth: "1200px",
            margin: "0 auto",
            justifyContent: isMobile ? "center" : "flex-start"
          }}>
            {['cardapio', 'sobre', 'avaliacoes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "15px 0",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  color: activeTab === tab 
                    ? (darkMode ? "#fff" : "#333") 
                    : (darkMode ? "#aaa" : "#666"),
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  borderBottom: activeTab === tab 
                    ? (darkMode ? "3px solid #fff" : "3px solid #333") 
                    : "3px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "capitalize"
                }}
              >
                {tab === 'cardapio' ? 'Cardápio' : 
                 tab === 'sobre' ? 'Sobre' : 'Avaliações'}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px 15px" : "30px 20px"
        }}>
          
          {/* Tab Cardápio */}
          {activeTab === 'cardapio' && (
            <div>
              <h2 style={{
                color: darkMode ? "#fff" : "#333",
                marginBottom: "20px",
                fontSize: "1.5rem",
                textAlign: isMobile ? "center" : "left"
              }}>
                Cardápio
              </h2>
              <div style={{
                display: "grid",
                gap: "20px"
              }}>
                {cardapio.map((item) => (
                  <div key={item.id} style={{
                    background: darkMode ? "#333" : "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "20px",
                    alignItems: isMobile ? "stretch" : "center",
                    boxShadow: darkMode 
                      ? "0 2px 10px rgba(0,0,0,0.3)" 
                      : "0 2px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "center" : "flex-start",
                      gap: isMobile ? "15px" : "20px",
                      flex: 1
                    }}>
                      <img 
                        src={item.imagem} 
                        alt={item.nome}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          flexShrink: 0
                        }}
                      />
                      <div style={{ 
                        flex: 1,
                        textAlign: isMobile ? "center" : "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      }}>
                        <h3 style={{
                          color: darkMode ? "#fff" : "#333",
                          margin: "0",
                          fontSize: "1.1rem"
                        }}>
                          {item.nome}
                        </h3>
                        <p style={{
                          color: darkMode ? "#ccc" : "#666",
                          margin: "0",
                          fontSize: "0.9rem",
                          lineHeight: "1.4"
                        }}>
                          {item.descricao}
                        </p>
                        <span style={{
                          color: darkMode ? "#4ade80" : "#16a34a",
                          fontSize: "1.1rem",
                          fontWeight: "bold"
                        }}>
                          R$ {item.preco.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button style={{
                      background: darkMode ? "#22c55e" : "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                      alignSelf: isMobile ? "center" : "flex-start",
                      minWidth: "100px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = darkMode ? "#4ade80" : "#15803d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = darkMode ? "#22c55e" : "#16a34a";
                    }} >
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Sobre */}
          {activeTab === 'sobre' && (
            <div>
              <h2 style={{
                color: darkMode ? "#fff" : "#333",
                marginBottom: "20px",
                fontSize: "1.5rem",
                textAlign: isMobile ? "center" : "left"
              }}>
                Sobre o Restaurante
              </h2>
              <div style={{
                background: darkMode ? "#333" : "#fff",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: darkMode 
                  ? "0 2px 10px rgba(0,0,0,0.3)" 
                  : "0 2px 10px rgba(0,0,0,0.1)"
              }}>
                <p style={{
                  color: darkMode ? "#ccc" : "#666",
                  lineHeight: "1.6",
                  marginBottom: "30px",
                  fontSize: "1rem"
                }}>
                  {restaurante.descricao}
                </p>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px"
                }}>
                  <div>
                    <h4 style={{ 
                      color: darkMode ? "#fff" : "#333",
                      margin: "0 0 10px 0",
                      fontSize: "1.1rem"
                    }}>
                      📍 Endereço
                    </h4>
                    <p style={{ 
                      color: darkMode ? "#ccc" : "#666",
                      margin: "0",
                      fontSize: "0.9rem"
                    }}>
                      {restaurante.endereco}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      color: darkMode ? "#fff" : "#333",
                      margin: "0 0 10px 0",
                      fontSize: "1.1rem"
                    }}>
                      📞 Telefone
                    </h4>
                    <p style={{ 
                      color: darkMode ? "#ccc" : "#666",
                      margin: "0",
                      fontSize: "0.9rem"
                    }}>
                      {restaurante.telefone}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      color: darkMode ? "#fff" : "#333",
                      margin: "0 0 10px 0",
                      fontSize: "1.1rem"
                    }}>
                      🕒 Horário
                    </h4>
                    <p style={{ 
                      color: darkMode ? "#ccc" : "#666",
                      margin: "0",
                      fontSize: "0.9rem"
                    }}>
                      {restaurante.horarioFuncionamento}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Avaliações */}
          {activeTab === 'avaliacoes' && (
            <div>
              <h2 style={{
                color: darkMode ? "#fff" : "#333",
                fontSize: "1.5rem",
                textAlign: isMobile ? "center" : "left"
              }}>
                Avaliações dos Clientes
              </h2>
              
              {/* Resumo das avaliações */}
              <div style={{
                borderRadius: "12px",
                padding: "16px",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "left",
                  gap: "10px",
                  marginBottom: "10px"
                }}>
                  <span style={{ fontSize: "2.1rem" }}>⭐</span>
                  <h3 style={{
                    color: darkMode ? "#fff" : "#333",
                    margin: "0",
                    fontSize: "2.1rem"
                  }}>
                    {restaurante.rating}
                  </h3>
                </div>
                <p style={{
                  color: darkMode ? "#ccc" : "#666",
                  margin: "0",
                  fontSize: "1rem",
                  textAlign: isMobile ? "center" : "left"
                }}>
                  Baseado em {restaurante.totalAvaliacoes} avaliações
                </p>
              </div>

              {/* Lista de avaliações */}
              <div style={{ display: "grid", gap: "15px" }}>
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} style={{
                    background: darkMode ? "#333" : "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: darkMode 
                      ? "0 2px 10px rgba(0,0,0,0.3)" 
                      : "0 2px 10px rgba(0,0,0,0.1)"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}>
                      <h4 style={{
                        color: darkMode ? "#fff" : "#333",
                        margin: "0",
                        fontSize: "1rem"
                      }}>
                        {avaliacao.usuario}
                      </h4>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}>
                        <span style={{ color: "#fbbf24" }}>
                          {'⭐'.repeat(avaliacao.rating)}
                        </span>
                        <span style={{
                          color: darkMode ? "#aaa" : "#666",
                          fontSize: "0.8rem"
                        }}>
                          {avaliacao.data}
                        </span>
                      </div>
                    </div>
                    <p style={{
                      color: darkMode ? "#ccc" : "#666",
                      margin: "0",
                      lineHeight: "1.5",
                      fontSize: "0.9rem"
                    }}>
                      {avaliacao.comentario}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Restaurante;