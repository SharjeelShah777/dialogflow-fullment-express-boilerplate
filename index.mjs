import express from "express";
import morgan from "morgan";
import { WebhookClient } from "dialogflow-fulfillment";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/webhook", (request, response) => {
  const _agent = new WebhookClient({ request, response });

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
  function order(agent) {
    const qty = agent.parameters.qty;
    const sizes = agent.parameters.sizes;
    const toppings = agent.parameters.toppings;

    console.log("qty:", qty);
    console.log("sizes:", sizes);
    console.log("toppings:", toppings);

    // Add to Database

    agent.add(
      `Response from server, Well done! We're currently processing your order for ${qty} ${sizes} ${toppings} pizzas. Congratulations!`
    );
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("orderPizza", order);

  _agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
