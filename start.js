const app = require("./server");
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
