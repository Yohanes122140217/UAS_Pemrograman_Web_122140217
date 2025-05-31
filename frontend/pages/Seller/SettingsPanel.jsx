import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, Info, CheckCircle, XCircle } from 'lucide-react'; // Lucide icons

function SettingsPanel() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Stores fetched user data
    const [loading, setLoading] = useState(true); // For initial data fetch
    const [error, setError] = useState(null); // General error for fetching user data

    // --- Profile Settings State ---
    const [profileFormData, setProfileFormData] = useState({
        username: '',
        email: '',
    });
    const [profileErrors, setProfileErrors] = useState({}); // Specific errors for profile form
    const [profileSuccessMessage, setProfileSuccessMessage] = useState(''); // Success message for profile form
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false); // Loading state for profile update

    // --- Password Settings State ---
    const [passwordFormData, setPasswordFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({}); // Specific errors for password form
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(''); // Success message for password form
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false); // Loading state for password update

    // --- Delete Account State ---
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Controls delete modal visibility
    const [isDeletingAccount, setIsDeletingAccount] = useState(false); // Loading state for account deletion


    // Effect to fetch user profile data on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required. Please log in.');
            navigate('/login');
            setLoading(false);
            return;
        }

        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null); // Clear any previous general errors
            try {
                const response = await fetch('http://localhost:6543/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch user profile.');
                }
                const data = await response.json();
                setUser(data);
                setProfileFormData({ // Populate form with fetched data
                    username: data.username || '',
                    email: data.email || '',
                });
            } catch (e) {
                console.error("Error fetching user profile:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]); // navigate is a dependency of useEffect

    // --- Handlers for Profile Form ---
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
        setProfileErrors(prev => ({ ...prev, [name]: '' })); // Clear specific field error on change
        setProfileSuccessMessage(''); // Clear success message on change
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingProfile(true);
        setProfileErrors({}); // Clear all previous errors
        setProfileSuccessMessage(''); // Clear previous success message

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required. Please log in.');
            navigate('/login');
            setIsSubmittingProfile(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:6543/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check if the error object has an 'errors' key from Marshmallow validation
                if (errorData.errors) {
                    setProfileErrors(errorData.errors); // Set field-specific errors
                } else if (errorData.error) {
                    // Handle general errors (e.g., from backend validation like duplicate username/email)
                    setProfileErrors({ form: errorData.error });
                } else {
                    throw new Error('Failed to update profile.');
                }
                return; // Stop execution if there are errors
            }

            const updatedUser = await response.json();
            setUser(updatedUser); // Update the main user state with new data
            setProfileSuccessMessage('Profile updated successfully!');

        } catch (err) {
            console.error("Profile update error:", err);
            // Catch network errors or errors thrown above
            setProfileErrors(prev => ({ ...prev, form: err.message || 'An unexpected error occurred.' }));
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    // --- Handlers for Password Form ---
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({ ...prev, [name]: value }));
        setPasswordErrors(prev => ({ ...prev, [name]: '' })); // Clear specific field error on change
        setPasswordSuccessMessage(''); // Clear success message on change
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingPassword(true);
        setPasswordErrors({}); // Clear all previous errors
        setPasswordSuccessMessage(''); // Clear previous success message

        if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
            setPasswordErrors(prev => ({ ...prev, confirm_new_password: 'New passwords do not match.' }));
            setIsSubmittingPassword(false);
            return;
        }
        if (!passwordFormData.current_password || !passwordFormData.new_password) {
             setPasswordErrors(prev => ({ ...prev, form: 'All password fields are required.' }));
             setIsSubmittingPassword(false);
             return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required. Please log in.');
            navigate('/login');
            setIsSubmittingPassword(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:6543/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: passwordFormData.current_password,
                    new_password: passwordFormData.new_password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                 if (errorData.errors) {
                    setPasswordErrors(errorData.errors); // Set field-specific errors
                } else if (errorData.error) {
                    setPasswordErrors({ form: errorData.error });
                } else {
                    throw new Error('Failed to update password.');
                }
                return;
            }

            setPasswordSuccessMessage('Password updated successfully!');
            setPasswordFormData({ // Clear password fields on success
                current_password: '',
                new_password: '',
                confirm_new_password: '',
            });

        } catch (err) {
            console.error("Password update error:", err);
            setPasswordErrors(prev => ({ ...prev, form: err.message || 'An unexpected error occurred.' }));
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    // --- Handlers for Delete Account ---
    const handleDeleteAccountClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAccount = async () => {
        setIsDeletingAccount(true);
        setError(null); // Clear general error

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required. Please log in.');
            navigate('/login');
            setIsDeletingAccount(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:6543/api/user/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) { // 204 No Content is the expected success for DELETE
                alert('Your account has been successfully deleted.');
                localStorage.removeItem('token'); // Clear token on successful deletion
                navigate('/login'); // Redirect to login or home page
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete account: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Account deletion error:", err);
            setError(err.message || 'An unexpected error occurred during account deletion.');
            alert(`Error deleting account: ${err.message || 'Please try again.'}`);
        } finally {
            setIsDeletingAccount(false);
            setShowDeleteConfirm(false); // Close modal
        }
    };


    if (loading) return <p className="text-center py-6 text-gray-600">Loading profile settings...</p>;
    if (error) return <p className="text-center py-6 text-red-600">Error: {error}</p>;
    if (!user) return <p className="text-center py-6 text-gray-600">No user data found.</p>;


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans text-gray-900">
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-600">Manage your profile information, password, and account.</p>

            {/* --- Profile Settings Section --- */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <User size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                        <p className="text-gray-500 text-sm">Update your username and email address.</p>
                    </div>
                </div>

                {profileErrors.form && (
                    <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-md flex items-center">
                        <XCircle size={18} className="mr-2" />
                        {profileErrors.form}
                    </div>
                )}
                {profileSuccessMessage && (
                    <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center">
                        <CheckCircle size={18} className="mr-2" />
                        {profileSuccessMessage}
                    </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileFormData.username}
                            onChange={handleProfileChange}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                                profileErrors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Your unique username"
                            required
                        />
                        {profileErrors.username && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {profileErrors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                                profileErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="your.email@example.com"
                            required
                        />
                        {profileErrors.email && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {profileErrors.email}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmittingProfile}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>

            {/* --- Change Password Section --- */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Lock size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                        <p className="text-gray-500 text-sm">Update your account password.</p>
                    </div>
                </div>

                {passwordErrors.form && (
                    <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-md flex items-center">
                        <XCircle size={18} className="mr-2" />
                        {passwordErrors.form}
                    </div>
                )}
                {passwordSuccessMessage && (
                    <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center">
                        <CheckCircle size={18} className="mr-2" />
                        {passwordSuccessMessage}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current_password"
                            name="current_password"
                            value={passwordFormData.current_password}
                            onChange={handlePasswordChange}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                                passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your current password"
                            required
                        />
                        {passwordErrors.current_password && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {passwordErrors.current_password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={passwordFormData.new_password}
                            onChange={handlePasswordChange}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                                passwordErrors.new_password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your new password"
                            required
                        />
                        {passwordErrors.new_password && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {passwordErrors.new_password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirm_new_password"
                            name="confirm_new_password"
                            value={passwordFormData.confirm_new_password}
                            onChange={handlePasswordChange}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                                passwordErrors.confirm_new_password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Confirm your new password"
                            required
                        />
                        {passwordErrors.confirm_new_password && (
                            <p className="mt-1 text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {passwordErrors.confirm_new_password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmittingPassword}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingPassword ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>

            {/* --- Delete Account Section --- */}
            <div className="bg-white rounded-lg shadow-md border border-red-300 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Trash2 size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
                        <p className="text-gray-500 text-sm">Permanently delete your account and all associated data.</p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-5 flex items-start space-x-3">
                    <Info size={18} className="text-red-600 flex-shrink-0 mt-1" />
                    <p className="text-red-800 text-sm">
                        Deleting your account is irreversible. All your data, including products and orders, will be permanently removed.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDeleteAccountClick}
                    disabled={isDeletingAccount}
                    className="bg-gray-200 hover:bg-gray-300 text-red-700 font-semibold px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeletingAccount ? 'Deleting Account...' : 'Delete My Account'}
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Account Deletion</h2>
                        <p className="text-gray-700 mb-6">
                            Are you absolutely sure you want to delete your account? This action is irreversible and will delete all your products and associated data.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                disabled={isDeletingAccount}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                disabled={isDeletingAccount}
                            >
                                {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsPanel;