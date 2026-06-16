const mongoose = require("mongoose");

const encodeIfPresent = (value) =>
  value ? encodeURIComponent(value) : "";

const buildMongoUri = () => {
  const explicitUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (explicitUri) {
    return explicitUri;
  }

  const protocol = process.env.MONGO_PROTOCOL || "mongodb+srv";
  const host = process.env.MONGO_HOST;
  const database = process.env.MONGO_DATABASE || process.env.MONGO_DB || "";
  const username = encodeIfPresent(process.env.MONGO_USERNAME);
  const password = encodeIfPresent(process.env.MONGO_PASSWORD);
  const appName = process.env.MONGO_APP_NAME;

  if (!host) {
    return "";
  }

  const credentials = username
    ? `${username}${password ? `:${password}` : ""}@`
    : "";
  const databasePath = database ? `/${database}` : "/";
  const params = new URLSearchParams();

  if (appName) {
    params.set("appName", appName);
  }

  const query = params.toString();

  return `${protocol}://${credentials}${host}${databasePath}${query ? `?${query}` : ""}`;
};

const connectDB = async () => {
  const mongoUri = buildMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is missing. Set MONGO_URI or MONGO_HOST in .env"
    );
  }

  const connection = await mongoose.connect(mongoUri);

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
