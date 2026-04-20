/** Favicon canvas dimensions in pixels. */
const FAVICON_SIZE = 32;

/** Status indicator dot radius in pixels. */
const STATUS_DOT_RADIUS = 6;

/** Status indicator dot position coordinates. */
const STATUS_DOT_X = 26;
const STATUS_DOT_Y = 26;

/** Source path for the base favicon image. */
const FAVICON_IMG_SRC = '/logo.png';

type FaviconStatus = 'connected' | 'connecting' | 'disconnected' | 'disconnecting' | 'pending' | 'confirmed' | 'error';

/** Status dot fill colours for each favicon state. */
const STATUS_DOT_COLOR: Record<FaviconStatus, string> = {
    connected: '#22c55e',
    connecting: '#f59e0b',
    pending: '#f59e0b',
    confirmed: '#10b981',
    error: '#ef4444',
    disconnected: '#64748b',
    disconnecting: '#94a3b8',
};

/**
 * Dynamically updates the site's favicon based on the current application state.
 *
 * @param status - Application state indicator.
 */
export const updateFavicon = (status: FaviconStatus) => {
    const canvas = document.createElement('canvas');
    canvas.width = FAVICON_SIZE;
    canvas.height = FAVICON_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the original logo (assuming it's at /favicon.svg or /logo.png)
    const img = new Image();
    img.src = FAVICON_IMG_SRC;
    img.onload = () => {
        ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
        ctx.drawImage(img, 0, 0, FAVICON_SIZE, FAVICON_SIZE);

        // Add status indicator dot
        ctx.beginPath();
        ctx.arc(STATUS_DOT_X, STATUS_DOT_Y, STATUS_DOT_RADIUS, 0, 2 * Math.PI);

        ctx.fillStyle = STATUS_DOT_COLOR[status];

        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
            link.href = canvas.toDataURL('image/png');
        } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = canvas.toDataURL('image/png');
            document.head.appendChild(newLink);
        }
    };
};

/**
 * Resets the site favicon to its original static file by removing any
 * dynamically generated data-URL overrides.
 */
export const resetFavicon = (): void => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (link) {
        link.href = FAVICON_IMG_SRC;
    }
};
