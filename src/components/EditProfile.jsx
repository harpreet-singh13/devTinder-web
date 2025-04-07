import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoURL] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.photoUrl || "");

  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = async () => {
    setError("");
    try {
      setIsUploading(true);

      const formData = new FormData();

      // Append profile data
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (age) formData.append("age", age);
      if (gender) formData.append("gender", gender);
      if (about) formData.append("about", about);

      // Append file if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      console.log("Sending profile update with:", {
        firstName,
        lastName,
        age,
        gender,
        about,
        hasFile: !!selectedFile,
      });

      const res = await axios.patch(`${BASE_URL}/profile/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Profile update response:", res.data);

      // Update local state with new user data
      const updatedUser = res.data.data;
      dispatch(addUser(updatedUser));

      // Update photo URL if a new image was uploaded
      if (selectedFile) {
        setPhotoURL(updatedUser.photoUrl);
        setPreviewImage(updatedUser.photoUrl);
      }

      setToast(true);
      setSelectedFile(null);

      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Profile update failed:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "An error occurred while saving your profile"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-lg">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Your Profile
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Edit Form */}
          <div className="flex-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        First Name
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Last Name
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Profile Picture
                      </span>
                    </label>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Upload a new profile picture (JPEG, PNG, GIF)"}
                    </div>
                    {photoUrl && !selectedFile && (
                      <div className="mt-2 text-sm text-gray-500">
                        Current image:{" "}
                        <a
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          View
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Age</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Enter age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-semibold">Gender</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-semibold">About</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-32 w-full"
                      placeholder="Tell us about yourself..."
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
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

                <div className="card-actions justify-end mt-6">
                  <button
                    className="btn btn-primary w-full md:w-auto"
                    onClick={handleEditProfile}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Uploading...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Preview */}
          <div className="lg:w-96">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-center lg:text-center">
                Profile Preview
              </h2>
              <UserCard
                user={{
                  firstName,
                  lastName,
                  photoUrl: previewImage,
                  about,
                  age,
                  gender,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
