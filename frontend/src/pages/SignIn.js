import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, loginUser } from '../api'; // Importing API functions
import "../styles/SignIn.css";

const SignIn = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpDetails, setSignUpDetails] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // Navigation hook

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { fullName, username, email, phone, password, confirmPassword } = signUpDetails;

    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userData = { name: fullName, username, email, password, contact: phone, admin: false };
      await addUser(userData); // Call the addUser function
      alert("Signup Successful!");
      setIsSignUpMode(false);
    } catch (error) {
      alert("Error during signup: " + error.response.data.msg);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const credentials = { email: email, password: password };
      const loginData = await loginUser(credentials); // Call the loginUser function
  
      // Assuming loginData contains the token and user information
      const { token, user } = loginData;
  
      // Store JWT token, user data, and admin status in sessionStorage
      sessionStorage.setItem("jwtToken", token);  // Store JWT token
      sessionStorage.setItem("logged", JSON.stringify(user));  // Store user data (username, email, etc.)
      sessionStorage.setItem("admin", user.admin);  // Store admin status (true or false) based on user.admin
      sessionStorage.setItem("unique_id", user.unique_id);  // Store login status
  
      console.log("Login successful:", loginData);
  
      // Redirect to the home page or dashboard
      window.location.assign("/");
  
    } catch (error) {
      alert("Error during login: " + error.response?.data?.msg || error.message);
    }
  };
  
  return (
    <div className="main-container">
      {/* Dashboard */}

      <div className="auth-container">
        <div className={`card-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          {/* Login Form */}
          <div className="form-container login-form">
            <form className={`form ${isSignUpMode ? "hidden" : ""}`} onSubmit={handleLogin}>
              <h2 className="title">Login</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn">Login</button>
              <p className="toggle-text">
                Don't have an account?{" "}
                <span onClick={toggleMode} className="toggle-link">
                  Sign up
                </span>
              </p>
            </form>
          </div>

          {/* Sign-Up Form */}
          <div className="form-container signup-form">
            <form className={`form ${isSignUpMode ? "" : "hidden"}`} onSubmit={handleSignUp}>
              <h2 className="title">Sign Up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signUpDetails.fullName}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, fullName: e.target.value })}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  value={signUpDetails.username}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, username: e.target.value })}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpDetails.email}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, email: e.target.value })}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={signUpDetails.phone}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, phone: e.target.value })}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpDetails.password}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, password: e.target.value })}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signUpDetails.confirmPassword}
                  onChange={(e) => setSignUpDetails({ ...signUpDetails, confirmPassword: e.target.value })}
                />
              </div>
              <button className="btn">Sign Up</button>
              <p className="toggle-text">
                Already have an account?{" "}
                <span onClick={toggleMode} className="toggle-link">
                  Login
                </span>
              </p>
            </form>
          </div>

          {/* Overlapping Image */}
          <div className="image-container">
            <img src= "https://lottie.host/embed/670f63a8-c918-4221-a61b-22826c2e3f94/SAgGQNs7vc.lottie" alt="Yoga Pose" className="yoga-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;