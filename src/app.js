const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql')

const Event = require('../models/event')

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event{
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          return { ...event._doc };
        })
      }).catch(err => {
        throw err;
      })
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
      });
      return event.save().then(res => {
        console.log(res);
        return { ...res._doc };
      }).catch(err => {
        console.log(err);
        throw err;
      });
    }
  },
  graphiql: true
}));

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to Database. Server is running on port ${PORT}`)
    });
  })
  .catch(err => {
    console.log(err);
  })
