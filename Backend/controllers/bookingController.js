const Booking = require("../model/bookingSchema");
const Property = require("../model/propertySchema");
const User = require("../model/userSchema");
const {
  checkDateAvailability,
  generateRequestedDates,
  addDatesBackToProperty,
} = require("../utils/dateUtils");

const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestInfo, totalPrice } = req.body;
    const guestId = req.user.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Prevent host from booking their own property
    if (property.hostId.toString() === guestId) {
      return res
        .status(400)
        .json({ error: "You cannot book your own property" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    if (checkInDate < new Date()) {
      return res
        .status(400)
        .json({ error: "Check-in date cannot be in the past" });
    }

    const requestedDates = generateRequestedDates(checkInDate, checkOutDate);
    const isAvailableDate = requestedDates.every((date) =>
      property.availableDates.includes(date)
    );
    if (!isAvailableDate) {
      return res
        .status(400)
        .json({ error: "Selected dates are not available for this property" });
    }

    const isAvailable = await checkDateAvailability(
      propertyId,
      checkInDate,
      checkOutDate
    );
    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "Property is not available for the selected dates" });
    }

    const booking = new Booking({
      propertyId,
      guestId,
      hostId: property.hostId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestInfo,
      totalPrice,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    await booking.save();

    await booking.populate([
      { path: "propertyId", select: "title location profileImage" },
      { path: "guestId", select: "firstName lastName emailId" },
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating booking: " + err.message });
  }
};

//Get Single Booking Details
const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id)
      .populate("propertyId", "title location profileImage pricePerNight")
      .populate("guestId", "firstName lastName emailId")
      .populate("hostId", "firstName lastName emailId");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    if (
      booking.guestId._id.toString() !== userId &&
      booking.hostId._id.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this booking" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Error fetching booking: " + err.message });
  }
};

//Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isGuest = booking.guestId.toString() === userId;
    const isHost = booking.hostId.toString() === userId;

    if (!isGuest && !isHost) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this booking" });
    }

    booking.bookingStatus = status;
    await booking.save();

    if (status === "confirmed") {
      const property = await Property.findById(booking.propertyId);
      const bookedDates = generateRequestedDates(
        booking.checkIn,
        booking.checkOut
      );

      property.availableDates = property.availableDates.filter(
        (date) => !bookedDates.includes(date)
      );

      await booking.save();
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    res.status(500).send("error" + err);
  }
};

const cancelBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isGuest = booking.guestId.toString() === userId;
    const isHost = booking.hostId.toString() === userId;

    if (!isGuest && !isHost) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this booking" });
    }

    if (booking.bookingStatus === "completed") {
      return res.status(400).json({ error: "Cannot cancel completed booking" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    await addDatesBackToProperty(
      booking.propertyId,
      booking.checkIn,
      booking.checkOut
    );

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    res.status(500).send("error" + err);
  }
};

module.exports = {
  createBooking,
  getBookingDetails,
  updateBookingStatus,
  cancelBookingStatus,
};
