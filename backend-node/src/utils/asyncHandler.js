// Encaminha qualquer erro (síncrono ou de Promise) do controller para o error.middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
