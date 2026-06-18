const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeBaseUrl(rawBaseUrl: string): string {
    return rawBaseUrl.trim().replace(/\/+$/, "");
}

function isAbsoluteHttpUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

function validateApiBaseUrl(url: string): void {
    if (!isAbsoluteHttpUrl(url)) {
        return;
    }

    const parsed = new URL(url);
    const isLocalHost = LOCAL_HOSTNAMES.has(parsed.hostname.toLowerCase());

    if (import.meta.env.PROD && parsed.protocol !== "https:" && !isLocalHost) {
        throw new Error(
            "Invalid VITE_API_BASE_URL: use HTTPS in production for non-local API hosts.",
        );
    }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

validateApiBaseUrl(API_BASE_URL);

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}

export function encodeApiPathSegment(segment: string): string {
    const value = segment.trim();

    if (value.length === 0) {
        throw new Error("A required API path segment is empty.");
    }

    return encodeURIComponent(value);
}
