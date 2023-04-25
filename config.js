const config = {};

config.host = process.env.HOST || "https://mpillajodbcosmos.documents.azure.com:443/";
config.authKey =
  process.env.AUTH_KEY || "gPQR8mhQlRbpiRmIlvAPhHGAK95VQnXltdK4BnOQeNtp9fsYxWRbQmvPJ7s61MyW9qNXP99mPPEIACDbdUnbSg==";
config.databaseId = "ToDoList";
config.containerId = "Items";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;