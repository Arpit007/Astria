export function parseDate(date: string, tag: string): Date {
    try {
        return new Date(date);
    } catch (err) {
        throw new Error(`Invalid ${tag}`);
    }
}