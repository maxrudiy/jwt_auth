import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import UserModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import TokenService from "./token-service.js";
import MailService from "./mail-service.js";

class AuthService {
  async register(firstName, lastName, email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with ${email} already registered`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationUrl = v4();
    const userData = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      activationUrl,
    });
    const userDto = new UserDto(userData);
    const tokens = TokenService.createTokens({ ...userDto });
    await TokenService.saveRefreshToken(userDto.userId, tokens.refreshToken);
    MailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${activationUrl}`);
    return {
      tokens,
      userDto,
    };
  }
  async login(email, password) {
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      throw ApiError.BadRequest(`User with ${email} not registered`);
    }
    const passIsValid = await bcrypt.compare(password, userData.password);
    if (!passIsValid) {
      throw ApiError.BadRequest("Wrong password");
    }
    const userDto = new UserDto(userData);
    const tokens = TokenService.createTokens({ ...userDto });
    await TokenService.saveRefreshToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      userDto,
    };
  }
  async logout(refreshToken) {
    return await TokenService.deleteRefreshToken(refreshToken);
  }
  async activate(activationUrl) {
    const userData = await UserModel.findOne({ activationUrl });
    if (!userData) {
      throw ApiError.BadRequest("Wrong activation URL");
    }
    userData.isActivated = true;
    return await userData.save();
  }
  async refresh(refreshToken) {
    const tokenData = await TokenService.findRefreshToken(refreshToken);
    const payload = TokenService.verifyRefreshToken(refreshToken);
    if (!tokenData || !payload || !tokenData.userId === payload.userId) {
      throw ApiError.BadRequest("Wrong token");
    }
    const userDto = new UserDto(tokenData.userId);
    const tokens = TokenService.createTokens({ ...userDto });
    await TokenService.saveRefreshToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      userDto,
    };
  }
  async getUsers() {
    return await UserModel.find();
  }
}
export default new AuthService();
