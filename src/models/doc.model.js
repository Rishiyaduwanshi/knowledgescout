import mongoose from 'mongoose';

const docSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    metadata : {type : Object },
    error: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Doc', docSchema);
