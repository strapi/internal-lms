# internal-lms
Strapi's Internal Learning Management System

# MUX
- For local development and using the MUX video uploader please provide all relevant .env variables

- You'll need to setup a webhook in Mux which points to your local instance. 
- To do this you'll need to use ngrok or similar to expose your local instance
https://dashboard.ngrok.com/get-started/setup/macos
- Setup ngrok to your local strapi instance
- Use your ngrok url to your strapi instance followed by `/mux-video-uploader/webhook-handler`

eg. https://6fa4-2a0a-ef40-d51-b401-c914-4129-650a-e23a.ngrok-free.app/mux-video-uploader/webhook-handler

This will allow mux to inform your Strapi instance when videos have finished uploading. 

## Mux Plugin
MUX_ACCESS_TOKEN_ID=tobemodified
MUX_ACCESS_TOKEN_SECRET=tobemodified
MUX_WEBHOOK_SIGNING_SECRET=tobemodified
MUX_SIGNING_KEY_ID=tobemodified
MUX_SIGNING_KEY_PRIVATE_KEY=tobemodified