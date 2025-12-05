import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult, check } from "express-validator";
import User from '../models/User.js';

const loginRouter = express.Router();

loginRouter.post('/',
  [check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()],
  async (request, response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    };

    const { email, password } = request.body;

    const user = await User.findOne({ email });
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid email or password'
      });
    }

    const userForToken = {
      email: user.email,
      id: user._id,
      rol: user.rol
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });

    response
      .status(200)
      .send({ token, email: user.email });

  });

export default loginRouter;
