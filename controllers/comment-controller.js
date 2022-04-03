const { Comment, Pizza } = require("../models");

const commentController = {
  // Add comment to a pizza
  addComment({ params, body }, res) {
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

  // Add reply
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
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

  // Remove a reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
