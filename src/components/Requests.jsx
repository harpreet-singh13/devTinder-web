import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { motion } from "framer-motion";
import { FiUserPlus, FiUserX, FiUserCheck } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (error) {
      console.log(error);
    }
  };

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="my-10 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FiUserPlus className="text-2xl text-primary mr-2" />
          <h1 className="text-2xl font-bold text-white">Connection Requests</h1>
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
              <div className="flex gap-2">
                <Skeleton width={80} height={40} />
                <Skeleton width={80} height={40} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh]"
      >
        <div className="bg-base-300 p-8 rounded-2xl text-center max-w-md mx-4">
          <FiUserPlus className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Pending Requests
          </h2>
          <p className="text-gray-400 mb-6">
            You don't have any connection requests at the moment.
          </p>
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
        <FiUserPlus className="text-2xl text-primary mr-2" />
        <h1 className="text-2xl font-bold text-white">Connection Requests</h1>
      </motion.div>

      <div className="grid gap-4">
        {requests.map((request, index) => {
          // Check if fromUserId exists
          if (!request.fromUserId) return null; // or handle differently

          const { _id, photoUrl, firstName, lastName, gender, age, about } =
            request.fromUserId;
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
                    <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full w-4 h-4 border-2 border-base-300"></div>
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
                  </div>

                  {about && (
                    <p className="mt-3 text-gray-300 line-clamp-2">{about}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:ml-4">
                  <button
                    onClick={() => reviewRequest("rejected", request._id)}
                    className="btn btn-outline btn-error rounded-full px-6 flex items-center gap-2"
                  >
                    <FiUserX />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", request._id)}
                    className="btn btn-primary rounded-full px-6 flex items-center gap-2"
                  >
                    <FiUserCheck />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
