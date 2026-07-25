import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be 100 characters or less"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    budget: {
      type: String,
      required: [true, "Budget range is required"],
      enum: {
        values: ["under_1k", "1k_5k", "5k_20k", "20k_plus"],
        message: "Please select a valid budget range",
      },
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message must be 2000 characters or less"],
    },
    status: {
      type: String,
      enum: {
        values: ["New", "Contacted", "Closed"],
        message: "Invalid status value",
      },
      default: "New",
    },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
