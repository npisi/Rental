import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

const Header = () => {
    return (
        <>
            <nav className="nav bg-gray-500 h-14 flex text-slate-800 p-2 accent-blue-500 justify-between ">
                <div className="flex  flex-1">
                    <img src={logo} className="w-11 h-11  bg-white rounded-full" />
                    <input type="text" placeholder="Browse Properties" className="bg-white rounded-2xl flex-1 ml-2 px-2 " />
                </div>
                <div className="flex ml-2 gap-6">
                    <span className="mt-2 cursor-pointer  hover:text-white ">Discover.Book.Belong</span>
                    <span className="mt-2 cursor-pointer  hover:text-white ">Help</span>
                    <Link to={"/login"} className="mt-2 cursor-pointer  hover:text-white ">Login</Link>
                    <span className="mt-2 cursor-pointer  hover:text-white ">SignUp</span>
                </div>
        



            </nav>

        </>
    )
}

export default Header