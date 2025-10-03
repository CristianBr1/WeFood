import { memo } from 'react';
import {FaUser, FaLock } from "react-icons/fa"
import "./Login.css"
import { useState } from 'react';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(email, password);
      console.log("Envio");
    }

  return (
    <div className='page-wrapper'>
      <div className='dark-column'>
        <div className='container'>
          <form onSubmit={handleSubmit} className='form'>
            <h1 className='titulo'>Meu Pedido</h1>

            <div className='input-container'>
              <input 
                type='email' 
                placeholder='E-mail'
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser className='icon'/>
            </div>

            <div className='input-container'>
              <input 
                type='password' 
                placeholder='Senha'
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className='icon'/>
            </div>

            <div className='recall-forget'>
              <label>
                <input type='checkbox'/>
                Mantenha-me conectado
              </label>
              <br />
              <a className="link" href='https://www.youtube.com/watch?v=mdZ8wtsSvwI&ab_channel=CaptainRonLives'>Esqueceu a senha?</a>
            </div>

            <div>
              <button className='button'>Entrar</button>
            </div>

            <div>
              <p>
                Não tem uma conta? <a className="link" href='http://localhost:5173/Register'>Cadastre-se</a>
              </p>
            </div>

          </form>
        </div>
      </div>
      <div className='light-column'>
      </div>  
    </div>
  );
};

export default memo(Login);