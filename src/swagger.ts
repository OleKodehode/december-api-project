import swaggerAutogen from "swagger-autogen";
import "dotenv/config";

// Kinda unused - Made a yaml file manually instead based on the output json

const doc = {
  info: {
    version: "v1.0.0",
    title: "Entertainment Backlog service to service API",
    description:
      "A service to service API providing an Entertainment/Media backlog service",
  },
  host: `localhost:${process.env.PORT || 8001}`,
  basePath: "/",
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["src/server.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
