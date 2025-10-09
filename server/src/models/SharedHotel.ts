import mongoose, { Schema, Document } from 'mongoose';

export interface ISharedHotel extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  message?: string;
  status: 'pending' | 'viewed' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const SharedHotelSchema = new Schema<ISharedHotel>({
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
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'accepted', 'declined'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient queries
SharedHotelSchema.index({ receiver: 1, status: 1 });
SharedHotelSchema.index({ sender: 1, status: 1 });
SharedHotelSchema.index({ hotel: 1 });

export default mongoose.model<ISharedHotel>('SharedHotel', SharedHotelSchema);
