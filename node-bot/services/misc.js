const handleUnrecognizedService = async (text) => {
    return Promise.resolve([`I'm not sure I understand you...`]);
};

module.exports = {
    handleUnrecognizedService,
};
