import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });

    const [themeData, setThemeData] = useState({
        backgroundColor: user?.theme?.backgroundColor || '#ffffff',
        buttonColor: user?.theme?.buttonColor || '#3b82f6',
        textColor: user?.theme?.textColor || '#1f2937',
        buttonTextColor: user?.theme?.buttonTextColor || '#ffffff',
        style: user?.theme?.style || 'default',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.updateProfile(profileData);
            if (response.success) {
                updateUser(response.data.user);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleThemeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.updateProfile({ theme: themeData });
            if (response.success) {
                updateUser(response.data.user);
                toast.success('Theme updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update theme');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.success) {
                toast.success('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const applyPreset = (preset) => {
        const presets = {
            default: {
                backgroundColor: '#ffffff',
                buttonColor: '#3b82f6',
                textColor: '#1f2937',
                buttonTextColor: '#ffffff',
                style: 'default',
            },
            dark: {
                backgroundColor: '#1f2937',
                buttonColor: '#60a5fa',
                textColor: '#f9fafb',
                buttonTextColor: '#1f2937',
                style: 'dark',
            },
            colorful: {
                backgroundColor: '#fef3c7',
                buttonColor: '#f59e0b',
                textColor: '#78350f',
                buttonTextColor: '#ffffff',
                style: 'colorful',
            },
        };

        setThemeData(presets[preset]);
    };

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'theme', label: 'Theme' },
        { id: 'password', label: 'Password' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your public profile will be at: /{profileData.username}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plan
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium capitalize">
                                            {user?.plan}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        )}

                        {/* Theme Tab */}
                        {activeTab === 'theme' && (
                            <form onSubmit={handleThemeSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Theme Presets
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => applyPreset('default')}
                                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 text-center"
                                        >
                                            <div className="w-full h-12 bg-white border border-gray-300 rounded mb-2"></div>
                                            <span className="text-sm font-medium">Default</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyPreset('dark')}
                                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 text-center"
                                        >
                                            <div className="w-full h-12 bg-gray-800 rounded mb-2"></div>
                                            <span className="text-sm font-medium">Dark</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyPreset('colorful')}
                                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 text-center"
                                        >
                                            <div className="w-full h-12 bg-amber-100 rounded mb-2"></div>
                                            <span className="text-sm font-medium">Colorful</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Background Color
                                        </label>
                                        <input
                                            type="color"
                                            value={themeData.backgroundColor}
                                            onChange={(e) => setThemeData({ ...themeData, backgroundColor: e.target.value })}
                                            className="w-full h-10 rounded border border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Button Color
                                        </label>
                                        <input
                                            type="color"
                                            value={themeData.buttonColor}
                                            onChange={(e) => setThemeData({ ...themeData, buttonColor: e.target.value })}
                                            className="w-full h-10 rounded border border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Text Color
                                        </label>
                                        <input
                                            type="color"
                                            value={themeData.textColor}
                                            onChange={(e) => setThemeData({ ...themeData, textColor: e.target.value })}
                                            className="w-full h-10 rounded border border-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Button Text Color
                                        </label>
                                        <input
                                            type="color"
                                            value={themeData.buttonTextColor}
                                            onChange={(e) => setThemeData({ ...themeData, buttonTextColor: e.target.value })}
                                            className="w-full h-10 rounded border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Theme'}
                                </button>
                            </form>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
