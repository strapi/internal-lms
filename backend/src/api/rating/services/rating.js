'use strict';

/**
 * rating service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rating.rating');
