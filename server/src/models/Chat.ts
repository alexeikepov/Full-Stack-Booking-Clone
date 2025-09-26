import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageAt: -1 });

export default mongoose.model<IChat>('Chat', ChatSchema);
