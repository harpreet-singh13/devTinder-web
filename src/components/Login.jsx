import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ImSpinner8 } from "react-icons/im"; // For loading spinner

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle login
  const handleLogin = async () => {
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

  // Handle signup
  const handleSignUp = async () => {
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
    <div className="flex items-center justify-center min-h-48 bg-base-100 my-20">
      <div className="card bg-base-300 w-96 shadow-lg rounded-lg">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold text-center mb-4">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          {!isLoginForm && (
            <>
              <div className="space-y-4">
                <input
                  type="text"
                  className="input w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  className="input w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-4 mt-4">
            <input
              type="email"
              className={`input w-full p-2 border ${
                isUsernameFocused && !validateEmail(userName)
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:border-blue-500`}
              placeholder="Email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            />
            {isUsernameFocused && !validateEmail(userName) && (
              <p className="text-red-500 text-sm">
                Please enter a valid email address.
              </p>
            )}

            <input
              type="password"
              className="input w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            {isPasswordFocused && (
              <p className="text-gray-600 text-sm">
                Must be 8+ characters, including a number, lowercase, and
                uppercase letter.
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ImSpinner8 className="animate-spin mr-2" />
              ) : isLoginForm ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              {isLoginForm
                ? "New User? Sign Up Here"
                : "Existing User? Login Here"}
            </p>
            {isLoginForm && (
              <Link to="/forgotPassword">
                <p className="text-blue-500 cursor-pointer hover:underline mt-2">
                  Forgot Password?
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
