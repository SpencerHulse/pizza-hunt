const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema(
  {
    pizzaName: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    size: { type: String, default: "Large" },
    toppings: [],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  // ID is false because it is a virtual that Mongoose returns, so we don't need it
  { toJSON: { virtuals: true }, id: false }
);

PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// Export the Pizza model
module.exports = Pizza;
