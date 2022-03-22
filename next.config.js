module.exports = {
    async rewrites() {
        return [
            {
                source: "/:primary_response_id*",
                destination: "/:primary_response_id*",
            },
        ];
    },
};
