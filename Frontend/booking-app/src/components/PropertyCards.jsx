import { 
  Wifi, Wind, Utensils, Car, Tv, Droplet, 
  Snowflake, Dumbbell, Cigarette, Shield, Flame, Waves 
} from "lucide-react"

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

const PropertyCards = ({ id, title, coverImg, price, rating, amenities = [],onCardClick }) => {
  return (
    <>
    <div className="bg-white rounded-2xl shadow-md w-150 cursor-pointer  transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-lg m-3" onClick={() => onCardClick(id)} >
      {/* Cover Img */}
      <img src={coverImg} alt={title}  className="w-full h-40 rounded-t-2xl object-cover"/>
      
      {/* Card Content  */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>

        {/* Rating + Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-yellow-700"> ⭐ {rating}</span>
          <span className="text-base font-bold text-gray-700"> ₹{price}</span>
        </div>

        {/* Amentities */}
        <div className="flex flex-wrap gap-2 mt-2">
          {amenities.slice(0,6).map((amenity, index) => (
            <span key={index} className="flex items-center bg-gray-100 gap-1 rounded-full px-2 py-1 text-gray-600 ">
              {amenityIcons[amenity.toLowerCase()] || "🏠"} {amenity}
            </span>
          ))}
          {amenities.length > 6 && (
            <span className="text-xs  text-gray-500">+{amenities.length - 6} more</span>
          )}
        </div>

      </div>



    </div>
    </>
  )
}

export default PropertyCards
