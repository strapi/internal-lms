'use strict';

/**
 * module service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::module.module');
