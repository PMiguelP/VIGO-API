const dotenv = require("dotenv");
const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 3000;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.status(200).json("Welcome, your API is working!");
});

module.exports = app;
