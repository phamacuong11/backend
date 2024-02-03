const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
let data = [
  { id: 1, name: 'Phạm A Cương', age: 25 },
  { id: 1, name: 'Phạm A Cương', age: 25 },
  { id: 1, name: 'Phạm A Cương', age: 25 }
]
app.get("/todo", (req, res) => {
  res.json(data);
});
app.post("/todo", (req, res) => {
  const newData = data.concat({ name: req.body.name })
  console.log(newData)
  data = newData
  res.json(data);
});
app.listen(port, () => {
  console.log("Example app listening on port", port);
});
