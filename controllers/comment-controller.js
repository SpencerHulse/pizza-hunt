const { Comment, Pizza } = require("../models");

const commentController = {
  // Add comment to a pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No pizza found with this ID" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  // Remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((data) => {
        if (!data) {
          return res
            .status(404)
            .json({ message: "There is no comment with this ID" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no pizza with this ID" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
