import express from 'express';
import { validationResult, check } from "express-validator";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import authRole from '../middleware/roleMiddleware.js';
import auth from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/',
  [check('email', 'Email is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('rol', 'Rol is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  ],
  async (request, response, next) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { email, name, rol, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      name,
      rol,
      passwordHash
    });

    try {
      const userSaved = await user.save();
      response.status(201).json(userSaved);
    } catch (exception) {
      next(exception);
    };
  });

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

export default userRouter;


