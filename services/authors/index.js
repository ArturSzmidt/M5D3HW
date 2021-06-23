import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';
import { usersValidation } from './validation.js';
import { loggerMiddleware } from './middlewares.js';
import createError from 'http-errors';
import { validationResult } from 'express-validator';
const authorsRouter = express.Router();

const authorJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'users.json'
);

const getAuthorsArray = () => {
  const content = fs.readFileSync(authorJSONPath);
  return JSON.parse(content);
};

const writeAuthors = (content) =>
  fs.writeFileSync(authorJSONPath, JSON.stringify(content));

authorsRouter.get('/', loggerMiddleware, (req, res, next) => {
  try {
    const users = getAuthorsArray();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
authorsRouter.get('/:id', (req, res, next) => {
  try {
    const users = getAuthorsArray();
    const user = users.find((u) => u._id === req.params.id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.post('/', (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const newUser = { ...req.body, _id: uniqid(), createAt: new Date() };
      const users = getAuthorsArray();
      users.push(newUser);
      writeAuthors(users);
      res.status(201).send({ _id: newUser._id });
    } else {
      next(createError(400, { errorsList: errors }));
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.put('/:id', (req, res, next) => {
  try {
    const users = getAuthorsArray();

    const remainingUser = users.filter((user) => user._id !== req.params.id);

    const updatedUser = { ...req.body, _id: req.params.id };

    remainingUser.push(updatedUser);

    writeAuthors(remainingUser);

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});
authorsRouter.delete('/:id', (req, res, next) => {
  try {
    const users = getAuthorsArray();

    const remainingUsers = users.filter((user) => user._id !== req.params.id);

    writeAuthors(remainingUsers);

    res.status(200).send('Deleted!');
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
