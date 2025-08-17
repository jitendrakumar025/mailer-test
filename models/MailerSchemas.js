const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    sesMessageId: { type: String }, // returned by SES after sending
    status: { type: String, default: "Pending" }, // no enum, plain string
    error: { type: String }, // optional error message
    isOpened: { type: Boolean, default: false },
    isClicked: { type: Boolean, default: false },
    bulkBatchId: { type: mongoose.Schema.Types.ObjectId, ref: "BulkBatch" },
  },
  { timestamps: true }
);

const BulkBatchSchema = new mongoose.Schema(
  { 
    sourceMail:{type:String,required:true},
    totalRecipients: { type: Number, default: 0 },
    totalOpens: { type: Number, default: 0 },
    totalLinkClicks: { type: Number, default: 0 },
    templateName: { type: String }, // optional
  },
  { timestamps: true }
);

const EmailLog = mongoose.model("EmailLog", EmailLogSchema);
const BulkBatch = mongoose.model("BulkBatch", BulkBatchSchema);

module.exports = { EmailLog, BulkBatch };
