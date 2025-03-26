import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useState } from "react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, about, age, gender } = user;
  const dispatch = useDispatch();
  const [showLike, setShowLike] = useState(false);
  const [showNope, setShowNope] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    ({ down, movement: [mx, my], direction: [xDir], velocity }) => {
      setIsDragging(down);

      const trigger = velocity > 0.2;
      const dir = xDir > 0 ? 1 : -1;

      // Only show indicators when dragging and beyond threshold
      setShowLike(down && mx > 50);
      setShowNope(down && mx < -50);

      if (!down && trigger && Math.abs(mx) > 100) {
        // Swipe action confirmed
        api.start({
          x: dir * 500,
          rotate: dir * 20,
          opacity: 0,
          immediate: false,
        });
        setTimeout(() => {
          handleRequest(dir > 0 ? "interested" : "ignored", _id);
          api.start({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
          setShowLike(false);
          setShowNope(false);
          setIsDragging(false);
        }, 300);
      } else {
        // Dragging or returning to center
        api.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          rotate: down ? mx / 20 : 0,
          scale: down ? 1.05 : 1,
          opacity: down ? 0.5 : 1,
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
      preventDefault: true,
    }
  );

  return (
    <div className="flex justify-center items-center w-full h-full px-4 py-4">
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

      <animated.div
        {...bind()}
        style={{
          x,
          y,
          rotate,
          scale,
          opacity,
          touchAction: "none",
        }}
        className="card w-full max-w-sm sm:max-w-md bg-base-300 rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing h-[85vh] max-h-[650px]"
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
  );
};

export default UserCard;
