const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphQlSchema = require('./grapql/schema');
const grapQlResolvers = require('./grapql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

const PORT = process.env.PORT || 3000;

// app.use(cors()); //This one using third-party tools to solve CORS policy

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHttp({
  schema: graphQlSchema,
  rootValue: grapQlResolvers,
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
