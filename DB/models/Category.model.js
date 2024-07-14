import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name must be entered"],
      minLength: [3, "name is too short"],
      maxlength: [20, "name is too long"],
      trim: true,
    },
  
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
   }
);

// virtual populate for subCategories model
categorySchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'categoryId',
})

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
