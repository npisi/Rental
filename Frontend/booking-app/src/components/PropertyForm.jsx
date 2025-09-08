import ImageUploader from "../components/ImageUploader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

const PropertyForm = ({ 
   mode, 
    formData, 
    handleInputChange, 
    toggleAmenity,
    profileImage, 
    galleryImages, 
    setProfileImage, 
    setGalleryImages,
    isSubmitting, 
    errors, 
    AMENITY_OPTIONS, 
    handleSubmit,
    // Date-related props
    selectedDates,
    dateRange,
    setDateRange,
    addDateRange,
    removeDate,
    clearAllDates }) => {

        const [startDate, endDate] = dateRange;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 bg-white rounded-2xl">
            <header className="mb-6 flex tems-center justify-between ">
                <div> <h1 className="font-semibold text-2xl"> {mode === "create" ? "Add property" : "Edit property"} </h1>
                    <p className="text-gray-500 text-sm">Provide details to list the property.</p>
                </div>
                <button type="submit" form="property-form" disabled={isSubmitting} className=" cursor-pointer rounded-2xl ">
                    {isSubmitting ? "Saving..." : mode === "create" ? "Publish listing" : "Save changes"}</button>
            </header>
            <form id="property-form" onSubmit={handleSubmit}>
                <label className="block text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border p-2 rounded-xl w-2xl"
                    placeholder="Enter your title"
                />

                <label className="block mt-2 text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="border p-2 rounded-xl w-2xl"
                    placeholder="Enter description"
                />

                {/* Location */}
                <label className="block mt-2 text-gray-700">Location</label>
                <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="border p-2 rounded-xl block w-2xl "
                />
                <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="border p-2 rounded-xl   mt-1"
                />
                <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="border p-2 rounded-xl ml-1 mt-1"
                />
                <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="border p-2 rounded-xl ml-1 mt-1"
                />

                {/* Price */}
                <label className="block mt-2 text-gray-700">Nightly Price</label>
                <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="border p-2 rounded-xl w-2xl"
                />

                {/* Amenities */}
                <section className="border rounded-xl p-4 mt-3">
                    <h2 className="text-md text-gray-700">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {AMENITY_OPTIONS.map((a) => (
                            <label key={a} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(a)}
                                    onChange={() => toggleAmenity(a)}
                                />
                                {a}
                            </label>
                        ))}
                    </div>
                </section>

                  
                {/* Available Dates Section */}
                <div className="space-y-4 mt-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Available Dates
                    </label>
                    
                    {/* Date Range Picker */}
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => setDateRange(update)}
                                placeholderText="Select date range"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                isClearable
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addDateRange}
                            disabled={!startDate || !endDate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Add Dates
                        </button>
                    </div>

                    {/* Selected Dates Display */}
                    {selectedDates.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-700">
                                    Selected Available Dates ({selectedDates.length} days)
                                </h4>
                                <button
                                    type="button"
                                    onClick={clearAllDates}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Clear All
                                </button>
                            </div>
                            
                            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {selectedDates
                                        .sort((a, b) => a - b)
                                        .map((date, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-sm"
                                            >
                                                <span>
                                                    {date.toLocaleDateString()}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDate(date)}
                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedDates.length === 0 && (
                        <p className="text-gray-500 text-sm italic">
                            No available dates selected. Property will be marked as unavailable.
                        </p>
                    )}
                </div>

                {/* ImageUploader */}
                <ImageUploader
                    profileImage={profileImage}
                    galleryImages={galleryImages}
                    onProfileImageChange={setProfileImage}
                    onGalleryImagesChange={setGalleryImages}
                />

                {errors.submit && (
                    <p className="text-red-600 mt-2">{errors.submit}</p>
                )}


            </form>
        </div>
    )
}

export default PropertyForm