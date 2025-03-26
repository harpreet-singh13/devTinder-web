import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ImSpinner8 } from "react-icons/im";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useDemoCredentials, setUseDemoCredentials] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation - at least 8 chars, 1 number, 1 lowercase, 1 uppercase
  const validatePassword = (pass) => {
    // const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    // return re.test(pass);
    return pass.length >= 8;
  };

  const handleDemoCredentialsChange = (e) => {
    const isChecked = e.target.checked;
    setUseDemoCredentials(isChecked);
    if (isChecked) {
      setUserName("diljit@gmail.com");
      setPassword("Diljit@123");
    } else {
      setUserName("");
      setPassword("");
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(userName)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: userName,
          password: password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateEmail(userName)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        // "Password must be 8+ characters with at least one number, one lowercase and one uppercase letter"
        "Password must be 8+ characters"
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName,
          lastName: lastName,
          emailId: userName,
          password: password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-base-100 py-10 px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-lg rounded-lg">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold text-center mb-4">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          {!isLoginForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${
                  isUsernameFocused && !validateEmail(userName)
                    ? "input-error"
                    : ""
                }`}
                placeholder="Email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                required
                disabled={useDemoCredentials}
              />
              {isUsernameFocused && !validateEmail(userName) && (
                <p className="text-error text-sm mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered w-full ${
                  isPasswordFocused &&
                  !isLoginForm &&
                  !validatePassword(password)
                    ? "input-error"
                    : ""
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                disabled={useDemoCredentials}
              />
              {isPasswordFocused && !isLoginForm && (
                <p
                  className={`text-sm mt-1 ${
                    validatePassword(password) ? "text-success" : "text-error"
                  }`}
                >
                  {validatePassword(password)
                    ? "Password meets requirements"
                    : "Must be 8+ characters"}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoginForm && (
            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={useDemoCredentials}
                  onChange={handleDemoCredentialsChange}
                />
                <span className="label-text">Use Demo Credentials</span>
              </label>
            </div>
          )}

          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary w-full"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  {isLoginForm ? "Logging in..." : "Signing up..."}
                </>
              ) : isLoginForm ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="text-center mt-4 space-y-2">
            <p
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError("");
                setUseDemoCredentials(false);
              }}
              className="link link-primary"
            >
              {isLoginForm
                ? "New User? Sign Up Here"
                : "Existing User? Login Here"}
            </p>
            {isLoginForm && (
              <Link to="/forgotPassword" className="link link-primary">
                Forgot Password?
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
