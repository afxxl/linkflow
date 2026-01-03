import React, { useState, useEffect } from 'react';
import { isValidUrl } from '../utils/validators';

const LinkForm = ({ link, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        icon: '',
        schedule: {
            enabled: false,
            startDate: '',
            endDate: '',
            timezone: 'UTC',
        },
        geoTargeting: {
            enabled: false,
            countries: [],
            action: 'show',
        },
        deviceTargeting: {
            enabled: false,
            devices: [],
        },
        rotation: {
            enabled: false,
            urls: [''],
            method: 'random',
        },
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (link) {
            setFormData({
                title: link.title || '',
                url: link.url || '',
                icon: link.icon || '',
                schedule: link.schedule || {
                    enabled: false,
                    startDate: '',
                    endDate: '',
                    timezone: 'UTC',
                },
                geoTargeting: link.geoTargeting || {
                    enabled: false,
                    countries: [],
                    action: 'show',
                },
                deviceTargeting: link.deviceTargeting || {
                    enabled: false,
                    devices: [],
                },
                rotation: link.rotation || {
                    enabled: false,
                    urls: [''],
                    method: 'random',
                },
            });
        }
    }, [link]);

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'URL is required';
        } else if (!isValidUrl(formData.url)) {
            newErrors.url = 'Please enter a valid URL starting with http:// or https://';
        }

        if (formData.schedule.enabled) {
            if (!formData.schedule.startDate) {
                newErrors.scheduleStart = 'Start date is required';
            }
            if (!formData.schedule.endDate) {
                newErrors.scheduleEnd = 'End date is required';
            }
        }

        if (formData.rotation.enabled) {
            const validUrls = formData.rotation.urls.filter(url => url.trim() && isValidUrl(url));
            if (validUrls.length < 2) {
                newErrors.rotation = 'At least 2 valid URLs are required for rotation';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            // Clean up the data before submitting
            const submitData = { ...formData };

            // If rotation is not enabled, clear the URLs array to avoid validation errors
            if (!submitData.rotation.enabled) {
                submitData.rotation.urls = [];
            } else {
                // If rotation is enabled, filter out empty URLs
                submitData.rotation.urls = submitData.rotation.urls.filter(url => url && url.trim());
            }

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: !prev[section][field],
            },
        }));
    };

    const handleArrayChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const addRotationUrl = () => {
        setFormData(prev => ({
            ...prev,
            rotation: {
                ...prev.rotation,
                urls: [...prev.rotation.urls, ''],
            },
        }));
    };

    const removeRotationUrl = (index) => {
        setFormData(prev => ({
            ...prev,
            rotation: {
                ...prev.rotation,
                urls: prev.rotation.urls.filter((_, i) => i !== index),
            },
        }));
    };

    const updateRotationUrl = (index, value) => {
        const newUrls = [...formData.rotation.urls];
        newUrls[index] = value;
        setFormData(prev => ({
            ...prev,
            rotation: {
                ...prev.rotation,
                urls: newUrls,
            },
        }));
    };

    const toggleDevice = (device) => {
        const devices = formData.deviceTargeting.devices.includes(device)
            ? formData.deviceTargeting.devices.filter(d => d !== device)
            : [...formData.deviceTargeting.devices, device];

        handleArrayChange('deviceTargeting', 'devices', devices);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'geo', label: 'Geo-Targeting' },
        { id: 'device', label: 'Device Targeting' },
        { id: 'rotation', label: 'A/B Testing' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {link ? 'Edit Link' : 'Create New Link'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mt-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="My Awesome Link"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL *
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                                {errors.url && (
                                    <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon (Emoji)
                                </label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="🔗"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    )}

                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="scheduleEnabled"
                                    checked={formData.schedule.enabled}
                                    onChange={() => handleCheckboxChange('schedule', 'enabled')}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="scheduleEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable scheduling
                                </label>
                            </div>

                            {formData.schedule.enabled && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.schedule.startDate}
                                            onChange={(e) => handleArrayChange('schedule', 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        {errors.scheduleStart && (
                                            <p className="mt-1 text-sm text-red-600">{errors.scheduleStart}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.schedule.endDate}
                                            onChange={(e) => handleArrayChange('schedule', 'endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        {errors.scheduleEnd && (
                                            <p className="mt-1 text-sm text-red-600">{errors.scheduleEnd}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Timezone
                                        </label>
                                        <select
                                            value={formData.schedule.timezone}
                                            onChange={(e) => handleArrayChange('schedule', 'timezone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Asia/Kolkata">India</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Geo-Targeting Tab */}
                    {activeTab === 'geo' && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="geoEnabled"
                                    checked={formData.geoTargeting.enabled}
                                    onChange={() => handleCheckboxChange('geoTargeting', 'enabled')}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="geoEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable geo-targeting
                                </label>
                            </div>

                            {formData.geoTargeting.enabled && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Action
                                        </label>
                                        <select
                                            value={formData.geoTargeting.action}
                                            onChange={(e) => handleArrayChange('geoTargeting', 'action', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="show">Show only in selected countries</option>
                                            <option value="hide">Hide in selected countries</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Countries (comma-separated country codes, e.g., US, IN, UK)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.geoTargeting.countries.join(', ')}
                                            onChange={(e) => {
                                                const countries = e.target.value.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
                                                handleArrayChange('geoTargeting', 'countries', countries);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="US, IN, UK, CA"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Device Targeting Tab */}
                    {activeTab === 'device' && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="deviceEnabled"
                                    checked={formData.deviceTargeting.enabled}
                                    onChange={() => handleCheckboxChange('deviceTargeting', 'enabled')}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="deviceEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable device targeting
                                </label>
                            </div>

                            {formData.deviceTargeting.enabled && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Show link only on:</p>
                                    {['mobile', 'desktop', 'tablet'].map(device => (
                                        <div key={device} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={device}
                                                checked={formData.deviceTargeting.devices.includes(device)}
                                                onChange={() => toggleDevice(device)}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={device} className="ml-2 block text-sm text-gray-900 capitalize">
                                                {device}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rotation Tab */}
                    {activeTab === 'rotation' && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rotationEnabled"
                                    checked={formData.rotation.enabled}
                                    onChange={() => handleCheckboxChange('rotation', 'enabled')}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="rotationEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable URL rotation (A/B testing)
                                </label>
                            </div>

                            {formData.rotation.enabled && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rotation Method
                                        </label>
                                        <select
                                            value={formData.rotation.method}
                                            onChange={(e) => handleArrayChange('rotation', 'method', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="random">Random</option>
                                            <option value="sequential">Sequential</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URLs (minimum 2)
                                        </label>
                                        {formData.rotation.urls.map((url, index) => (
                                            <div key={index} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => updateRotationUrl(index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="https://example.com/variant-a"
                                                />
                                                {formData.rotation.urls.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRotationUrl(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addRotationUrl}
                                            className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                                        >
                                            + Add URL
                                        </button>
                                        {errors.rotation && (
                                            <p className="mt-1 text-sm text-red-600">{errors.rotation}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : link ? 'Update Link' : 'Create Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkForm;
