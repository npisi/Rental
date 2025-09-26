const Booking = require("../model/bookingSchema");
const Property = require("../model/propertySchema");

const checkDateAvailability = async (propertyId, checkIn, checkOut) => {
    try{
        const overlappingBookings =  await Booking.find({
            propertyId,
            bookingStatus : {
                $in: ["confirmed" , "pending"]
            },
            $or : [
                {
                    checkIn : {$lt : checkOut},
                    checkOut : {$gt : checkIn}
                }
            ]
        })
        return overlappingBookings.length === 0;
    }catch (err) {
    throw new Error("Error checking date availability: " + err.message);
  }
}

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
  try{
    const property = await Property.findById(propertyId)
    if(!property){
      return resizeBy.status(404).json({message : "Property Not Found"})
    }

    const datesToAdd = generateRequestedDates(checkIn, checkOut)

    const updatedAvailability = Array.form(
      new Set([...property.availableDates, ...datesToAdd])
    )

    property.availableDates = updatedAvailability
    await property.save()

    return property.availableDates;

  }catch(err){
    res.status(500).send(err)
  }
}


module.exports = {checkDateAvailability , generateRequestedDates, addDatesBackToProperty}