import {BrowserRouter , Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup";
import PropertyFormContainer from "./pages/PropertyFormContainer";
import Home from "./pages/Home";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
                 
                 {/* Properties */}
        <Route
          path="/properties/create"
          element={<PropertyFormContainer mode="create" />}
        />
        <Route
          path="/properties/edit/:id"
          element={<PropertyFormContainer mode="edit" />}
        />

      </Routes>
    </BrowserRouter>
  );
}