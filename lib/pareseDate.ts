export function parseDate(date: Date): string{
    const dateStr = date.toISOString();

    let parsedDate = dateStr.replace('T', ' ');
    parsedDate = parsedDate.replace(/\.[\d]*Z/, ' UTC');
    
    return parsedDate
}
