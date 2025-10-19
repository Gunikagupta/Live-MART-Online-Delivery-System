import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "982520762305-0hqpoq34bmctonak7jn9no4n7djd48s4.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "PASTE_YOUR_APP_ID_HERE";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      alert("Welcome " + res.data.name + " (" + res.data.role + ")");
      // Save user data or token in localStorage/session here if JWT used
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      // response.credential contains a JWT ID token
      const res = await axios.post("http://localhost:8080/api/auth/google-login", {
        token: response.credential,
      });
      alert("Logged in with Google!");
      // Save user data or token in localStorage/session here if JWT used
    } catch (error) {
      alert("Google login failed");
    }
  };
  // const handleFacebookLogin = async (response) => {
  //   try {
  //     await axios.post("http://localhost:8080/api/auth/facebook-login", {
  //       accessToken: response.accessToken
  //     });
  //     alert("Logged in with Facebook!");
  //   } catch (err) {
  //     alert("Facebook login failed");
  //   }
  // };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => alert("Google login failed")}
        />
      </GoogleOAuthProvider>
      {/* <FacebookLogin
        appId={FACEBOOK_APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFacebookLogin}
        icon="fa-facebook"
      /> */}

      <p>
        New user? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
