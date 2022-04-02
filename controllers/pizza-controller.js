const { Pizza } = require("../models");

const pizzaController = {
  // Get all pizzas
  getAllPizza(req, res) {
    // The select tells it to only find something, but using the minus has it exclude that variable
    // Therefore, the -__v excludes that variable from the returned data
    Pizza.find({})
      // Populate deals with other documents
      .populate({ path: "comments", select: "-__v" })
      // Select deals with the model and its document
      .select("-__v")
      // Sorts by ID value in DESC order. Works because there is a timestamp inside mongoose IDs.
      .sort({ _id: -1 })
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get one pizza by ID
  getOnePizzaByID({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({ path: "comments", select: "-__v" })
      .select("-__v")
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

  // Create a pizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json(err));
  },

  // Update a pizza
  updatePizza({ params, body }, res) {
    // new: true tells mongoose to return the new version
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No pizza found with this ID" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Delete a pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No pizza found with this ID" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
