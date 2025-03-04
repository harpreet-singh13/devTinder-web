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
  const [isLoading, setIsLoading] = useState(false); // New state for loading

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

    // Disable the button and set loading state
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

      setCountdown(30); // Set the countdown to 30 seconds

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            setButtonDisabled(false); // Re-enable the button after countdown
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
      setIsLoading(false); // Re-enable the button after API call completes
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
      <div className="flex items-center justify-center min-h-48 bg-base-100 my-20">
        <div className="card bg-base-300 w-96 shadow-lg rounded-lg">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl font-bold">Forgot Password</h2>
            <div className="space-y-4 mt-4">
              <input
                type="email"
                className={`input w-full p-2 border ${
                  isEmailFocused && !validateEmail(email)
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
              {isEmailFocused && !validateEmail(email) && (
                <p className="text-red-500 text-sm">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <div className="card-actions justify-center mt-6">
              <button
                className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                onClick={handleForgotPassword}
                disabled={buttonDisabled || !validateEmail(email) || isLoading} // Disable during loading or countdown
              >
                {isLoading
                  ? "Sending..."
                  : buttonDisabled
                  ? `Resend in ${countdown}s`
                  : "Send reset link"}
              </button>
            </div>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-blue-500 cursor-pointer hover:underline"
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
