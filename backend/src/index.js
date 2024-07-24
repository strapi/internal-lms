//@ts-nocheck
"use strict";

const _ = require("lodash");

const getProfile = async (provider, query) => {
  const accessToken = query.access_token || query.code || query.oauth_token;

  const providers = await strapi
    .store({ type: "plugin", name: "users-permissions", key: "grant" })
    .get();

  return strapi.plugins["users-permissions"].services["providers-registry"].run(
    {
      provider,
      query,
      accessToken,
      providers,
    }
  );
};

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    strapi.plugins["users-permissions"].services["providers"].connect = async (
      provider,
      query
    ) => {
      const accessToken = query.access_token || query.code || query.oauth_token;

      if (!accessToken) {
        throw new Error("No access_token.");
      }

      // Get the profile.
      const profile = await getProfile(provider, query);

      const email = _.toLower(profile.email);

      if (!email.endsWith("@strapi.io")) {
        throw new Error("Forbidden email address");
      }

      // We need at least the mail.
      if (!email) {
        throw new Error("Email was not available.");
      }

      const users = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          where: { email },
        });

      const advancedSettings = await strapi
        .store({ type: "plugin", name: "users-permissions", key: "advanced" })
        .get();

      const user = _.find(users, { provider });

      if (_.isEmpty(user) && !advancedSettings.allow_register) {
        throw new Error("Register action is actually not available.");
      }

      if (!_.isEmpty(user)) {
        return user;
      }

      if (users.length && advancedSettings.unique_email) {
        throw new Error("Email is already taken.");
      }

      // Retrieve default role.
      const defaultRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: advancedSettings.default_role } });

      // Create the new user.
      const newUser = {
        ...profile,
        email, // overwrite with lowercased email
        provider,
        role: defaultRole.id,
        confirmed: true,
      };

      const createdUser = await strapi
        .query("plugin::users-permissions.user")
        .create({ data: newUser });

      return createdUser;
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
