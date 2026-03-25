/**
 * Dynamically updates the site's favicon based on the current application state.
 * 
 * @param {'connected' | 'connecting' | 'disconnected' | 'pending' | 'confirmed' | 'error'} status - Application state.
 */
export const updateFavicon = (status: 'connected' | 'connecting' | 'disconnected' | 'pending' | 'confirmed' | 'error') => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the original logo (assuming it's at /favicon.svg or /logo.png)
    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);

        // Add status dot
        ctx.beginPath();
        ctx.arc(26, 26, 6, 0, 2 * Math.PI);

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
