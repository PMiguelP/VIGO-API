const app = require("./src/app");
const config = require("./src/config/environment");

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});

app.get("/", (req, res) => {
  res.status(200).json("Welcome, your API is working!");
  res.status(400).json("A api esta fodida");
});
