import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setButtonDisabled(true);
    setIsLoading(true);

    try {
      const response = await axios.post(
        BASE_URL + "/forgotPassword",
        {
          emailId: email,
        },
        { withCredentials: true }
      );

      console.log(response);

      toast.success("Email sent successfully. Please check your inbox.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setCountdown(30);

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            setButtonDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } catch (error) {
      console.log("Error sending reset email: " + error.message);
      toast.error("Failed to send reset email. Please try again.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-base-100 py-10 px-4">
        <div className="card bg-base-300 w-full max-w-md shadow-lg rounded-lg">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold text-center">
              Forgot Password
            </h2>
            <div className="space-y-4 mt-6">
              <div>
                <input
                  type="email"
                  className={`input w-full p-3 border ${
                    isEmailFocused && !validateEmail(email)
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                {isEmailFocused && !validateEmail(email) && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
            </div>
            <div className="card-actions justify-center mt-6">
              <button
                className={`btn btn-primary w-full py-3 rounded transition duration-300 flex items-center justify-center ${
                  buttonDisabled || !validateEmail(email) || isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                onClick={handleForgotPassword}
                disabled={buttonDisabled || !validateEmail(email) || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : buttonDisabled ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Send reset link"
                )}
              </button>
            </div>
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 cursor-pointer hover:underline transition duration-300"
              >
                Remember Password? Login Here
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
