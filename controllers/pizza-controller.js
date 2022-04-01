const { Pizza } = require("../models");

const pizzaController = {
  // Get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get one pizza by ID
  getOnePizzaByID({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No pizza found with this ID" });
          return;
        }

        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};

module.exports = pizzaController;
