export const getPath = (url: string) => {
    try {
        if (url.startsWith('/')) return url;
        const u = new URL(url, window.location.origin);
        return u.pathname;
    } catch {
        return url;
    }
};

export const normalizePath = (p: string) => {
    if (!p) return '/';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
};
