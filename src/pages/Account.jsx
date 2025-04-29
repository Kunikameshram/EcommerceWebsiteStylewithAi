import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountPage = () => {
  const userId = sessionStorage.getItem("userId");
  const [profile, setProfile] = useState({ name: "", email: "", preference: {} });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState({ profile: false, password: false });
  const [errors, setErrors] = useState({});
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccessToast, setShowSuccessToast] = useState({ profile: false, password: false });

  useEffect(() => {
    if (!userId) {
      setErrors({ global: "You must be logged in to view this page" });
      return;
    }
    fetchUserProfile();
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading((l) => ({ ...l, profile: true }));
      const res = await axios.get(`http://localhost:5001/api/auth/user/${userId}`, {
        withCredentials: true,
      });
      setProfile({
        name: res.data.username,
        email: res.data.email,
        preference: res.data.preference || {},
      });
      setLoading((l) => ({ ...l, profile: false }));
    } catch (err) {
      setErrors({ global: "Could not load profile information" });
      setLoading((l) => ({ ...l, profile: false }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profile.name.trim()) newErrors.name = "Username is required";
    if (!profile.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email))
      newErrors.email = "Email address is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!password.current) newErrors.currentPassword = "Current password is required";
    if (!password.new) newErrors.newPassword = "New password is required";
    else if (password.new.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (password.new !== password.confirm) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfile()) return;
    try {
      setLoading((l) => ({ ...l, profile: true }));
      await axios.post(
        "http://localhost:5001/api/auth/update-account",
        {
          user_id: userId,
          username: profile.name,
          email: profile.email,
          preference: profile.preference,
        },
        { withCredentials: true }
      );
      setLoading((l) => ({ ...l, profile: false }));
      setIsProfileChanged(false);
      setErrors({});
      setShowSuccessToast({ ...showSuccessToast, profile: true });
      setTimeout(() => setShowSuccessToast({ ...showSuccessToast, profile: false }), 3000);
    } catch (err) {
      setLoading((l) => ({ ...l, profile: false }));
      const errorMessage = err.response?.data?.message || "Update failed";
      setErrors({ global: errorMessage });
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;
    try {
      setLoading((l) => ({ ...l, password: true }));
      await axios.post(
        "http://localhost:5001/api/auth/reset-password",
        {
          user_id: userId,
          currentPassword: password.current,
          newPassword: password.new,
        },
        { withCredentials: true }
      );
      setLoading((l) => ({ ...l, password: false }));
      setPassword({ current: "", new: "", confirm: "" });
      setErrors({});
      setShowSuccessToast({ ...showSuccessToast, password: true });
      setTimeout(() => setShowSuccessToast({ ...showSuccessToast, password: false }), 3000);
    } catch (err) {
      setLoading((l) => ({ ...l, password: false }));
      const errorMessage = err.response?.data?.message || "Failed to change password";
      setErrors({ password: errorMessage });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsProfileChanged(true);
  };

  const handlePreferenceChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      preference: { ...prev.preference, [key]: value },
    }));
    setIsProfileChanged(true);
  };

  const Toast = ({ message, type = "success" }) => (
    <div className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg bg-white border-l-4 border-green-500 flex items-center z-50">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-gray-700">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account preferences and security</p>
        </div>

        {errors.global && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errors.global}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="sm:hidden">
            <select
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="profile">Profile Information</option>
              <option value="password">Password Settings</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "password"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password Settings
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.name
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="Your username"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.email
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Preferences</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        id="notify_email"
                        name="notify_email"
                        type="checkbox"
                        checked={profile.preference?.notify_email || false}
                        onChange={(e) => handlePreferenceChange("notify_email", e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notify_email" className="ml-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">Email Notifications</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="notify_sms"
                        name="notify_sms"
                        type="checkbox"
                        checked={profile.preference?.notify_sms || false}
                        onChange={(e) => handlePreferenceChange("notify_sms", e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notify_sms" className="ml-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">SMS Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleProfileUpdate}
                disabled={loading.profile || !isProfileChanged}
                className={`${
                  loading.profile || !isProfileChanged
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                } inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
              >
                {loading.profile ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Password Section */}
        {activeTab === "password" && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {errors.password && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                <div className="flex">
                  <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errors.password}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="current-password"
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                    className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.currentPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter your current password"
                  />
                </div>
                {errors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))}
                    className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.newPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter new password (min. 8 characters)"
                  />
                </div>
                {errors.newPassword ? (
                  <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                    className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.confirmPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Confirm your new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={loading.password}
                className={`${
                  loading.password
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                } inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
              >
                {loading.password ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing Password...
                  </>
                ) : (
                  <>Change Password</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-500">
          <p>&copy; 2025 StyleWithAI. All rights reserved.</p>
        </div>
      </div>

      {/* Success Toast Notifications */}
      {showSuccessToast.profile && (
        <Toast message="Profile updated successfully!" />
      )}
      {showSuccessToast.password && (
        <Toast message="Password changed successfully!" />
      )}
    </div>
  );
};

export default AccountPage;