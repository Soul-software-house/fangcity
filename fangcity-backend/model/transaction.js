const mongoose = require("mongoose");
const { randomUUID } = require('crypto');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: "UUID",
    default: () => randomUUID(),
  },
  walletId: {
    type: String,
    requried: true,
  },
  burn: {
    type: Boolean,
  },
  offChainApply: {
    type: Boolean,
  },
  meta: {
    type: [Object],
    required: true,
  },
});

transactionSchema.methods.toJSON = function () {
    const transaction = this;
    const transactionObject = transaction.toObject();
    return transactionObject;
  };

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
