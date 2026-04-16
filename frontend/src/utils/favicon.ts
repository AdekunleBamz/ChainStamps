/** Favicon canvas dimensions in pixels. */
const FAVICON_SIZE = 32;

/** Status indicator dot radius in pixels. */
const STATUS_DOT_RADIUS = 6;

/** Status indicator dot position coordinates. */
const STATUS_DOT_X = 26;
const STATUS_DOT_Y = 26;

/**
 * Dynamically updates the site's favicon based on the current application state.
 *
 * @param status - Application state indicator.
 */
export const updateFavicon = (status: 'connected' | 'connecting' | 'disconnected' | 'pending' | 'confirmed' | 'error') => {
    const canvas = document.createElement('canvas');
    canvas.width = FAVICON_SIZE;
    canvas.height = FAVICON_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the original logo (assuming it's at /favicon.svg or /logo.png)
    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
        ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
        ctx.drawImage(img, 0, 0, FAVICON_SIZE, FAVICON_SIZE);

        // Add status indicator dot
        ctx.beginPath();
        ctx.arc(STATUS_DOT_X, STATUS_DOT_Y, STATUS_DOT_RADIUS, 0, 2 * Math.PI);

        switch (status) {
            case 'connected':
                ctx.fillStyle = '#22c55e';
                break;
            case 'connecting':
            case 'pending':
                ctx.fillStyle = '#f59e0b';
                break;
            case 'confirmed':
                ctx.fillStyle = '#10b981';
                break;
            case 'error':
                ctx.fillStyle = '#ef4444';
                break;
            case 'disconnected':
                ctx.fillStyle = '#64748b';
                break;
        }

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
