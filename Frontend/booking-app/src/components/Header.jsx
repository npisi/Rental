import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/AuthContext.jsx";
import SearchBar from "./SearchBar";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogoClick = () => {
        // Dispatch custom event to clear search bar
        window.dispatchEvent(new CustomEvent('clearSearchBar'));
        navigate("/", { replace: true });
    }

    const handleSearch = (query) => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleSuggestionClick = (suggestion) => {
        let searchParams = new URLSearchParams();
        
        switch (suggestion.type) {
            case 'property':
                searchParams.set('q', suggestion.value);
                break;
            case 'location':
                searchParams.set('location', suggestion.value);
                break;
            case 'amenity':
                searchParams.set('type', suggestion.value);
                break;
        }
        
        navigate(`/search?${searchParams.toString()}`);
    };

    return (
        <>
            {!user ? (
                <nav className="nav bg-gray-500 h-14 flex text-slate-800 p-2 accent-blue-500 justify-between  sticky top-0 z-50 ">
                    <div className="flex flex-1 items-center">
                        <img src={logo} className="w-11 h-11  bg-white rounded-full transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer" onClick={handleLogoClick} />
                        <div className="flex-1 flex justify-center">
                            <SearchBar 
                                onSearch={handleSearch}
                                onSuggestionClick={handleSuggestionClick}
                                placeholder="Search properties"
                            />
                        </div>
                    </div>
                    <div className="flex ml-2 gap-6">
                        <span className="mt-2 cursor-pointer  hover:text-white ">Discover</span>
                        <span className="mt-2 cursor-pointer  hover:text-white ">Help</span>
                        <Link to={"/login"} className="mt-2 cursor-pointer  hover:text-white ">Login</Link>
                        <Link to={"/signup"} className="mt-2 cursor-pointer  hover:text-white ">SignUp</Link>
                    </div>
                </nav>
            ) : (
                <nav className="nav bg-gray-500 h-14 flex text-slate-800 p-2 accent-blue-500 justify-between  sticky top-0 z-50 ">
                    <div className="flex flex-1 items-center">
                        <img src={logo} className="w-11 h-11  bg-white rounded-full transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer" onClick={handleLogoClick} />
                        <div className="flex-1 flex justify-center">
                            <SearchBar 
                                onSearch={handleSearch}
                                onSuggestionClick={handleSuggestionClick}
                                placeholder="Search properties"
                            />
                        </div>
                    </div>
                    <div className="flex ml-2 gap-6">
                        <span className="mt-2 cursor-pointer  hover:text-white ">Discover</span>
                        <span className="mt-2 cursor-pointer  hover:text-white ">Help</span>
                        <Link to={"/profile"} className="mt-2 cursor-pointer  hover:text-white ">Hello, {user.firstName}</Link>
                        <button onClick={logout} className=" cursor-pointer  hover:text-white ">Logout</button>
                    </div>
                </nav>
            )}
        </>
    )
}

export default Header