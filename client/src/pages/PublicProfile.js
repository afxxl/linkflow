import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/${username}`);
            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'User not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const theme = profile?.user?.theme || {};
    const backgroundColor = theme.backgroundColor || '#ffffff';
    const buttonColor = theme.buttonColor || '#3b82f6';
    const textColor = theme.textColor || '#1f2937';
    const buttonTextColor = theme.buttonTextColor || '#ffffff';

    return (
        <div
            className="min-h-screen py-12 px-4"
            style={{ backgroundColor }}
        >
            <div className="max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="text-center mb-12">
                    <div className="mb-4">
                        <div
                            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl font-bold"
                            style={{
                                backgroundColor: buttonColor,
                                color: buttonTextColor,
                            }}
                        >
                            {profile?.user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: textColor }}
                    >
                        @{profile?.user?.username}
                    </h1>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    {profile?.links && profile.links.length > 0 ? (
                        profile.links.map((link) => (
                            <a
                                key={link._id}
                                href={`${API_URL}/r/${link._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-4 rounded-lg font-medium text-center transition-all transform hover:scale-105 hover:shadow-lg"
                                style={{
                                    backgroundColor: buttonColor,
                                    color: buttonTextColor,
                                }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    {link.icon && <span className="text-2xl">{link.icon}</span>}
                                    <span>{link.title}</span>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p style={{ color: textColor }}>No links available</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <a
                        href="/"
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                        style={{ color: textColor }}
                    >
                        Create your own LinkFlow page
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
