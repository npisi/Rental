const Booking = require("../model/bookingSchema");
const Property = require("../model/propertySchema");

const checkDateAvailability = async (propertyId, checkIn, checkOut) => {
  try {
    const overlappingBookings = await Booking.find({
      propertyId,
      bookingStatus: {
        $in: ["confirmed", "pending"],
      },
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });
    return overlappingBookings.length === 0;
  } catch (err) {
    throw new Error("Error checking date availability: " + err.message);
  }
};

const generateRequestedDates = (checkIn, checkOut) => {
  const requestedDates = [];
  let current = new Date(checkIn);

  // exclusive of checkOut day (typical booking logic)
  const endDate = new Date(checkOut);
  while (current < endDate) {
    requestedDates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return requestedDates;
};

const addDatesBackToProperty = async (propertyId, checkIn, checkOut) => {
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return { success: false, error: "Property not found" };
    }

    const datesToAdd = generateRequestedDates(checkIn, checkOut);

    // Normalize dates for comparison
    const existingDatesNormalized = property.availableDates.map(
      date => new Date(date).toISOString().split('T')[0]
    );

    // Merging and deduplicate
    const mergedDates = Array.from(
      new Set([...existingDatesNormalized, ...datesToAdd])
    );

    // Converting back to Date objects and update property
    property.availableDates = mergedDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);

    await property.save();

    return { 
      success: true, 
      addedDates: datesToAdd,
      totalAvailable: property.availableDates.length 
    };

  } catch (err) {
    return { 
      success: false, 
      error: err.message 
    };
  }
};

const removeExpiredDates = async (property) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const validDates = property.availableDates.filter(date => {
    const propertyDate = new Date(date)
    propertyDate.setHours(0,0,0,0)
    return propertyDate >= today
  })

  if(validDates.length !== property.availableDates.length){
    property.availableDates = validDates
    await property.save()
    console.log(`Cleaned up ${property.availableDates.length - validDates.length} expired dates`);
  }

  return property;


}

module.exports = {
  checkDateAvailability,
  generateRequestedDates,
  addDatesBackToProperty,
  removeExpiredDates
};
