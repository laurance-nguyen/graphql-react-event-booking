const User = require('../../models/user');
const Event = require('../../models/event');
const { transfromEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return transfromEvent(event);
      });
    }
    catch (err) {
      throw err;
    };
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenciated');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transfromEvent(result);
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error('User not found.');
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    }
    catch (err) {
      throw err;
    };
  },
}