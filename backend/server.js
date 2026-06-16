const dotenv = require("dotenv");

dotenv.config();

const dns = require("dns");
const app = require("./src/app");
const connectDB = require("./src/config/db");
require("./src/config/cloudinary");

const PORT = Number(process.env.PORT) || 5000;
const DNS_SERVERS = process.env.DNS_SERVERS;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
const mongoProtocol = process.env.MONGO_PROTOCOL || "mongodb+srv";
const usesSrv = mongoUri.startsWith("mongodb+srv://")
  || (!mongoUri && process.env.MONGO_HOST && mongoProtocol === "mongodb+srv");
const MAX_PORT_ATTEMPTS = Number(process.env.MAX_PORT_ATTEMPTS) || 10;

const parseList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const configureDns = () => {
  const servers = DNS_SERVERS
    ? parseList(DNS_SERVERS)
    : usesSrv
      ? ["8.8.8.8", "1.1.1.1"]
      : [];

  if (servers.length) {
    dns.setServers(servers);
  }
};

configureDns();

const listen = (port, attempts = 0) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      resolve(server);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE" && attempts < MAX_PORT_ATTEMPTS) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy. Trying ${nextPort}...`);
        listen(nextPort, attempts + 1).then(resolve).catch(reject);
        return;
      }

      reject(error);
    });
  });

const startServer = async () => {
  try {
    await connectDB();
    await listen(PORT);
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
