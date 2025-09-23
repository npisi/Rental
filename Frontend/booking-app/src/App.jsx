import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import PropertyFormContainer from "./pages/PropertyFormContainer"
import Home from "./pages/Home"
import Header from "./components/Header"
import PropertyDetails from "./pages/PropertyDetails"
import Profile from "./pages/Profile"
import SearchResults from "./pages/SearchResults"

// Inline Layout with Header
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages without Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Pages with Header */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/properties/create"
            element={<PropertyFormContainer mode="create" />}
          />
          <Route
            path="/properties/edit/:id"
            element={<PropertyFormContainer mode="edit" />}
          />
           <Route
            path="/property-details/:id"
            element={<PropertyDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
