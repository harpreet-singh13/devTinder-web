import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaHeart,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

// const SwipeInstructions = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed bottom-8 left-0 right-0 flex justify-center"
//     >
//       <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
//         <div className="flex items-center gap-2">
//           <FaTimes className="text-red-400 text-xl" />
//           <span className="hidden sm:inline text-white font-medium">
//             Swipe left
//           </span>
//           <FaHandPointLeft className="text-white animate-pulse text-xl sm:hidden" />
//         </div>

//         <div className="h-8 w-px bg-white/30"></div>

//         <div className="flex items-center gap-2">
//           <FaHeart className="text-green-400 text-xl" />
//           <span className="hidden sm:inline text-white font-medium">
//             Swipe right
//           </span>
//           <FaHandPointRight className="text-white animate-pulse text-xl sm:hidden" />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

const SwipeInstructions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", damping: 10 }}
      className="fixed bottom-6 left-0 right-0 flex justify-center z-10"
    >
      <div className="flex items-center gap-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-full px-8 py-3 shadow-xl border border-white/20">
        {/* 👈 Left Swipe (Reject) */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2 group"
        >
          <div className="p-2 bg-red-500/20 rounded-full group-hover:bg-red-500/30 transition-all">
            <FaTimes className="text-red-400 text-xl" />
          </div>
          <div className="hidden md:flex flex-col items-center">
            <span className="text-white/80 text-sm">Swipe</span>
            <span className="text-white font-semibold">Left</span>
          </div>
          <FaArrowLeft className="text-white/70 animate-bounce md:hidden" />
        </motion.div>

        {/* ✨ Middle Divider */}
        <div className="h-6 w-px bg-white/30 rotate-12"></div>

        {/* 👉 Right Swipe (Like) */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2 group"
        >
          <div className="hidden md:flex flex-col items-center">
            <span className="text-white/80 text-sm">Swipe</span>
            <span className="text-white font-semibold">Right</span>
          </div>
          <div className="p-2 bg-green-500/20 rounded-full group-hover:bg-green-500/30 transition-all">
            <FaHeart className="text-green-400 text-xl" />
          </div>
          <FaArrowRight className="text-white/70 animate-bounce md:hidden" />
        </motion.div>
      </div>
    </motion.div>
  );
};
const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const getFeed = async () => {
    if (feed) return;

    if (!user) {
      navigate("/login");
    }
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl md:text-3xl text-center my-10 px-4">
          No new users are available!
        </h1>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* ✨ User Card with Drag Animation */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className="w-full max-w-md cursor-grab active:cursor-grabbing"
      >
        <UserCard user={feed[0]} isDragging={isDragging} />
      </motion.div>

      {/* ✨ Swipe Instructions */}
      <SwipeInstructions />

      {/* ✨ Floating Hint (Only on first visit) */}
      {!localStorage.getItem("hasSeenSwipeHint") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-20 text-white/60 text-sm"
        >
          Drag the card left or right
        </motion.div>
      )}
    </div>
  );
};

export default Feed;
