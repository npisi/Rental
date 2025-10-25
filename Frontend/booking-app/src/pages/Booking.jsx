import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BASE_URL } from "../components/constants"

const Booking = () => {

    const { id: bookingId } = useParams()
    const navigate = useNavigate()
    const [bookingData, setBookingData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookingDetails()
    }, [bookingId])

    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/booking/${bookingId}`, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Failed to fetch the booking details')
            }

            const data = await response.json()
            setBookingData(data)

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
        </>
    )
}
export default Booking  