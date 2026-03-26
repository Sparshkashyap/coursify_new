import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },

    image: { type: String, default: "" },
    video: { type: String, default: "" },

    notes: { type: String, default: "" },
    transcript: { type: String, default: "" },
    topicTags: [{ type: String }],

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published", "rejected"],
      default: "published",
    },
     category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);

