const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    // Can also add a custom error message for required by doing:
    // required: "You need to provide a pizza name."
    pizzaName: { type: String, required: true, trim: true },
    createdBy: { type: String, required: true, trim: true },
    createdAt: {
      type: Date,
      default: Date.now,
      // A getter serves as a middleware, causing something to be done when retrieving data
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      // enum is enumerable, which means it can be iterated over
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      default: "Large",
    },
    toppings: [],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  // ID is false because it is a virtual that Mongoose returns, so we don't need it
  // Getters must be set to true to use the getters we create in the model above
  { toJSON: { virtuals: true, getters: true }, id: false }
);

PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// Export the Pizza model
module.exports = Pizza;
