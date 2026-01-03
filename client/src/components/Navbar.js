import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <span className="text-2xl font-bold text-primary-600">LinkFlow</span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/dashboard')
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/analytics"
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/analytics')
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Analytics
                            </Link>
                            <Link
                                to="/settings"
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/settings')
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Settings
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a
                            href={`/${user?.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-primary-600"
                        >
                            View Public Page
                        </a>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">{user?.username}</span>
                            <span className="px-2 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
                                {user?.plan}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
