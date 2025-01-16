module.exports = ({ env }) => ({
  "mux-video-uploader": {
    enabled: true,
    // resolve: "./src/plugins/strapi-plugin-mux-video-uploader",
    config: {
      accessTokenId: env("MUX_ACCESS_TOKEN_ID"),
      secretKey: env("MUX_ACCESS_TOKEN_SECRET"),
      webhookSigningSecret: env("MUX_WEBHOOK_SIGNING_SECRET"),
      playbackSigningId: env("MUX_SIGNING_KEY_ID"),
      playbackSigningSecret: env("MUX_SIGNING_KEY_PRIVATE_KEY"),
    },
  },
});
