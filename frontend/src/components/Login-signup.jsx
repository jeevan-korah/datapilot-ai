// 
import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [IsLoginMode, setIsLoginMode] = useState(true);
  const [IsAdmin,setIsAdmin]=useState(true);

  return (
    <div className="auth-container">
        
      <div className="auth-card">
        <div>
        {/* <h2 className="auth-title">
          {IsAdmin ? "ADMIN 👨‍💻" : "EMPLOYEE 👩‍💼"}
        </h2> */}
        <div className="toggle-buttons">
          <button
            className={IsAdmin ? "active" : ""}
            onClick={() => setIsAdmin(true)}
          >
            Admin
          </button>
          <button
            className={!IsAdmin ? "active" : ""}
            onClick={() => setIsAdmin(false)}
          >
            Employee
          </button>
        </div>
        </div>
        <h2 className="auth-title">
          {IsLoginMode ? "LOGIN" : "REGISTER"}
        </h2>

        <div className="toggle-buttons">
          <button
            className={IsLoginMode ? "active" : ""}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button
            className={!IsLoginMode ? "active" : ""}
            onClick={() => setIsLoginMode(false)}
          >
            Register
          </button>
        </div>

        <form className="auth-form">
            
          {!IsLoginMode && (
            <input type="text" placeholder="Name" required />
          )}

          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {/* {!IsLoginMode && (
            <input type="password" placeholder="Confirm Password" required />
            {IsAdmin && (
         
                <input type="text" placeholder="Company name" required />
              )}
          )
          } */}
        {!IsLoginMode && (
        <>
            <input type="password" placeholder="Confirm Password" required/>

            {IsAdmin && (
            <input type="text" placeholder="Company Name" required/>
            )}
        </>
        )}
          <button type="submit" className="submit-btn">
            {IsLoginMode ? "Login" : "Register"}
          </button>

          <p className="switch-text">
            {IsLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
            <span onClick={() => setIsLoginMode(!IsLoginMode)}>
              {IsLoginMode ? "Register Now" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
