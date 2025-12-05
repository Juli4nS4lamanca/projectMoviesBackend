import express from "express";
import Producer from '../models/Producer.js';
import { validationResult, check } from "express-validator";
import auth from "../middleware/authMiddleware.js";
import authRole from "../middleware/roleMiddleware.js";

const producersRouter = express.Router();

producersRouter.get('/', async (request, response) => {
  const producers = await Producer.find({});
  response.json(producers);
});

producersRouter.get('/actives', async (request, response) => {
  const producersActives = await Producer.find({ state: true });
  response.json(producersActives);
});

producersRouter.post('/',
  [check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('slogan', 'Slogan is required').not().isEmpty(),
    auth,
  authRole(["administrador"])],
  async (request, response, next) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { name, state, description, slogan } = request.body;

    const producer = new Producer({
      name,
      state,
      description,
      slogan
    });

    try {
      const savedProducer = await producer.save();
      response.status(201).json(savedProducer);
    } catch (exception) {
      next(exception);
    };
  });

producersRouter.delete('/:id', [auth, authRole(["administrador"])], async (request, response) => {
  await Producer.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

producersRouter.put('/',
  [check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('slogan', 'Slogan is required').not().isEmpty(),
    auth,
  authRole(["administrador"])],
  async (request, response, next) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { name, state, description, slogan } = request.body;

    const producer = {
      name,
      state,
      description,
      slogan
    };

    try {
      const updateProducer = await Producer.findByIdAndUpdate(request.params.id, producer, { new: true });
      if (!updateProducer) {
        return response.status(404).json({ error: 'Producer not found' });
      };
      response.status(200).json(updateProducer);
    } catch (exception) {
      next(exception);
    };
  });

export default producersRouter;
