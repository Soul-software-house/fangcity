'use strict';

/**
 * trait service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::trait.trait');
