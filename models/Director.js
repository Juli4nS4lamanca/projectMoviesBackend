import mongoose from "mongoose";

const directorSchema = new mongoose.Schema({
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
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdate' }
});

directorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

export default mongoose.model('Director', directorSchema);
