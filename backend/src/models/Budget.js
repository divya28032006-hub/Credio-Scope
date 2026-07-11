import mongoose from 'mongoose';
import { categories } from '../utils/categories.js';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: categories.filter((category) => category !== 'Salary'),
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/
    }
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
