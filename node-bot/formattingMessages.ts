export const createLink = (url: string, text: string): string => {
    return `<${url}|${text}>`;
};

export const msgList = (items: string[], title?: string): string => {
    const list = items.join('\n ');
    return title ? `${title}\n${list}` : list;
};
