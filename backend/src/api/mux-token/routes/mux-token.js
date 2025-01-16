module.exports = {
  routes: [
    {
      method: "POST",
      path: "/mux-token",
      handler: "mux-token.generateToken",
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
  ],
};
