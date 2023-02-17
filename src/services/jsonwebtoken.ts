import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../shared/config";

class JWTClass {
  secret: string;
  expiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  audience: string | string[];

  constructor(
    secret: string,
    expiresIn: string,
    refreshTokenSecret: string,
    refreshTokenExpiresIn: string,
    audience: string | string[]
  ) {
    this.secret = secret;
    this.expiresIn = expiresIn;
    this.refreshTokenSecret = refreshTokenSecret;
    this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    this.audience = audience;
  }

  async sign(
    data: object,
    time: string | undefined,
    audience: string | string[] | undefined
  ): Promise<string> {
    return await jwt.sign(data, this.secret, {
      algorithm: "HS256",
      expiresIn: time || this.expiresIn,
      audience: audience || this.audience,
      issuer: "totonga.app",
    });
  }

  verify(token: string): string | JwtPayload {
    return jwt.verify(token, this.secret);
  }
}

export default new JWTClass(
  config.auth.jwt_secret,
  config.auth.jwt_expiresin,
  config.auth.refresh_token_secret,
  config.auth.refresh_token_expiresin,
  config.auth.audience
);
