import { validationResult } from "express-validator";
import AuthService from "../services/auth-service.js";
import ApiError from "../exceptions/api-error.js";

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Wrong password or email", errors.array()));
      }
      const { firstName, lastName, email, password } = req.body;
      const userData = await AuthService.register(firstName, lastName, email, password);
      res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      return res.json({ userData });
    } catch (err) {
      return next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);
      res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      return res.json({ userData });
    } catch (err) {
      return next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const result = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  }
  async activate(req, res, next) {
    try {
      const { activationUrl } = req.params;
      await AuthService.activate(activationUrl);
      return res.redirect(301, process.env.CLIENT_URL);
    } catch (err) {
      return next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthService.refresh(refreshToken);
      res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      return res.json({ userData });
    } catch (err) {
      return next(err);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await AuthService.getUsers();
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
