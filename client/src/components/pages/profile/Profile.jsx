import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditModalProfile from "../../sub/EditModalProfile";
import DeleteModalProfile from "../../sub/DeleteModalProfile";
import { UserContext } from "../../../../context/UserContext";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editProfile, seteditProfile] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useContext(UserContext);

  const handleEdit = () => seteditProfile(true);
  const handleDelete = () => setDeleteProfile(true);
  const handleCancel = () => {
    seteditProfile(false);
    setDeleteProfile(false);
  };
  const deleteUser = async () => {
    handleCancel(true);
    setLoading(true);
    await axios.delete(`${process.env.API_URL}/users/${id}`);
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!id || id === "undefined") {
      navigate("/");
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/users/${id}`);
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-fuchsia-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">
          Unable to fetch user profile.
        </p>
        <button
          className="mt-5 bg-fuchsia-500 text-white px-4 py-2 rounded-lg"
          onClick={handleBack}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <p className="z-20 mb-4 text-lg text-gray-700">
            Thank you for joining us! Please wait while we redirect 🙂
          </p>
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-fuchsia-500"
            aria-label="Loading"
          ></div>
        </div>
      )}
      <div className="flex flex-col items-center py-10 min-h-screen bg-gray-100">
        <button
          className="bg-fuchsia-500 text-white hover:bg-fuchsia-600 px-5 py-2 mb-5 rounded-lg transition-all shadow-md"
          onClick={handleBack}
        >
          Back
        </button>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full flex flex-col lg:flex-row gap-10 items-center lg:items-start">
          {editProfile && <EditModalProfile close={handleCancel} />}
          {deleteProfile && (
            <DeleteModalProfile close={handleCancel} onDelete={deleteUser} />
          )}
          {userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt={`${userProfile.firstName}'s avatar`}
              className="w-48 h-48 rounded-full shadow-md border-4 border-fuchsia-500"
            />
          ) : (
            <div className="w-48 h-48 rounded-full shadow-md border-4 border-fuchsia-500 flex items-center justify-center bg-gray-200 text-fuchsia-500 font-bold text-2xl">
              {userProfile.firstName[0]}
              {userProfile.lastName[0]}
            </div>
          )}
          <div className="flex flex-col text-lg space-y-4 w-full">
            {[
              {
                label: "Name",
                value: `${userProfile.firstName} ${userProfile.lastName}`,
              },
              { label: "Email", value: userProfile.email },
              { label: "Role", value: userProfile.role },
              {
                label: "Created At",
                value: new Date(userProfile.createdAt).toDateString(),
              },
              {
                label: "Updated At",
                value: new Date(userProfile.updatedAt).toDateString(),
              },
              userProfile.resume_link
                ? {
                    label: "Contact",
                    value: userProfile.phone || "Not Available",
                    valueClass: userProfile.phone
                      ? "text-gray-800"
                      : "text-red-500",
                  }
                : {},
            ].map(({ label, value, valueClass }, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                {label && value && (
                  <>
                    <strong className="text-gray-600">{label}:</strong>
                    <p className={valueClass || "text-gray-800"}>{value}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          {currentUser.id == id && (
            <div className="flex flex-col justify-between h-full space-y-4">
              <button
                className="py-2 px-6 bg-lime-500 text-white rounded-lg shadow hover:bg-lime-600 transition-all"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="py-2 px-6 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
