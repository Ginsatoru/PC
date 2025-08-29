import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { Camera, User } from "lucide-react";

const ProfileSection = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Refresh user data if old profile pic path is detected
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const response = await api.get("/auth/profile");
        if (response.data.success) {
          updateUser(response.data.user);
          setImageError(false);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    };

    if (
      user?.profilePic &&
      user.profilePic.includes("/uploads/profile-") &&
      !user.profilePic.includes("/uploads/users/")
    ) {
      refreshUserData();
    }
  }, [user?.profilePic, updateUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      setProfilePic(file);
      setImageError(false);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePic(null);
    setPreviewUrl(null);
    setImageError(false);
    const fileInput = document.getElementById("profilePic");
    if (fileInput) fileInput.value = "";
  };

  const getCurrentProfilePicUrl = () => {
    if (previewUrl) {
      return previewUrl;
    }

    if (user?.profilePic && !imageError) {
      if (
        user.profilePic.startsWith("http://") ||
        user.profilePic.startsWith("https://")
      ) {
        return user.profilePic;
      } else if (user.profilePic.startsWith("/")) {
        return `${import.meta.env.VITE_API_URL}${user.profilePic}`;
      } else {
        return `${import.meta.env.VITE_API_URL}/${user.profilePic}`;
      }
    }

    return null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const cleanedAddress = {
      street: profileForm.address.street?.trim() || "",
      city: profileForm.address.city?.trim() || "",
      state: profileForm.address.state?.trim() || "",
      zipCode: profileForm.address.zipCode?.trim() || "",
      country: profileForm.address.country?.trim() || "",
    };

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", profileForm.name);
      formDataToSend.append("email", profileForm.email);
      formDataToSend.append("phone", profileForm.phone?.trim() || "");
      formDataToSend.append("address", JSON.stringify(cleanedAddress));

      if (profilePic) {
        formDataToSend.append("profilePic", profilePic);
      }

      const response = await api.put("/auth/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data) {
        if (response.data.success) {
          updateUser(response.data.user);
          setImageError(false);
          alert("Profile updated successfully!");

          setProfilePic(null);
          setPreviewUrl(null);
          const fileInput = document.getElementById("profilePic");
          if (fileInput) fileInput.value = "";
        } else {
          alert(response.data.message || "Profile update failed");
        }
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          alert(`Validation errors: ${errorData.errors.join(", ")}`);
        } else if (errorData?.message) {
          alert(errorData.message);
        } else {
          alert(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        alert("Network error - please check your connection");
      } else {
        alert(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Password updated successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Profile Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Profile Picture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>

            <div className="flex items-center space-x-4">
              {/* Current/Preview Image */}
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {getCurrentProfilePicUrl() && !imageError ? (
                  <img
                    src={getCurrentProfilePicUrl()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Upload/Remove Buttons */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="profilePic"
                  className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Camera className="w-4 h-4" />
                  Change Photo
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {(getCurrentProfilePicUrl() || previewUrl) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Max size: 5MB. Supported: JPEG, PNG, GIF, WebP
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">Address</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={profileForm.address.street}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    address: { ...profileForm.address, street: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={profileForm.address.city}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, city: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={profileForm.address.state}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      address: {
                        ...profileForm.address,
                        state: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={profileForm.address.zipCode}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      address: {
                        ...profileForm.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={profileForm.address.country}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      address: {
                        ...profileForm.address,
                        country: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 transition duration-200"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;
