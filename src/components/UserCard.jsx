import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useState, useEffect, useRef } from "react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, about, age, gender } = user;
  const dispatch = useDispatch();
  const [showLike, setShowLike] = useState(false);
  const [showNope, setShowNope] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const handleRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  const [{ x, y, rotate, scale, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    config: config.stiff,
  }));

  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir], velocity, event }) => {
      // Prevent default to stop scrolling while dragging on mobile
      if (event && event.cancelable !== false) {
        event.preventDefault();
      }

      setIsDragging(down);

      const trigger = velocity > 0.2;
      const dir = xDir > 0 ? 1 : -1;

      // Calculate drag threshold and boundary
      const swipeThreshold = 100;
      const dragBoundary = 150;

      // Bounded movement to keep card visible
      const boundedMx = Math.max(Math.min(mx, dragBoundary), -dragBoundary);

      // Only show indicators when dragging beyond threshold
      setShowLike(down && boundedMx > 50);
      setShowNope(down && boundedMx < -50);

      if (!down && trigger && Math.abs(mx) > swipeThreshold) {
        // Swipe action confirmed - animate to the edge of screen
        api.start({
          x: dir * 500,
          rotate: dir * 20,
          opacity: 0,
          immediate: false,
          config: { duration: 300 },
        });

        // Process the swipe after animation
        setTimeout(() => {
          handleRequest(dir > 0 ? "interested" : "ignored", _id);

          // Reset the card state after processing
          api.start({
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            immediate: true,
          });

          setShowLike(false);
          setShowNope(false);
          setIsDragging(false);
        }, 300);
      } else {
        // Handle normal dragging with constraints
        api.start({
          x: down ? boundedMx : 0,
          y: down ? Math.max(Math.min(my, 50), -50) : 0, // Limit vertical movement more
          rotate: down ? boundedMx / 20 : 0,
          scale: down ? 1.05 : 1,
          opacity: 1,
          immediate: false,
        });

        if (!down) {
          setShowLike(false);
          setShowNope(false);
          setIsDragging(false);
        }
      }
    },
    {
      filterTaps: true,
      rubberband: true,
      delay: 0, // No delay for better touch response
      preventDefault: true,
      pointer: { touch: true }, // Ensure touch events are captured
      eventOptions: { passive: false }, // Important for preventing default on mobile
    }
  );

  // Add touch event listener to prevent scrolling while dragging
  useEffect(() => {
    const preventDefaultTouch = (e) => {
      if (isDragging && e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, [isDragging]);

  return (
    <div className="flex justify-center items-center w-full h-full px-4 py-4 touch-none">
      {/* Like/Nope indicators */}
      {isDragging && showLike && (
        <div className="absolute top-8 right-8 z-10 bg-green-500/20 backdrop-blur-sm p-3 rounded-full shadow-lg">
          <span className="text-green-500 font-bold text-3xl">👍</span>
        </div>
      )}
      {isDragging && showNope && (
        <div className="absolute top-8 left-8 z-10 bg-red-500/20 backdrop-blur-sm p-3 rounded-full shadow-lg">
          <span className="text-red-500 font-bold text-3xl">👎</span>
        </div>
      )}

      <div
        ref={cardRef}
        className="w-full max-w-sm sm:max-w-md h-[85vh] max-h-[650px] relative "
      >
        <animated.div
          {...bind()}
          style={{
            x,
            y,
            rotate,
            scale,
            opacity,
            touchAction: "none", // Prevent browser handling of all panning and zooming gestures
          }}
          className="card w-full bg-base-300 rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing h-full absolute touch-pan-y"
        >
          {/* Profile Image - Fixed height */}
          <figure className="select-none pointer-events-none aspect-[3/4]">
            <img
              src={photoUrl}
              alt="photo"
              className="rounded-t-lg w-full h-full object-cover select-none pointer-events-none"
            />
          </figure>

          {/* Profile Details - Fixed height with text truncation */}
          <div className="p-5 h-[35%] min-h-[35%] max-h-[35%] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold truncate">
                {firstName} {lastName}
              </h2>
              {(age || gender) && (
                <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
                  {age}
                  {age && gender && ", "}
                  {gender}
                </span>
              )}
            </div>

            <div className="flex-grow overflow-hidden">
              <p className="text-gray-600 text-sm line-clamp-4 break-words">
                {about}
              </p>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default UserCard;
