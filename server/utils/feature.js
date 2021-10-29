module.exports = {
    pagination: function (data, currentPage) {
        let resultPerPage = 5;
        let begin = resultPerPage * (currentPage - 1);
        let end = resultPerPage * currentPage;
        return data.slice(begin, end);
    },
};
