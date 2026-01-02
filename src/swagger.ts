import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Entertainment Backlog S-T-S API",
    description:
      "A service to service API providing an Entertainment/Media backlog service",
  },
  host: `localhost:${process.env.PORT || 8001}`,
  basePath: "/",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "src/routes/authRoutes.ts",
  "src/routes/backlogRoutes.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc);
