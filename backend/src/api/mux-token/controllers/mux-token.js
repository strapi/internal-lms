const Mux = require("@mux/mux-node");

const MUX_SIGNING_KEY_ID = process.env.MUX_SIGNING_KEY_ID; // Signing key ID
const MUX_PRIVATE_KEY = process.env.MUX_PRIVATE_KEY; // Base64 encoded private key

module.exports = {
  async generateToken(ctx) {
    const { playbackId } = ctx.request.body;

    if (!playbackId) {
      return ctx.badRequest("Missing playbackId");
    }

    try {
      // Create a Mux instance
      const mux = new Mux(null, null, {
        signingKeyId: MUX_SIGNING_KEY_ID,
        signingKeySecret: Buffer.from(MUX_PRIVATE_KEY, "base64").toString(
          "utf8"
        ),
      });

      // Generate a signed token for the playback ID
      const token = mux.Video.PlaybackIDs.sign({
        playbackId,
        expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      });

      ctx.send({ token });
    } catch (error) {
      console.error("Error generating Mux token:", error);
      ctx.internalServerError("Failed to generate Mux token");
    }
  },
};
