'use strict';

/**
 * course-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::course-status.course-status');
