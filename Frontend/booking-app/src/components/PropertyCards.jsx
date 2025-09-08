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

const PropertyCards = ({ title, coverImg, price, rating, amenities = [] }) => {
  return (
    <>
    <div className="bg-white rounded-2xl shadow-md w-150">
      {/* Cover Img */}
      <img src={coverImg} alt={title}  className="w-full"/>
      



    </div>
    </>
  )
}

export default PropertyCards
