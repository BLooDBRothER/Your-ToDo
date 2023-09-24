export function parseDate(date: Date): string{
    const dateStr = date.toISOString();

    let parsedDate = dateStr.replace(/T.*/, ' 00:00:00');
    
    return parsedDate
}
