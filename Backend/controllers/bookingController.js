const Booking = require("../model/bookingSchema");
const Property = require("../model/propertySchema");

const {
  checkDateAvailability,
  generateRequestedDates,
  addDatesBackToProperty,
} = require("../utils/dateUtils");

const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestInfo } = req.body;
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

    const availableDatesNormalized = property.availableDates.map(
      (date) => new Date(date).toISOString().split("T")[0]
    );
    const isAvailableDate = requestedDates.every((date) =>
      availableDatesNormalized.includes(date)
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

    //Price Calculation
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const basePrice = property.pricePerNight * nights;
    const serviceFee = Math.round(basePrice * 0.14); //14%
    const taxes = Math.round(basePrice * 0.12); //12%
    const totalAmount = basePrice + serviceFee + taxes;

    const totalPrice = {
      basePrice,
      serviceFee,
      taxes,
      totalAmount,
    };

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

    const previousStatus = booking.bookingStatus;
    booking.bookingStatus = status;
    await booking.save();

    if (status === "confirmed" && previousStatus !== "confirmed") {
      const property = await Property.findById(booking.propertyId);
      const bookedDates = generateRequestedDates(
        booking.checkIn,
        booking.checkOut
      );

      property.availableDates = property.availableDates.filter((date) => {
        const dateStr = new Date(date).toISOString().split("T")[0];
        return !bookedDates.includes(dateStr);
      });

      await property.save();
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
    const { reason } = req.body;
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

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        error: "Booking is already cancelled",
      });
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24 && isGuest) {
      return res.status(400).json({
        error: "Cannot cancel booking within 24 hours of check-in",
      });
    }

    // Storing original status for date restoration logic
    const wasConfirmed = booking.bookingStatus === "confirmed";

    booking.bookingStatus = "cancelled";

    if (booking.cancellation === undefined) {
      booking.cancellation = {
        cancelledBy: isGuest ? "guest" : "host",
        cancelledAt: new Date(),
        reason: reason || "No reason provided",
      };
    }

    await booking.save();

    if (wasConfirmed) {
      try {
        await addDatesBackToProperty(
          booking.propertyId,
          booking.checkIn,
          booking.checkOut
        );
        console.log(`Restored dates for cancelled booking ${booking._id}`);
      } catch (dateError) {
        console.error("Error restoring dates:", dateError);
        // Don't fail the cancellation if date restoration fails
      }
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
      datesRestored: wasConfirmed,
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
