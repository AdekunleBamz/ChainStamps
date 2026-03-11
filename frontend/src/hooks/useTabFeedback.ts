import { useEffect } from 'react';

/**
 * Hook to update the browser tab status based on transaction state.
 */
export function useTabFeedback(status: 'idle' | 'submitting' | 'success' | 'error') {
    useEffect(() => {
        const originalTitle = document.title;
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

        if (status === 'submitting') {
            document.title = `(Processing...) ${originalTitle}`;
            if (favicon) favicon.href = '/favicon-pending.png'; // Assuming these exist or will be generated
        } else if (status === 'success') {
            document.title = `✅ Success! - ${originalTitle}`;
            if (favicon) favicon.href = '/favicon-success.png';

            const timer = setTimeout(() => {
                document.title = originalTitle;
                if (favicon) favicon.href = '/favicon.ico';
            }, 5000);
            return () => clearTimeout(timer);
        } else if (status === 'error') {
            document.title = `❌ Failed - ${originalTitle}`;
            if (favicon) favicon.href = '/favicon-error.png';
        } else {
            document.title = originalTitle;
            if (favicon) favicon.href = '/favicon.ico';
        }

        return () => {
            document.title = originalTitle;
            if (favicon) favicon.href = '/favicon.ico';
        };
    }, [status]);
}
