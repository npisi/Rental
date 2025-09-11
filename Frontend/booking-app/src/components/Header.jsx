import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <>
            {!user ? (
                <nav className="nav bg-gray-500 h-14 flex text-slate-800 p-2 accent-blue-500 justify-between  sticky top-0 z-50 ">
                    <div className="flex  flex-1">
                        <Link to={"/"}><img src={logo} className="w-11 h-11  bg-white rounded-full" /></Link>
                        <input type="text" placeholder="Browse Properties" className="bg-white rounded-2xl flex-1 ml-2 px-2 " />
                    </div>
                    <div className="flex ml-2 gap-6">
                        <span className="mt-2 cursor-pointer  hover:text-white ">Discover.Book.Belong</span>
                        <span className="mt-2 cursor-pointer  hover:text-white ">Help</span>
                        <Link to={"/login"} className="mt-2 cursor-pointer  hover:text-white ">Login</Link>
                        <Link to={"/signup"} className="mt-2 cursor-pointer  hover:text-white ">SignUp</Link>
                    </div>
                </nav>
            ) : (
                <nav className="nav bg-gray-500 h-14 flex text-slate-800 p-2 accent-blue-500 justify-between  sticky top-0 z-50 ">
                    <div className="flex  flex-1">
                        <Link to={"/"}><img src={logo} className="w-11 h-11  bg-white rounded-full" /></Link>
                        <input type="text" placeholder="Browse Properties" className="bg-white rounded-2xl flex-1 ml-2 px-2 " />
                    </div>
                    <div className="flex ml-2 gap-6">
                        <span className="mt-2 cursor-pointer  hover:text-white ">Discover.Book.Belong</span>
                        <span className="mt-2 cursor-pointer  hover:text-white ">Help</span>
                        <Link to={"/profile"} className="mt-2 cursor-pointer  hover:text-white ">Hello, {user.firstName}</Link>
                        <button onClick={logout} className="mt-2 cursor-pointer  hover:text-white ">Logout</button>
                    </div>
                </nav>
            )}
        </>
    )
}

export default Header