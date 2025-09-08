import { useState, useEffect } from "react";
import PropertyForm from "../components/PropertyForm";
import { BASE_URL } from "../components/constants";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

const AMENITY_OPTIONS = [
  "Wifi", "Kitchen", "Washer", "Dryer", "Heating",
  "Air conditioning", "TV", "Parking", "Pool",
  "Gym", "Smoke alarm", "Carbon monoxide alarm"
];

const PropertyFormContainer = ({ mode = "create" }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: "",
    location: { address: "", city: "", state: "", country: "" },
    amenities: [],
    availableDates: []
  });

  const { id } = useParams()
  const [profileImage, setProfileImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const addDateRange = () => {
    if (startDate && endDate) {
      const dates = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setSelectedDates(prev => [...prev, ...dates]);
      setFormData(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, ...dates.map(date => date.toISOString())]
      }));

      // Reset date range picker
      setDateRange([null, null]);
    }
  };

  // Remove a specific date
  const removeDate = (dateToRemove) => {
    const filteredDates = selectedDates.filter(date =>
      date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(filteredDates);
    setFormData(prev => ({
      ...prev,
      availableDates: filteredDates.map(date => date.toISOString())
    }));
  };

  // Clear all dates
  const clearAllDates = () => {
    setSelectedDates([]);
    setFormData(prev => ({
      ...prev,
      availableDates: []
    }));
  };




  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`${BASE_URL}/properties/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title,
            description: data.description,
            pricePerNight: data.pricePerNight,
            location: data.location,
            amenities: data.amenities,
            availableDates: data.availableDates,
          })
        })
        .catch((err) => console.log(err))
    }
  }, [mode, id])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const url = mode === "create" ? `${BASE_URL}/api/properties` : `${BASE_URL}/api/properties/${id}`;
            const method = mode === "create" ? "POST" : "PATCH";
            
            const formDataToSend = new FormData();
            
            // Handle form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "location") {
                    Object.entries(value).forEach(([locKey, locValue]) => {
                        formDataToSend.append(`location[${locKey}]`, locValue);
                    });
                } else if (key === "availableDates") {
                    // Send dates as ISO strings
                    value.forEach((date) => 
                        formDataToSend.append("availableDates[]", date)
                    );
                } else if (Array.isArray(value)) {
                    value.forEach((item) => 
                        formDataToSend.append(`${key}[]`, item)
                    );
                } else {
                    formDataToSend.append(key, value);
                }
            });

            if (profileImage) formDataToSend.append("profileImage", profileImage);
            galleryImages.forEach((img) => formDataToSend.append("images", img));

            const response = await fetch(url, {
                method,
                body: formDataToSend,
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to save property");
            alert("Property saved successfully!");
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PropertyForm
            mode={mode}
            formData={formData}
            handleInputChange={handleInputChange}
            toggleAmenity={toggleAmenity}
            profileImage={profileImage}
            galleryImages={galleryImages}
            setProfileImage={setProfileImage}
            setGalleryImages={setGalleryImages}
            isSubmitting={isSubmitting}
            errors={errors}
            AMENITY_OPTIONS={AMENITY_OPTIONS}
            handleSubmit={handleSubmit}
            // Pass date-related props
            selectedDates={selectedDates}
            dateRange={dateRange}
            setDateRange={setDateRange}
            addDateRange={addDateRange}
            removeDate={removeDate}
            clearAllDates={clearAllDates}
        />
    );

}

export default PropertyFormContainer