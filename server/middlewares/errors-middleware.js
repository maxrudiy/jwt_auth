import ApiError from "../exceptions/api-error.js";

const errorLogger = (err, req, res, next) => {
  console.log(err);
  return next(err);
};
const errorResponce = (err, req, res, next) => {
  try {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { errorLogger, errorResponce };
