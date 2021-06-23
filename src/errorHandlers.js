export const notFound = (err, req, res, next) => {
  console.log(err);
  if (err && err.status === 400) {
    res
      .status(400)
      .send({ message: err.message || 'Not found!', errors: err.messageList });
  } else {
    next(err);
  }
};

export const forbidden = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ message: err.message || 'Forbidden!' });
  } else {
    next(err);
  }
};

export const catchAllErrorHandler = (err, req, res, next) => {
  if (err) {
    if (!req.headersSent) {
      res
        .status(err.status || 500)
        .send({ message: err.message || 'Something went wrong!' });
    }
  }
  next();
};
