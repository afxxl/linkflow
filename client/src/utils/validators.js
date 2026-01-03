export const isValidUrl = (url) => {
    try {
        new URL(url);
        return /^https?:\/\/.+/.test(url);
    } catch {
        return false;
    }
};

export const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
};

export const isValidUsername = (username) => {
    return /^[a-z0-9_-]{3,20}$/.test(username);
};
