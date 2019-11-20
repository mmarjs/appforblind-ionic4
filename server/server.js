require('dotenv').config();

var express = require('express'),
  cors = require('cors');
  app = express(),
  fs = require('fs'),
  args = require('yargs').argv,
  path = require('path'),
  http = require('http'),
  grab = require('ps-grab'),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Video = require('./api/models/VideoModel'),
  Character = require('./api/models/CharacterModel'),
  Location = require('./api/models/LocationModel'),
  Scene = require('./api/models/SceneModel'),
  NarrationRequest = require('./api/models/NarrationRequestModel'),
  User = require('./api/models/UserModel'),
  Narration = require('./api/models/NarrationModel'),
  User = require('./api/models/UserModel'),
  bodyParser = require('body-parser');
  tokenMiddleware = require('./api/utils/TokenMiddleware');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
const connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(connectionString, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(tokenMiddleware);

var corsOptions = {
  credentials: true,
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.use(express.static('./public'));

var VideoRoutes = require('./api/routes/VideoRoutes');
VideoRoutes(app);

var NarrationRoutes = require('./api/routes/NarrationRoutes');
NarrationRoutes(app);

var CharacterRoutes = require('./api/routes/CharacterRoutes');
CharacterRoutes(app);

var UserRoutes = require('./api/routes/UserRoutes');
UserRoutes(app);

var NarrationRequestRoutes = require('./api/routes/NarrationRequestRoutes');
NarrationRequestRoutes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
