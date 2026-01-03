import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-primary-600">LinkFlow</div>
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Smart Link Management
                        <br />
                        <span className="text-primary-600">With Powerful Automation</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Create a beautiful link-in-bio page with advanced features like scheduling,
                        geo-targeting, device targeting, and A/B testing. Perfect for content creators.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        Start Free Today
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Powerful Features
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Simple Pricing
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricing.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white p-8 rounded-xl shadow-md ${plan.featured ? 'ring-2 ring-primary-600 transform scale-105' : ''
                                }`}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold text-primary-600 mb-6">
                                {plan.price}
                                {plan.price !== 'Free' && <span className="text-lg text-gray-600">/mo</span>}
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/register"
                                className={`block w-full text-center px-4 py-3 rounded-lg font-semibold ${plan.featured
                                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-2xl font-bold mb-4">LinkFlow</div>
                    <p className="text-gray-400">
                        © 2024 LinkFlow. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: '📅',
        title: 'Smart Scheduling',
        description: 'Schedule links to appear only during specific dates and times',
    },
    {
        icon: '🌍',
        title: 'Geo-Targeting',
        description: 'Show or hide links based on visitor location',
    },
    {
        icon: '📱',
        title: 'Device Targeting',
        description: 'Target specific devices - mobile, desktop, or tablet',
    },
    {
        icon: '🔄',
        title: 'A/B Testing',
        description: 'Rotate between multiple URLs to test performance',
    },
    {
        icon: '📊',
        title: 'Analytics',
        description: 'Track clicks, visitors, and engagement metrics',
    },
    {
        icon: '🎨',
        title: 'Custom Themes',
        description: 'Personalize your page with custom colors and styles',
    },
    {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Optimized for speed and performance',
    },
    {
        icon: '🔒',
        title: 'Secure',
        description: 'Your data is safe with enterprise-grade security',
    },
];

const pricing = [
    {
        name: 'Free',
        price: 'Free',
        features: [
            'Up to 10 links',
            'Basic analytics',
            'Custom username',
            'Basic themes',
        ],
    },
    {
        name: 'Creator',
        price: '$9',
        featured: true,
        features: [
            'Unlimited links',
            'Advanced analytics',
            'All automation features',
            'Custom themes',
            'Priority support',
        ],
    },
    {
        name: 'Pro',
        price: '$29',
        features: [
            'Everything in Creator',
            'Custom domain',
            'Remove branding',
            'API access',
            'White-label solution',
        ],
    },
];

export default Landing;
