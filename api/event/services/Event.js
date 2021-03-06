'use strict';

/**
 * Event.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all events.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('event', params);
    //console.log(_.keys(_.groupBy(_.reject(strapi.models.event.associations, {autoPopulate: false}), 'alias')).join(' '))
    return Event
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.event.associations, {autoPopulate: false}), 'alias')).join(' '), '-password');
  },

  /**
   * Promise to fetch a/an event.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Event
      .findOne(_.pick(params, _.keys(Event.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.event.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an event.
   *
   * @return {Promise}
   */

  add: async (values) => {
    const data = await Event.create(_.omit(values, _.keys(_.groupBy(strapi.models.event.associations, 'alias'))));
    await strapi.hook.mongoose.manageRelations('event', _.merge(_.clone(data), { values }));
    return data;
  },

  /**
   * Promise to edit a/an event.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Note: The current method will return the full response of Mongo.
    // To get the updated object, you have to execute the `findOne()` method
    // or use the `findOneOrUpdate()` method with `{ new:true }` option.
    await strapi.hook.mongoose.manageRelations('event', _.merge(_.clone(params), { values }));
    return Event.update(params, values, { multi: true });
  },

  /**
   *
   * Promise to register for an event
   *
   * @return {Promise}
   */
  register: async (params, values) => {
    return Event.update(_.merge(params, { capacity: { $gt: 0} , users: {$nin: [values.users]}}), { $addToSet: {'users': values['users']}, $inc:{capacity: -1}});
  },

  /**
   * Promise to remove a/an event.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Event.findOneAndRemove(params, {})
      .populate(_.keys(_.groupBy(_.reject(strapi.models.event.associations, {autoPopulate: false}), 'alias')).join(' '));

    _.forEach(Event.associations, async association => {
      const search = (_.endsWith(association.nature, 'One')) ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
      const update = (_.endsWith(association.nature, 'One')) ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

      await strapi.models[association.model || association.collection].update(
        search,
        update,
        { multi: true });
    });

    return data;
  }
};
