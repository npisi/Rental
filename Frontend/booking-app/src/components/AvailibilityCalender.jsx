import { useState } from "react"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const AvailabilityCalendar = ({ availableDates, pricePerNight }) => {

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const availableDateStrings = availableDates?.map(date => new Date(date).toISOString().split("T")[0]) || []

    // Checking if a date is available
    const isDateAvailable = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return availableDateStrings.includes(dateStr);
    };

    // Filtering available dates (disable unavailable dates)
    const filterDate = (date) => {
        if (date < new Date().setHours(0, 0, 0, 0)) {
            return false
        }
        return isDateAvailable(date);
    }

    const getDayClassName = (date) => {
        const dateStr = date.toISOString().split('T')[0]
        const today = new Date().setHours(0, 0, 0, 0)

        if (date < today) {
            return 'past-date';
        }

        if (availableDateStrings.includes(dateStr)) {
            return 'available-date';
        }

        return 'unavailable-date';
    }

    const handleDateChange = (dates) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)



    }

    const calculateTotals = () => {
        if (startDate && endDate && pricePerNight) {
            const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
            const basePrice = nights * pricePerNight;
            const serviceFee = Math.round(basePrice * 0.14)
            const taxes = Math.round(basePrice * 0.12)
            return { nights, basePrice, serviceFee, taxes, total: basePrice + serviceFee + taxes }
        }
        return null;
    }

    const totals = calculateTotals()



    return (
        <>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold">Select Your Dates</h3>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-xl font-bold text-gray-800">₹{pricePerNight ? pricePerNight.toLocaleString() : 0}</span>
                        <span className="text-gray-600">per night</span>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        monthsShown={2}
                        filterDate={filterDate}
                        getDayClassName={getDayClassName}
                        minDate={new Date()}
                        className="border-0"
                        calendarClassName="shadow-lg border-0 rounded-xl"
                        showDisabledMonthNavigation={false}
                    />
                </div>
                {startDate && (
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-2 rounded-lg border-2 ">
                                <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase" >Check In</label>
                                <span className="text-lg font-semibold text-gray-800">
                                    {startDate.toLocaleDateString("en-IN")}
                                </span>
                            </div>
                            {endDate && (
                                <div className="bg-white p-2 rounded-lg border-2 ">
                                    <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase" >Check out</label>
                                    <span className="text-lg font-semibold text-gray-800">
                                        {endDate.toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                            )}
                        </div>
                        {totals && (
                            <div className="space-y-4">
                                <h4 className="text-gray-800 font-semibold">Price Breakdown</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700">₹{pricePerNight.toLocaleString()} × {totals.nights} nights</span>
                                        <span className="font-medium text-gray-800">₹{totals.basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700">Service Fee</span>
                                        <span className="font-medium text-gray-800">₹{totals.serviceFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700">Taxes</span>
                                        <span className="font-medium text-gray-800">₹{totals.taxes.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800">Total</span>
                                            <span className="text-xl font-bold text-gray-800">₹{totals.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-[#2596be] text-white  font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:bg-[#2185aa] mt-6"
                                    onClick={() => handleDateChange([startDate, endDate])}
                                >
                                    Reserve Now
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* No Dates Availability Message */}
                {availableDates?.length === 0 && (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-xl">
                        <div className="text-gray-400 text-lg mb-2">📅</div>
                        <p className="text-gray-600 font-medium">This property has no available dates at the moment.</p>
                    </div>
                )}

            </div>
        </>
    )
}
export default AvailabilityCalendar