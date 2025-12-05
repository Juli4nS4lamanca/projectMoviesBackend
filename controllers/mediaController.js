import express from 'express';
import { validationResult, check } from 'express-validator';
import Media from '../models/Media.js';
import Director from '../models/Director.js';
import Producer from '../models/Producer.js';
import Genre from '../models/Genre.js';
import Type from '../models/Type.js';
import auth from '../middleware/authMiddleware.js';
import authRole from '../middleware/roleMiddleware.js';

const mediasRouter = express.Router();

mediasRouter.get('/', async (request, response, next) => {
  try {
    const medias = await Media.find({}).populate([
      { path: 'director', select: 'name' },
      { path: 'genre', select: 'name' },
      { path: 'type', select: 'name' },
      { path: 'producer', select: 'name' }
    ]);
    response.json(medias);
  } catch (exception) {
    next(exception);
  }
});

mediasRouter.post('/',
  [check('title', 'Title is required').not().isEmpty(),
  check('synopsis', 'Synopsis is required').not().isEmpty(),
  check('urlMovie', 'urlMovie is required').not().isEmpty(),
  check('img', 'Img is required').not().isEmpty(),
  check('release', 'Release is required').not().isEmpty(),
  check('directorId', 'Invalid Director ID').isMongoId(),
  check('producerId', 'Invalid Producer ID').isMongoId(),
  check('genreId', 'Invalid Genre ID').isMongoId(),
  check('typeId', 'Invalid Type ID').isMongoId(),
    auth,
  authRole(["docente", "administrador"])],
  async (request, response, next) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { title, synopsis, urlMovie, img, release, directorId, typeId, genreId, producerId } = request.body;

    const [director, producer, genre, type] = await Promise.all([
      Director.findOne({ _id: directorId, state: true }),
      Producer.findOne({ _id: producerId, state: true }),
      Genre.findOne({ _id: genreId, state: true }),
      Type.findOne({ _id: typeId })
    ]);

    if (!director) {
      return response.status(400).json({ error: 'Director not found' });
    };

    if (!producer) {
      return response.status(400).json({ error: 'Producer not found' });
    };

    if (!genre) {
      return response.status(400).json({ error: 'Genre not found' });
    };

    if (!type) {
      return response.status(400).json({ error: 'Type not found' });
    };

    const media = new Media({
      title,
      synopsis,
      urlMovie,
      img,
      release,
      director: directorId,
      type: typeId,
      genre: genreId,
      producer: producerId
    });

    try {
      const savedMedia = await media.save();
      response.status(201).json(savedMedia);
    } catch (exception) {
      next(exception);
    };
  });

mediasRouter.delete('/:id', [auth, authRole(["docente", "administrador"])], async (request, response) => {
  await Media.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

mediasRouter.put('/:id',
  [check('title', 'Title is required').not().isEmpty(),
  check('synopsis', 'Synopsis is required').not().isEmpty(),
  check('urlMovie', 'urlMovie is required').not().isEmpty(),
  check('img', 'Img is required').not().isEmpty(),
  check('release', 'Release is required').not().isEmpty(),
  check('directorId', 'Invalid Director ID').isMongoId(),
  check('producerId', 'Invalid Producer ID').isMongoId(),
  check('genreId', 'Invalid Genre ID').isMongoId(),
  check('typeId', 'Invalid Type ID').isMongoId(),
    auth,
  authRole(["docente", "administrador"])],
  async (request, response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { title, synopsis, urlMovie, img, release, directorId, typeId, genreId, producerId } = request.body;

    const [director, producer, genre, type] = await Promise.all([
      Director.findOne({ _id: directorId, state: true }),
      Producer.findOne({ _id: producerId, state: true }),
      Genre.findOne({ _id: genreId, state: true }),
      Type.findOne({ _id: typeId })
    ]);

    if (!director) {
      return response.status(400).json({ error: 'Director not found' });
    };

    if (!producer) {
      return response.status(400).json({ error: 'Producer not found' });
    };

    if (!genre) {
      return response.status(400).json({ error: 'Genre not found' });
    };

    if (!type) {
      return response.status(400).json({ error: 'Type not found' });
    };

    const media = {
      title,
      synopsis,
      urlMovie,
      img,
      release,
      director: directorId,
      type: typeId,
      genre: genreId,
      producer: producerId
    };

    try {
      const updateMedia = await Media.findByIdAndUpdate(request.params.id, media, { new: true });
      if (!updateMedia) {
        return response.status(404).json({ error: 'Media not found' });
      };
      response.status(200).json(updateMedia);
    } catch (exception) {
      next(exception);
    };
  });

export default mediasRouter;
