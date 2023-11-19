export function formatDate(date) {
    const format = `${date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`;
    return new Date(format);
}
