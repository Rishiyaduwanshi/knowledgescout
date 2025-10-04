import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: { type: String, required: true },
    query: { type: String, required: true },
    answer: { type: String, required: true },
    sources: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
