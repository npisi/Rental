import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, Plus, Minus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";

const AvailabilityCalendar = ({ availableDates, pricePerNight, propertyId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCalenderDropDown, setShowCalenderDropDown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);


  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const calendarRef = useRef(null);
  const guestRef = useRef(null);

  const navigate = useNavigate()
  const [isBooking, setIsBooking] = useState(false);


  const availableDateStrings =
    availableDates?.map(
      (date) => new Date(date).toISOString().split("T")[0]
    ) || [];

  //  Handle clicks outside (both dropdowns)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalenderDropDown(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDateAvailable = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return availableDateStrings.includes(dateStr);
  };

  const filterDate = (date) => {
    if (date < new Date().setHours(0, 0, 0, 0)) return false;
    return isDateAvailable(date);
  };



  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setShowCalenderDropDown(false);
    }
  };

  const calculateTotals = () => {
    if (startDate && endDate && pricePerNight) {
      const nights = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const basePrice = nights * pricePerNight;
      const serviceFee = Math.round(basePrice * 0.14);
      const taxes = Math.round(basePrice * 0.12);
      return {
        nights,
        basePrice,
        serviceFee,
        taxes,
        total: basePrice + serviceFee + taxes,
      };
    }
    return null;
  };

  const totals = calculateTotals();

  const handleClick = async () => {
    setIsBooking(true)

    try {
      const guestInfo = {
        adults: adults,
        children: children,
        totalGuests: adults + children
      }

      const bookingData = {
        propertyId: propertyId,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        guestInfo: guestInfo
      }

      const response = await fetch(`${BASE_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (response.ok) {
        // Booking successful - navigate to booking confirmation page
        navigate(`/booking-confirmation/${result.booking._id}`);
      } else {
        // Handle API errors
        alert(result.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <div
      className="w-full max-w-md mx-auto p-5 bg-white rounded-2xl shadow-lg border border-gray-100 mt-6 relative"
      ref={calendarRef}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Select Your Dates</h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-xl font-bold text-gray-800">
            ₹{pricePerNight ? pricePerNight.toLocaleString() : 0}
          </span>
          <span className="text-gray-600">per night</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        {/* Date Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className="bg-white p-2 rounded-lg border-2 cursor-pointer"
            onClick={() => setShowCalenderDropDown(!showCalenderDropDown)}
          >
            <label className="block text-xs font-medium text-gray-500 uppercase">
              Check In
            </label>
            <span className="text-lg font-semibold text-gray-800">
              {startDate?.toLocaleDateString("en-IN") || "Select date"}
            </span>
          </div>

          <div
            className="bg-white p-2 rounded-lg border-2 cursor-pointer"
            onClick={() => setShowCalenderDropDown(!showCalenderDropDown)}
          >
            <label className="block text-xs font-medium text-gray-500 uppercase">
              Check Out
            </label>
            <span className="text-lg font-semibold text-gray-800">
              {endDate?.toLocaleDateString("en-IN") || "Select date"}
            </span>
          </div>
        </div>

        {/* ✅ Calendar Dropdown */}
        {showCalenderDropDown && (
          <div className="flex justify-center mb-6 z-50 relative">
            <div className="min-w-[485px]">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={2}
                filterDate={filterDate}
                minDate={new Date()}
                className="border-0"
                calendarClassName="shadow-lg border-0 rounded-xl"
                showDisabledMonthNavigation={false}
              />
            </div>
          </div>
        )}

        {/* 👥 Guest Selector */}
        <div className="relative mb-6" ref={guestRef}>
          <div
            className="flex justify-between items-center bg-white p-3 rounded-lg border-2 cursor-pointer"
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">
                  Guests
                </label>
                <span className="text-lg font-semibold text-gray-800">
                  {adults + children} Guest{adults + children > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>

          {/* Dropdown menu */}
          {showGuestDropdown && (
            <div className="absolute z-50 bg-white shadow-lg rounded-xl p-4 w-full mt-2 border border-gray-100">
              {/* Adults */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">Adults</h4>
                  <p className="text-sm text-gray-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="font-semibold">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">Children</h4>
                  <p className="text-sm text-gray-500">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="font-semibold">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 💰 Price Breakdown */}
        {totals && (
          <div className="space-y-4">
            <h4 className="text-gray-800 font-semibold">Price Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">
                  ₹{pricePerNight.toLocaleString()} × {totals.nights} nights
                </span>
                <span className="font-medium text-gray-800">
                  ₹{totals.basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Service Fee</span>
                <span className="font-medium text-gray-800">
                  ₹{totals.serviceFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Taxes</span>
                <span className="font-medium text-gray-800">
                  ₹{totals.taxes.toLocaleString()}
                </span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-gray-800">
                    ₹{totals.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-[#2596be] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:bg-[#2185aa] mt-6"
              onClick={handleClick}
            >
              Reserve Now
            </button>
          </div>
        )}
      </div>

      {/* No Dates Available */}
      {availableDates?.length === 0 && (
        <div className="text-center py-8 px-4 bg-gray-50 rounded-xl mt-4">
          <div className="text-gray-400 text-lg mb-2">📅</div>
          <p className="text-gray-600 font-medium">
            This property has no available dates at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
