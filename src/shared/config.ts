import * as dotenv from "dotenv";

switch (process.env.NODE_ENV) {
  case "production":
    dotenv.config({ path: "src/shared/.env.prod" });
    break;
  case "staging":
    dotenv.config({ path: "src/shared/.env.staging" });
    break;
  case "testing":
    dotenv.config({ path: "src/shared/.env.test" });
    break;
  case "local":
    dotenv.config({ path: "src/shared/.env" });
    break;
  default:
    dotenv.config({ path: "src/shared/.env" });
}

const { env } = process;

export default {
  app: {
    PORT: (env.PORT as string) || 3000,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET as string,
    jwt_expiresin: process.env.JWT_EXPIRES_IN || "60d",
    refresh_token_secret:
      process.env.REFRESH_TOKEN_SECRET || "VmVyeVBvd2VyZnVsbFNlY3JldA==",
    refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || "120d", //  4 months
    audience: process.env.JWT_AUDIENCE || "totonga.app.user",
    password_regex:
      process.env.PASSWORD_REGEX ||
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})",
    email_regex:
      process.env.EMAIL_REGEX || "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$",
    name_regex: process.env.NAME_REGEX || "^[A-Za-z][A-Za-z0-9_]{7,29}$",
  },
  db: {
    MONGO_URI: env.MONGO_URI as string,
  },
  email: {
    host: env.EMAIL_HOST as string,
    port: env.EMAIL_PORT as string,
    password: env.PASSWORD as string,
    email: env.EMAIL as string,
  },
};
