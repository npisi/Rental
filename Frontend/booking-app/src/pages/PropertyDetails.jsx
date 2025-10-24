import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BASE_URL } from "../components/constants"
import PropertyImageGallery from "../components/PropertyImageGallery"
import {
    Wifi, Wind, Utensils, Car, Tv, Droplet,
    Snowflake, Dumbbell, Cigarette, Shield, Flame, Waves
} from "lucide-react"
import AvailabilityCalendar from "../components/AvailibilityCalender"

const amenityIcons = {
    wifi: <Wifi className="w-4 h-4" />,
    kitchen: <Utensils className="w-4 h-4" />,
    washer: <Droplet className="w-4 h-4" />,
    dryer: <Wind className="w-4 h-4" />,
    heating: <Flame className="w-4 h-4" />,
    "air conditioning": <Snowflake className="w-4 h-4" />,
    tv: <Tv className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    pool: <Waves className="w-4 h-4" />,
    gym: <Dumbbell className="w-4 h-4" />,
    "smoke alarm": <Cigarette className="w-4 h-4" />, // fallback-ish
    "carbon monoxide alarm": <Shield className="w-4 h-4" />,
}

const PropertyDetails = () => {

    const [propertyData, setPropertyData] = useState([])
    const { id } = useParams()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/properties/${id}`)
            if (!response.ok) throw new Error("Failed to fetch property")
            const data = await response.json()
            setPropertyData(data)

        } catch (err) {
            console.log(err)
        }
    }




    return (
        <>
            <div className="bg-gray-50 min-h-screen px-6 py-8 flex flex-col">
                
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5">
                    {/* LEFT: Property Details */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-semibold mb-2">{propertyData?.title}</h1>
                <p className="text-gray-600">{propertyData?.location?.address}, {propertyData?.location?.city}</p>

                {/* Images */}
                <div className="my-6">
                    <PropertyImageGallery
                        images={propertyData.images}
                        title={propertyData.title}
                        profileImage={propertyData.profileImage}
                    />
                </div>

                        {/* Amenities */}
                        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                            {propertyData?.amenities?.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    {amenityIcons[item.toLowerCase()] || <Wifi className="h-5 w-5" />}
                                    <span className="capitalize">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <h3 className="text-xl font-semibold mb-4">About this place</h3>
                        <p className="text-gray-600 leading-relaxed">{propertyData.description}</p>
                    </div>

                    {/* RIGHT: Booking / Calendar Card */}
                    <div className="w-full lg:w-[420px]">
                        <div className="sticky top-24">
                            <AvailabilityCalendar   
                                availableDates={propertyData?.availableDates}
                                pricePerNight={propertyData?.pricePerNight}
                                propertyId={id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PropertyDetails