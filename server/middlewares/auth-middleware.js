import ApiError from "../exceptions/api-error.js";
import TokenService from "../services/token-service.js";

const authMiddleware = (group) => {
  return async (req, res, next) => {
    try {
      //const { authorization } = req.header
      const authorization = req.get("authorization");
      if (!authorization || !authorization.startsWith("Bearer")) {
        return next(ApiError.Unauthorized());
      }
      const accessToken = authorization.substring(7);
      if (!accessToken) {
        return next(ApiError.Unauthorized());
      }
      const payload = TokenService.verifyAccessToken(accessToken);
      if (!payload || !payload.groups.find((value) => value.group === group)) {
        return next(ApiError.Unauthorized());
      }
      req.user = payload;
      return next();
    } catch (err) {
      return next(ApiError.Unauthorized());
    }
  };
};

export default authMiddleware;
