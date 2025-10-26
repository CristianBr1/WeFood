
import React from "react";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeProvider";
import "../styles/Menu.css";
import waveImg from "../assets/images/layered-waves-haikei1.png";

const Menu = () => {
	const darkMode = React.useContext(ThemeContext).darkMode;

	return (
		<>
			<Navbar />

			<section
				className="menu-container"
				style={{
					backgroundImage: `url(${waveImg})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% 480px",
					backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5"
				}}>
				<div style={{ padding: "2rem", marginTop: "0.2rem", marginLeft: "14rem" }}>
						<h1 style={{
								textShadow: darkMode
									? "0 1px 1px #000, 0 1px 0 #222"
									: "0 0.4px 0.6px #ccc, 0 0.5px 0 #aaa"
							}}>
							Usuário
						</h1>
						<h2 style={{
							textShadow: darkMode
								? "0 1px 1px #000, 0 1px 0 #222"
								: "0 1px 1px #ccc, 0 1px 0 #aaa",
						}}>
							🛠&#8195;Aqui você pode editar seu perfil e outras configurações.
						</h2>
				</div>
				<div className="menu-settings" style={{
					backgroundColor: darkMode ? "#333" : "#fff",
					boxShadow: darkMode ? "none" : "0 0 10px rgba(0, 0, 0, 0.1)"
				}}>
					<div className="setting-block">
						<button className="editProfile" style={{
							background: "#0d6efd",
							color: darkMode ? "#fff" : "#222",
							boxShadow: darkMode
								? "none"
								: "0 2px 8px rgba(0,0,0,0.12)",
						}}>
							<span>✏️</span>Editar Perfil
						</button>
						<p>Exemplo 1, WIP.</p>
					</div>
					<div className="setting-block">
						<button className="notifications" style={{
							background: "#e0a800",
							color: darkMode ? "#fff" : "#222",
							boxShadow: darkMode
								? "none"
								: "0 2px 8px rgba(0,0,0,0.12)",
						}}>
							<span>🔔</span> Configurar Notificações
						</button>
						<p>Exemplo 2, WIP.</p>
					</div>
					<div className="setting-block">
						<button className="myRestaurants" style={{
							background: "#28a745",
							color: darkMode ? "#fff" : "#222",
							boxShadow: darkMode
								? "none"
								: "0 2px 8px rgba(0,0,0,0.12)",
						}}>
							<span>🍽️</span> Meus Restaurantes
						</button>
						<p>Exemplo 3, WIP.</p>
					</div>
					<div className="setting-block">
						<button className="security" style={{
							background: "#fd7e14",
							color: darkMode ? "#fff" : "#222",
							boxShadow: darkMode
								? "none"
								: "0 2px 8px rgba(0,0,0,0.12)",
						}}>
							<span>🔒</span> Configurações de Segurança
						</button>
						<p>Exemplo 4, WIP.</p>
					</div>
					<div className="setting-block">
						<button className="logout" style={{
							background: "#dc3545",
							color: darkMode ? "#fff" : "#222",
							boxShadow: darkMode
								? "none"
								: "0 2px 8px rgba(0,0,0,0.12)",
						}}>
							<span>✖️</span> Sair
						</button>
						<p>Exemplo 5, WIP.</p>
					</div>
				</div>
			</section>
		</>
	);
};

export default Menu;
