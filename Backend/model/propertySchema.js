const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    profileImage : {
      type : String,
      required : true
    },
    images: [
      {
        type: String,
      },
    ],
    location: {
      address: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    availableDates: [
      {
        type: Date,
      },
    ],
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("Property", propertySchema, "properties");
