import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BASE_URL } from "../components/constants"

const PropertyDetails = () => {

    const [propertyData, setPropertyData] = useState([])
    const { id } = useParams()

    useEffect(()=> {
        fetchData()
    },[])
    
    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/properties/${id}`)
            if (!response.ok) throw new Error("Failed to fetch property")
            const data = await response.json()
            setPropertyData(data)
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }




    return (
        <>
        </>
    )
}
export default PropertyDetails