import api from './api';

export const analyticsService = {
    getOverview: async () => {
        const response = await api.get('/analytics/overview');
        return response.data;
    },

    getChartData: async (days = 7) => {
        const response = await api.get(`/analytics/chart?days=${days}`);
        return response.data;
    },

    getLinkAnalytics: async (linkId) => {
        const response = await api.get(`/analytics/links/${linkId}`);
        return response.data;
    },

    getGeoAnalytics: async () => {
        const response = await api.get('/analytics/geo');
        return response.data;
    },

    getDeviceAnalytics: async () => {
        const response = await api.get('/analytics/devices');
        return response.data;
    },

    exportAnalytics: async () => {
        const response = await api.get('/analytics/export', {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'linkflow-analytics.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true };
    },
};
