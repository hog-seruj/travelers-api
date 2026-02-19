import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Category = model('Category', categorySchema);
