const cors = require("cors");

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:8100",
      "https://project-vigo.vercel.app",
      "http://localhost:4200",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
