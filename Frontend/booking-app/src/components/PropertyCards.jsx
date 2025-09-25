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
  "smoke alarm": <Cigarette className="w-4 h-4" />,
  "carbon monoxide alarm": <Shield className="w-4 h-4" />,
}

const PropertyCards = ({ id, title, coverImg, price, rating, amenities = [], onCardClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-md cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl overflow-hidden w-full h-[420px] flex flex-col"
      onClick={() => onCardClick(id)}
    >
      {/* Cover Image - Fixed Height */}
      <div className="relative h-48 flex-shrink-0">
        <img 
          src={coverImg} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
      
      {/* Card Content - Flexible */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title - Fixed Height */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 h-14 overflow-hidden">
          {title}
        </h2>

        {/* Price - Fixed Position */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">per night</span>
          <span className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
        </div>

        {/* Amenities - Fixed Container Height */}
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2 h-16 overflow-hidden">
            {amenities.slice(0, 4).map((amenity, index) => (
              <span 
                key={index} 
                className="flex items-center bg-gray-100 gap-1 rounded-full px-2 py-1 text-xs text-gray-600 h-6"
              >
                {amenityIcons[amenity.toLowerCase()] || "🏠"} 
                <span className="truncate max-w-12">{amenity}</span>
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCards
