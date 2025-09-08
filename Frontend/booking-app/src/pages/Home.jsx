import { useEffect, useState } from "react"
import Header from "../components/Header"
import { BASE_URL } from "../components/constants"
import PropertyCards from "../components/PropertyCards"

const Home = () => {

    const [propertyData, setPropertyData] = useState([])

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
    return (
        <>
            <Header />
            <div className="bg-gray-300 min-h-screen flex flex-col items-center">

                {propertyData.map((item) => (
                    <PropertyCards
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