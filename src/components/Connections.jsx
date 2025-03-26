import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMessageSquare, FiUser, FiUsers } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="my-10 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FiUsers className="text-2xl text-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Your Connections</h1>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4 p-4 rounded-xl bg-base-300">
            <div className="flex items-center space-x-4">
              <Skeleton circle width={72} height={72} />
              <div className="flex-1">
                <Skeleton width={180} height={20} className="mb-2" />
                <Skeleton width={120} height={16} className="mb-1" />
                <Skeleton width={240} height={16} />
              </div>
              <Skeleton width={80} height={40} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh]"
      >
        <div className="bg-base-300 p-8 rounded-2xl text-center max-w-md mx-4">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Connections Yet
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't connected with anyone yet. Start building your network!
          </p>
          <Link
            to="/"
            className="btn btn-primary rounded-full px-6 animate-pulse"
          >
            Discover People
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="my-10 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mb-8"
      >
        <FiUsers className="text-2xl text-primary mr-2" />
        <h1 className="text-2xl font-bold text-white">Your Connections</h1>
      </motion.div>

      <div className="grid gap-4">
        {connections
          .filter((connection) => connection && connection._id) // Filter out invalid connections
          .map((connection, index) => {
            const {
              _id,
              photoUrl = "",
              firstName = "",
              lastName = "",
              gender,
              age,
              about,
            } = connection || {};

            return (
              <motion.div
                key={_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-base-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row p-4 sm:p-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <div className="relative">
                      <img
                        src={photoUrl || "/default-avatar.png"}
                        alt={`${firstName}'s profile`}
                        className="rounded-full h-16 w-16 sm:h-20 sm:w-20 object-cover border-2 border-primary"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-base-300"></div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {firstName} {lastName}
                        </h2>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          {age && <span>{age} years</span>}
                          {age && gender && <span className="mx-2">•</span>}
                          {gender && <span>{gender}</span>}
                        </div>
                      </div>
                      <Link
                        to={"/chat/" + _id}
                        className="mt-4 sm:mt-0 inline-block"
                      >
                        <button className="btn btn-primary btn-sm sm:btn-md rounded-full px-6 flex items-center gap-2">
                          <FiMessageSquare />
                          <span>Chat</span>
                        </button>
                      </Link>
                    </div>

                    {about && (
                      <p className="mt-3 text-gray-300 line-clamp-2">{about}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default Connections;
