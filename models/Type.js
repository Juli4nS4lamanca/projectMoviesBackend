import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: String,
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdate' }
});

typeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

export default mongoose.model('Type', typeSchema);
