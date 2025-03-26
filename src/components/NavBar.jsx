import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { emptyFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaUserFriends,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(emptyFeed());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 } }),
  };

  return (
    <motion.div
      className={`navbar sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-base-300/90 backdrop-blur-sm shadow-lg" : "bg-base-300"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 flex justify-between">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost px-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <img src="/devLink.svg" alt="logo" className="w-8 md:w-10" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                DevLink
              </span>
            </motion.div>
          </Link>
        </div>

        {user && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <motion.p
                className="text-sm md:text-base font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Welcome, <span className="text-primary">{user.firstName}</span>
              </motion.p>

              <div className="dropdown dropdown-end">
                <motion.div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                    <img alt="user profile pic" src={user.photoUrl} />
                  </div>
                </motion.div>

                <motion.ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4"
                  initial="hidden"
                  animate="visible"
                  variants={menuVariants}
                >
                  <motion.li variants={itemVariants} custom={0}>
                    <Link to="/profile" className="flex items-center gap-2">
                      <FaUser className="text-primary" />
                      Profile
                      <span className="badge badge-primary">New</span>
                    </Link>
                  </motion.li>
                  <motion.li variants={itemVariants} custom={1}>
                    <Link to="/connections" className="flex items-center gap-2">
                      <FaUserFriends className="text-secondary" />
                      Connections
                    </Link>
                  </motion.li>
                  <motion.li variants={itemVariants} custom={2}>
                    <Link to="/requests" className="flex items-center gap-2">
                      <FaBell className="text-accent" />
                      Requests
                    </Link>
                  </motion.li>
                  <motion.li variants={itemVariants} custom={3}>
                    <a
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-error"
                    >
                      <FaSignOutAlt />
                      Logout
                    </a>
                  </motion.li>
                </motion.ul>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                className="btn btn-ghost btn-circle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="md:hidden fixed inset-0 bg-black/50 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={toggleMenu}
                >
                  <motion.div
                    className="absolute top-16 right-4 bg-base-100 rounded-box shadow-xl w-64 overflow-hidden"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-base-200 flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring-2 ring-primary">
                          <img src={user.photoUrl} alt="Profile" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{user.firstName}</p>
                        <p className="text-sm opacity-70">@{user.username}</p>
                      </div>
                    </div>

                    <ul className="menu p-2">
                      {[
                        {
                          icon: <FaUser />,
                          text: "Profile",
                          to: "/profile",
                          badge: true,
                        },
                        {
                          icon: <FaUserFriends />,
                          text: "Connections",
                          to: "/connections",
                        },
                        { icon: <FaBell />, text: "Requests", to: "/requests" },
                        {
                          icon: <FaSignOutAlt />,
                          text: "Logout",
                          action: handleLogout,
                          className: "text-error",
                        },
                      ].map((item, index) => (
                        <motion.li
                          key={item.text}
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          className={item.className}
                        >
                          {item.to ? (
                            <Link
                              to={item.to}
                              className="flex items-center gap-2"
                              onClick={toggleMenu}
                            >
                              {item.icon}
                              {item.text}
                              {item.badge && (
                                <span className="badge badge-primary">New</span>
                              )}
                            </Link>
                          ) : (
                            <a
                              onClick={() => {
                                item.action?.();
                                toggleMenu();
                              }}
                              className="flex items-center gap-2"
                            >
                              {item.icon}
                              {item.text}
                            </a>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NavBar;
