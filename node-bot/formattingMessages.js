const createLink = (url, text) => {
    return `<${url}|${text}>`;
};

const msgList = (items, title) => {
    const list = items.join('\n ');
    return title ? `${title}\n${list}` : list;
};

module.exports = {
    createLink,
    msgList,
};
