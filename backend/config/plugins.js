module.exports = ({ env }) => ({
  "mux-video-uploader": {
    enabled: true,
    // resolve: './src/plugins/strapi-plugin-mux-video-uploader',
    config: {
      accessTokenId: env("ACCESS_TOKEN_ID"),
      secretKey: env("ACCESS_TOKEN_SECRET"),
    },
  },
});
