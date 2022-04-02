const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: { type: String },
    createdBy: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      // A getter serves as a middleware, causing something to be done when retrieving data
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: { type: String, default: "Large" },
    toppings: [],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  // ID is false because it is a virtual that Mongoose returns, so we don't need it
  // Getters must be set to true to use the getters we create in the model above
  { toJSON: { virtuals: true, getters: true }, id: false }
);

PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// Export the Pizza model
module.exports = Pizza;
