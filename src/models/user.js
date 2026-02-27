import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // User's name
    name: {
      type: String,
      trim: true,
      required: true,
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
    },

    // Number of articles authored
    articlesAmount: {
      type: Number,
      default: 0,
    },

    // Reference to saved articles
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stories',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// Hide sensitive data during serialization
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
