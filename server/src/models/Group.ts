import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  hotel: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['planning', 'booked', 'completed', 'cancelled'],
    default: 'planning'
  }
}, {
  timestamps: true
});

// Index for efficient queries
GroupSchema.index({ creator: 1 });
GroupSchema.index({ members: 1 });
GroupSchema.index({ hotel: 1 });
GroupSchema.index({ status: 1 });

export default mongoose.model<IGroup>('Group', GroupSchema);
