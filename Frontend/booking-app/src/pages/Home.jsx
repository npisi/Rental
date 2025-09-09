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
    }

    return (
        <>
            
            <div className="bg-gray-300 min-h-screen flex flex-col items-center">

                {propertyData.map((item) => (
                    <PropertyCards onCardClick={onCardClick}
                        id={item._id} 
                        key={item._id}
                        title={item.title}
                        coverImg= {item.profileImage}
                        rating = {item.rating}
                        price = {item.pricePerNight}
                        amenities={item.amenities}
                    />
                ))}

            </div>
        </>
    )
}

export default Home