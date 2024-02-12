const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
      try {
        await Promise.resolve(requestHandler(req, res, next));
      } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessge = error.message || "Internal Server Error";
        res.status(statusCode).json({
          success: false,
          message: errorMessge
        })
      }
  }
}

export default asyncHandler;