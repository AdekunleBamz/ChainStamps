/**
 * Utility to export data as files.
 */

export const exportData = (data: any, filename: string, type: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';

    if (type === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
    } else if (type === 'csv') {
        if (!Array.isArray(data) || data.length === 0) return;
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj =>
            Object.values(obj).map(val => `"${val}"`).join(',')
        ).join('\n');
        content = `${headers}\n${rows}`;
        mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
