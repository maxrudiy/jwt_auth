import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/refresh-token-model.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class TokenService {
  createTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { algorithm: "HS256", expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn: "30d" });
    return {
      accessToken,
      refreshToken,
    };
  }
  async deleteRefreshToken(refreshToken) {
    return await RefreshTokenModel.deleteOne({ refreshToken });
  }
  async saveRefreshToken(userId, refreshToken) {
    const tokenData = await RefreshTokenModel.findOne({ userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    return await RefreshTokenModel.create({ userId, refreshToken });
  }
  async findRefreshToken(refreshToken) {
    return await RefreshTokenModel.findOne({ refreshToken }).populate("userId");
  }
  verifyAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, JWT_ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  }
  verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }
}

export default new TokenService();
