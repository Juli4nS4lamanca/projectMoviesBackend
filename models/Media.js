import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  synopsis: String,
  urlMovie: {
    type: String,
    unique: true
  },
  img: String,
  release: Date,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type'
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer'
  },
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdate' }
});

mediaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

export default mongoose.model('Media', mediaSchema);
