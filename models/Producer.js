import mongoose from "mongoose";

const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  state: {
    type: Boolean,
    default: true
  },
  description: String,
  slogan: String,
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdate' }
});

producerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

export default mongoose.model('Producer', producerSchema);
