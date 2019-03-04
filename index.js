const nodemon = require('nodemon');
const path = require('path')

nodemon({ script: path.join(__dirname,'src', 'app.js'), ext: 'js', watch:'src' });

nodemon
  .on('start', _ => console.log(`App Started at ${Date().toString()}`))
  .on('quit', _ => console.log('App Quit'))
  .on('restart', _ => console.log(`App Restarted at ${Date().toString()}`))
  .on('crash', _ => console.log('App Crashed'))