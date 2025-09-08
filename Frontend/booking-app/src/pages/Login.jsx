import { useState } from "react"
import { BASE_URL } from "../components/constants"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"



const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ emailId: email, password }),
      })

      const data = await res.json()

      if(res.ok) {
        navigate("/")
      }


    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="w-full max-w-sm p-6 rounded-2xl shadow-md bg-white " >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form className="mt-6" onSubmit={handleSubmit} >
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" placeholder="Enter Your Email" className="mt-3 w-full py-2 px-3 border border-gray-300 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />


          <label htmlFor="password" className=" mt-3 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter Your Password" className="mt-3 w-full py-2 px-3 border border-gray-300 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-6 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4" >
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded cursor-pointer" /> Remeber me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full mt-6 py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition duration-200 cursor-pointer">Submit</button>


        </form>
      </div>
    </div>
  )
}

export default Login