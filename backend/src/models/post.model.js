const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String, trim: true }],
    featuredImage: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Other"],
      default: "Other",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);
