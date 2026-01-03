import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import AnalyticsChart from '../components/AnalyticsChart';
import { analyticsService } from '../services/analyticsService';
import { Doughnut } from 'react-chartjs-2';
import { doughnutChartOptions } from '../utils/chartConfig';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [overview, setOverview] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [geoData, setGeoData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        fetchAnalytics();
    }, [days]);

    const fetchAnalytics = async () => {
        try {
            const [overviewRes, chartRes, geoRes, deviceRes] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getChartData(days),
                analyticsService.getGeoAnalytics(),
                analyticsService.getDeviceAnalytics(),
            ]);

            if (overviewRes.success) setOverview(overviewRes.data);
            if (chartRes.success) setChartData(chartRes.data.chartData);
            if (geoRes.success) setGeoData(geoRes.data.clicksByCountry);
            if (deviceRes.success) setDeviceData(deviceRes.data.clicksByDevice);
        } catch (error) {
            toast.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await analyticsService.exportAnalytics();
            toast.success('Analytics exported successfully');
        } catch (error) {
            toast.error('Failed to export analytics');
        }
    };

    const deviceChartData = {
        labels: deviceData.map(d => d._id || 'Unknown'),
        datasets: [
            {
                data: deviceData.map(d => d.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                        <p className="mt-2 text-gray-600">
                            Track your link performance and engagement
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Clicks"
                        value={overview?.totalClicks || 0}
                        color="primary"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Unique Visitors"
                        value={overview?.uniqueVisitors || 0}
                        color="green"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Top Links"
                        value={overview?.topLinks?.length || 0}
                        color="purple"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        }
                    />
                </div>

                {/* Chart Controls */}
                <div className="mb-4 flex justify-end">
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                </div>

                {/* Clicks Chart */}
                <div className="mb-8">
                    <AnalyticsChart data={chartData} title="Clicks Over Time" />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Links */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
                        {overview?.topLinks && overview.topLinks.length > 0 ? (
                            <div className="space-y-3">
                                {overview.topLinks.map((link, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {link.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{link.url}</p>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <span className="px-3 py-1 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                                                {link.clicks} clicks
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No data available</p>
                        )}
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
                        {deviceData.length > 0 ? (
                            <div className="h-64">
                                <Doughnut data={deviceChartData} options={doughnutChartOptions} />
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No data available</p>
                        )}
                    </div>
                </div>

                {/* Geo Data */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                    {geoData.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {geoData.slice(0, 8).map((country, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-900">{country._id || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">{country.count} clicks</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
