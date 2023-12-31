import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      if (username.length < 5 || password.length < 5) {
        setErrors([
          'Username and Password must be at least 5 characters long.',
        ]);
      } else {
        const data = await dispatch(signUp(username, email, password));
        if (data) {
          setErrors(data);
        }
      }
    } else {
      setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (

    <div className="sign-up-page-wrapper">
      <div className="sign-up-body">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
  Email
  <input
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    title="Please enter a valid email address."
    className="sign-up-email"
  />
</label>
<label>
  Username
  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
    minLength={5} // Added minimum length validation
    className="sign-up-username"
  />
</label>
<label>
  Password
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    minLength={5} // Added minimum length validation
    className="sign-up-password"
  />
</label>
<label>
  Confirm Password
  <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    minLength={5} // Added minimum length validation
    className="sign-up-password-confirm"
  />
</label>
        <button type="submit">Sign Up</button>
      </form>
      </div>
      </div>

  );
}

export default SignupFormPage;
