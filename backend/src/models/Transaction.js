import mongoose from 'mongoose';
import { categories, transactionTypes } from '../utils/categories.js';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: transactionTypes,
      required: true
    },
    merchant: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      enum: categories,
      default: 'Other'
    },
    source: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'Manual'
    },
    note: {
      type: String,
      trim: true,
      maxlength: 400,
      default: ''
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);
