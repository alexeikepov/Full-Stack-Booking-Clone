import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index to prevent duplicate friend requests
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Index for efficient queries
FriendRequestSchema.index({ receiver: 1, status: 1 });
FriendRequestSchema.index({ sender: 1, status: 1 });

export default mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
