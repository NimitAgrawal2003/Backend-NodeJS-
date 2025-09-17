import express from "express"; // module js to use this mention it in package.json as "type":"module",

const app = express(); // express is used to serve and listen on some route

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  // api created
  const jokes = [
    {
      id: 1,
      title: "A joke",
      content: "This is a joke",
    },
    {
      id: 2,
      title: "Another joke",
      content: "This is a joke",
    },
    {
      id: 3,
      title: "Third joke",
      content: "This is a joke",
    },
    {
      id: 4,
      title: "Fourth joke",
      content: "This is a joke",
    },
  ];
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://locathost:${port}`);
});
