import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    info: {
      title: "Totonga Arts API",
      description: "API",
      version: "1.0.0",
    },
    host: process.env.HOST,
    basePath: "/api",
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Express) => {
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
