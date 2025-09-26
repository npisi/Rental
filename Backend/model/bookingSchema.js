const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  guestId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guestInfo: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    totalGuests: {
      type: Number,
      required: true,
    },
  },
  totalPrice: {
    basePrice: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "completed", "pending"],
    default: "pending",
  },
 
}, {timestamps : true});

module.exports =model("Booking", bookingSchema, "bookings")
