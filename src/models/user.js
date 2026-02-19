import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // User's name
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // Email for authentication
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    // Password for authentication
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Avatar URL
    avatarUrl: {
      type: String,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },

    // Profile description
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Number of articles authored
    articlesAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Reference to saved articles
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Traveller',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// Middleware: If name is not provided, use part of email before @
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

// Hide sensitive data during serialization
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
