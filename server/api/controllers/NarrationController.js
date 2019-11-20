'use strict';

var mongoose = require('mongoose'),
    Narration = mongoose.model('Narration'),
    Character = mongoose.model('Character'),
    Location = mongoose.model('Location'),
    Scene = mongoose.model('Scene'),
    Video = mongoose.model('Video'),
    NarrationRequest = mongoose.model('NarrationRequest');

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId:  process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();

function getPublicUrl(bucket, key, method, expiresIn = 600) {
  return new Promise((resolve, reject) => {
    const options = {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn
    };
    if (method == 'putObject') {
      options.ContentType = 'audio/mp3';
    }
    s3.getSignedUrl(method, options, (error, url) => {
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });
}

function mapNarrationItems(data, narration, fieldName, method = 'putObject') {
  return new Promise((resolve, reject) => {
    Promise.all(
      data.map(async (item) => {
        const presignedUrl = await getPublicUrl('videoforblind', `${narration.video._id}/${narration._id}/${fieldName}/${item._id}.mp3`, method);

        return { ...item, presignedUrl};
      })
    ).then(documents => {
      resolve(documents);
    });
  });
}

async function updateNarrationRequest(videoId) {
  var result = await NarrationRequest.findOneAndUpdate(
    { video: videoId },
    { $set: { status: 'CLOSED'} },
    { upsert: true, new: true, returnNewDocument: true },
    (err, doc) => {
      return doc;
    }
  );

  return result;
};

var udpateObjects = async (narration, fieldName, modelName, currentNarration) => {
  if (!narration[fieldName]) {
    return;
  }
  return new Promise((resolve, reject) => {
    Promise.all(
      narration[fieldName].map(async (item) => {

        // Create an if if doesn't exists yet
        if (!item._id) {
          item = new modelName(item);
        }

        // Create or update item
        var result = await modelName.findOneAndUpdate(
          { _id: item._id },
          { $set: item },
          { upsert: true, new: true, returnNewDocument: true },
          (err, doc) => {
            return doc;
          }
        );
        
        return item;
      })
    ).then(documents => {
      narration[fieldName] = documents;
      // delete all items which are not in use anymore
      if (currentNarration && currentNarration[fieldName]) {
        const newDocumentIDs = documents.map(a => String(a._id));
        const oldDocumentIDs = currentNarration[fieldName].map(a => String(a));
        let documentsToDelete = oldDocumentIDs.filter(x => !newDocumentIDs.includes(x));
        modelName.deleteMany(
          { _id: { $in: documentsToDelete } }, function (err) { }
        );
      }

      resolve(documents);
    });
  });
}

exports.add_update_narration = async (request, response) => {
  try {
    const { userId } = request;
    if (!userId) {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }


    let narration = { ...request.body, owner: userId };
    if (request.params.narrationId) {
      narration._id = request.params.narrationId;
    }

    var currentNarration = await Narration.findById(narration._id);

    await Promise.all([
      udpateObjects(narration, 'locations', Location, currentNarration),
      udpateObjects(narration, 'scenes', Scene, currentNarration),
      udpateObjects(narration, 'characters', Character, currentNarration),
      updateNarrationRequest(narration.video._id)
    ])
      .then(async result => {
        if (!request.params.narrationId) {
          narration = new Narration(narration);
        }
        var data = await Narration.findOneAndUpdate(
          { _id: narration._id },
          {
            $currentDate: { updated: true },
            $set: narration,
            $setOnInsert: { created: new Date() }
          },
          { upsert: true, new: true, returnNewDocument: true },
          (err, doc) => {
            return doc;
          }
        );

        const resp = {
          locations: await mapNarrationItems(result[0], narration, 'locations'),
          scenes: await mapNarrationItems(result[1], narration, 'scenes'),
          characters: await mapNarrationItems(result[2], narration, 'characters'),
        }
        response.send(resp);
      });
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

exports.get_narration_by_id = async function (req, res) {
  var data = await Narration.findById(req.params.narrationId)
    .populate('video')
    .populate('characters')
    .populate('locations')
    .populate('scenes')
    .exec();

  data = data && data.toObject();

  data.locations = await mapNarrationItems(data.locations, data, 'locations', 'getObject');
  data.scenes = await mapNarrationItems(data.scenes, data, 'scenes', 'getObject');
  data.characters = await mapNarrationItems(data.characters, data, 'characters', 'getObject');

  return res.json(data);
};

exports.delete_narration_by_id = function (req, res) {
  Narration.findByIdAndDelete({ _id: req.params.narrationId }, function (err, task) {
    if (err) {
      res.send(err);
    }

    Location.deleteMany(
      { _id: { $in: task.locations } }, function (err) { }
    );
    Character.deleteMany(
      { _id: { $in: task.characters } }, function (err) { }
    );
    Scene.deleteMany(
      { _id: { $in: task.scenes } }, function (err) { }
    );
    Video.deleteOne(
      { _id: task.video }, function (err) { }
    );
    res.json(task);
  });
};

exports.get_narrations_by_owner = function (req, res) {
  Narration.find({ owner: req.params.ownerId }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  })
    .sort({'updated': -1})
    .populate('video');
}

exports.get_my_narrations = function (req, res) {
  const { userId } = req;
  if (!userId) {
    return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
  }

  req.params.ownerId = userId;

  return exports.get_narrations_by_owner(req, res);
}

exports.get_published_narrations = function (req, res) {
  Narration.find({ published: true }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  })
    .sort({'created': -1})
    .populate('video');
}

exports.update_narration_by_id = function (req, res) {
  Narration.findByIdAndUpdate(req.params.narrationId,
    {
      $set: {
        language: req.body.language,
      }
    })
    .then(updatedRes => {
      const models = [
        { 'characters': Character },
        { 'locations': Location },
        { 'scenes': Scene }
      ];

      for (let model of models) {
        for (let key in model) {
          req.body[key].map(item => {
            if (item.remove) {

            } else {
              model[key].findByIdAndUpdate(item._id, { $set: item }, { upsert: true, new: true })
                .exec();
            }

          })
        }

      }

      res.json(req);
    })
    .catch(err => {
      res.send(err);
    })
}

exports.get_presigned_url_for_delete_audio_by_key = async function (req, res) {
  const { key } = req.query;
  const presignedUrl = await getPublicUrl('videoforblind', key, 'deleteObject');

  res.status(200).json(presignedUrl);
};
