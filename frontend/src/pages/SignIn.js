"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./AuthPage.css"
import { addUser, loginUser } from '../api';

// Import icons from react-icons
import { FiUser, FiMail, FiLock, FiPhone, FiAtSign, FiUserCheck, FiLogIn, FiUserPlus } from "react-icons/fi"

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [signUpDetails, setSignUpDetails] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  
  // Add this state to track the active tab
  const [activeTab, setActiveTab] = useState("signin")

  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSignUpChange = (e) => {
    setSignUpDetails({
      ...signUpDetails,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSignIn = async (e) => {
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
  
      // Clear the signup form fields
      setSignUpDetails({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
  
      // Switch back to the sign-in tab
      setActiveTab("signin");
    } catch (error) {
      alert("Error during signup: " + (error.response?.data?.msg || error.message));
    }
  };
  

  // Add this function to handle tab changes
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-grid">
          {/* Left side - visible only on large screens */}
          <motion.div
            className="auth-left-panel"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              duration: 0.5,
              y: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" },
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="auth-icon-wrapper"
            >
              <FiLogIn className="auth-icon" />
            </motion.div>
            <motion.h2
              className="auth-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Welcome to
            </motion.h2>
            <motion.p
              className="auth-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              HACKINDIA
            </motion.p>
            <motion.div
              className="auth-testimonial-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {/* <div className="auth-testimonial">
                <p className="auth-testimonial-text">
                  "The authentication system is secure and easy to use. I love the user experience!"
                </p>
                <p className="auth-testimonial-author">- Happy User</p>
              </div> */}
            </motion.div>
          </motion.div>

          {/* Right side - Auth form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-form-container"
          >
            <div className="auth-card">
              <div className="auth-card-header">
                {/* <h2 className="auth-card-title">Authentication</h2>
                <p className="auth-card-description">Sign in to your account or create a new one</p> */}
<img src="title.png" style={{ width: "300px", height: "auto" }} alt="Title" />

              </div>
              <div className="auth-card-content">
                <motion.div
                  className="auth-tabs-container"
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="auth-tabs">
                    <div className="auth-tabs-list">
                      <button
                        className={`auth-tab ${activeTab === "signin" ? "active" : ""}`}
                        onClick={() => handleTabChange("signin")}
                      >
                        <span className="auth-tab-content">
                          <FiLogIn className="auth-tab-icon" />
                          Sign In
                        </span>
                        {activeTab === "signin" && (
                          <motion.div className="auth-tab-indicator green" layoutId="activeTab" />
                        )}
                      </button>
                      <button
                        className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
                        onClick={() => handleTabChange("signup")}
                      >
                        <span className="auth-tab-content">
                          <FiUserPlus className="auth-tab-icon" />
                          Sign Up
                        </span>
                        {activeTab === "signup" && (
                          <motion.div className="auth-tab-indicator orange" layoutId="activeTab" />
                        )}
                      </button>
                    </div>

                    <div className="auth-tabs-content">
                      <div className="auth-tabs-content-container">
                        <AnimatePresence mode="wait">
                          {/* Sign In Form */}
                          {activeTab === "signin" && (
                            <motion.div
                              key="signin"
                              initial={{ opacity: 0, x: activeTab === "signup" ? -20 : 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              className="auth-tab-panel"
                            >
                              <form onSubmit={handleSignIn}>
                                <div className="auth-form-fields">
                                  <div className="auth-form-field">
                                    <label htmlFor="signin-email" className="auth-label">
                                      Email
                                    </label>
                                    <div className="auth-input-container">
                                      <FiMail className="auth-input-icon" />
                                      <input
  id="signin-email"
  name="email"
  type="email"
  placeholder="enter mail"
  className="auth-input"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
                                    </div>
                                  </div>
                                  <div className="auth-form-field">
                                    <div className="auth-label-row">
                                      <label htmlFor="signin-password" className="auth-label">
                                        Password
                                      </label>
                                      <a href="#" className="auth-forgot-password">
                                        Forgot password?
                                      </a>
                                    </div>
                                    <div className="auth-input-container">
                                      <FiLock className="auth-input-icon" />
                                      <input
                                        id="signin-password"
                                        name="password"
                                        type="password"
                                        placeholder="enter password"
                                        className="auth-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <button type="submit" className="auth-button auth-button-green">
                                      <FiLogIn className="auth-button-icon" />
                                      Sign In
                                    </button>
                                  </motion.div>
                                </div>
                              </form>
                            </motion.div>
                          )}

                          {/* Sign Up Form */}
                          {activeTab === "signup" && (
                            <motion.div
                              key="signup"
                              initial={{ opacity: 0, x: activeTab === "signin" ? 20 : -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="auth-tab-panel"
                            >
                              <form onSubmit={handleSignUp}>
                                <div className="auth-form-fields">
                                  <div className="auth-form-row">
                                    <div className="auth-form-field">
                                      <label htmlFor="fullName" className="auth-label">
                                        Full Name
                                      </label>
                                      <div className="auth-input-container">
                                        <FiUser className="auth-input-icon" />
                                        <input
                                          id="fullName"
                                          name="fullName"
                                          placeholder="Enter name"
                                          className="auth-input"
                                          value={signUpDetails.fullName}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, fullName: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="auth-form-field">
                                      <label htmlFor="username" className="auth-label">
                                        Username
                                      </label>
                                      <div className="auth-input-container">
                                        <FiAtSign className="auth-input-icon" />
                                        <input
                                          id="username"
                                          name="username"
                                          placeholder="enter username"
                                          className="auth-input"
                                          value={signUpDetails.username}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, username: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="auth-form-row">
                                    <div className="auth-form-field">
                                      <label htmlFor="signup-email" className="auth-label">
                                        Email
                                      </label>
                                      <div className="auth-input-container">
                                        <FiMail className="auth-input-icon" />
                                        <input
                                          id="signup-email"
                                          name="email"
                                          type="email"
                                          placeholder="enter email" 
                                          className="auth-input"
                                          value={signUpDetails.email}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, email: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="auth-form-field">
                                      <label htmlFor="phone" className="auth-label">
                                        Phone
                                      </label>
                                      <div className="auth-input-container">
                                        <FiPhone className="auth-input-icon" />
                                        <input
                                          id="phone"
                                          name="phone"
                                          type="tel"
                                          placeholder="enter mobile"
                                          className="auth-input"
                                          value={signUpDetails.phone}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, phone: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="auth-form-row">
                                    <div className="auth-form-field">
                                      <label htmlFor="signup-password" className="auth-label">
                                        Password
                                      </label>
                                      <div className="auth-input-container">
                                        <FiLock className="auth-input-icon" />
                                        <input
                                          id="signup-password"
                                          name="password"
                                          type="password"
                                          placeholder="enter password"
                                          className="auth-input"
                                          value={signUpDetails.password}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, password: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="auth-form-field">
                                      <label htmlFor="confirmPassword" className="auth-label">
                                        Confirm Password
                                      </label>
                                      <div className="auth-input-container">
                                        <FiUserCheck className="auth-input-icon" />
                                        <input
                                          id="confirmPassword"
                                          name="confirmPassword"
                                          type="password"
                                          placeholder="enter confirm password"
                                          className="auth-input"
                                          value={signUpDetails.confirmPassword}
                                          onChange={(e) => setSignUpDetails({ ...signUpDetails, confirmPassword: e.target.value })}
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <button type="submit" className="auth-button auth-button-orange">
                                      <FiUserPlus className="auth-button-icon" />
                                      Create Account
                                    </button>
                                  </motion.div>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="auth-card-footer">

                <div className="auth-social-buttons">
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

