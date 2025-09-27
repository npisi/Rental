import { useEffect, useState } from "react"
import { BASE_URL } from "../components/constants"
import PropertyCards from "../components/PropertyCards"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [propertyData, setPropertyData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const rawData = await fetch(`${BASE_URL}/api/properties`)
      const data = await rawData.json()
      setPropertyData(data)
    } catch (error) {
      console.error("Error fetching properties:", error)
    }
  }

  const onCardClick = (id) => {
    navigate(`/property-details/${id}`)
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Centered Container */}
      <div className="max-w-6xl mx-auto px-6">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Places
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book unique accommodations around the world
          </p>
        </div>

        {/* Properties Grid - Uniform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {propertyData.map((property) => (
            <PropertyCards
              key={property._id}
              id={property._id}
              title={property.title}
              coverImg={property.profileImage}
              price={property.pricePerNight}
              rating={property.rating}
              amenities={property.amenities}
              onCardClick={onCardClick}
            />
          ))}
        </div>

        {/* Loading State */}
        {propertyData.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-[420px] animate-pulse"></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
