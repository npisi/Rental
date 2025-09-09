import { useState } from "react"
import { useFormValidation } from "../hooks/useFormValidation"
import { BASE_URL } from "../components/constants"
import { useNavigate, Link } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user"
    })
    const { errors, validateForm, clearFieldError } = useFormValidation()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()



    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            clearFieldError(name);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm(formData);
        if (!isValid) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailId: formData.email,
                    password: formData.password,
                    role: formData.role
                }),
                credentials: 'include'
            })

            if (response.ok) {
                const result = await response.text()
                alert('Account Created')

                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: "user"
                })
                
                navigate('/login')

            } else {
                // Server error
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
            }
        } catch (err) {
            console.error('Network error:', err);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }

    };


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-300">
                <div className="w-full max-w-sm bg-white p-6  rounded-2xl shadow-md">
                    <h1 className="text-center font-bold text-2xl text-gray-800">SignUp</h1>

                    <form className="m-6" onSubmit={handleSubmit} >

                         {/* First Name */}
                        <label htmlFor="firstName" className=" block font-bold  text-gray-700">First Name : </label>
                        <input type="text" placeholder="Enter Your First Name" name="firstName" id="firstName" className="mt-2 w-full  py-2 px-3 border border-gray-300 rounded-xl" value={formData.firstName} onChange={handleChange} required />

                         {/* Last Name */}
                        <label htmlFor="lastName" className=" mt-3 block font-bold  text-gray-700">Last Name : </label>
                        <input type="text" placeholder="Enter Your Last Name" id="lastName" name="lastName" className="mt-2 w-full  py-2 px-3 border border-gray-300 rounded-xl" value={formData.lastNameName} onChange={handleChange} required />

                         {/* Email */}
                        <label htmlFor="email" className=" mt-3 block font-bold  text-gray-700">Email : </label>
                        <input type="email" placeholder="Enter Your Email" id="email" name="email" className="mt-2 py-2 w-full  px-3 border border-gray-300 rounded-xl" value={formData.email} onChange={handleChange} required />

                         {/* Password */}
                        <label htmlFor="password" className="mt-3 block font-bold text-gray-700">Password :</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Enter Your Password"
                                className={`mt-2 w-full py-2 px-3 border rounded-xl ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-5 cursor-pointer text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <p className="error text-red-500 text-sm">{errors.password}</p>}

                         {/* Role */}
                        <label htmlFor="role" className="block  font-bold text-gray-700 mt-3" >Role : </label>
                        <select id="role" name="role" className="w-full mt-3 py-2 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-white" value={formData.role} onChange={handleChange} required>
                            <option value="user">User</option>
                            <option value="host">Host</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full mt-6 py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <Link to={"/login"}><p className="text-blue-500 hover:underline mt-2">Already an User? Click to Login</p></Link>
                    </form>
                    
                </div>

            </div>

        </>
    )
}

export default Signup 