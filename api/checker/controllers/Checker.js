'use strict';

/**
 * Checker.js controller
 *
 * @description: A set of functions called "actions" for managing `Checker`.
 */

module.exports = {

  /**
   * Retrieve checker records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.checker.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a checker record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    const data = await strapi.services.checker.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an checker record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.checker.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an checker record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.checker.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an checker record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.checker.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },
  gvalidate: async(ctx, next) => {
    const data = await strapi.services.checker.edit(ctx.params, {"is_valid": true});
    ctx.send('Email verified successfully!');
  }
};
