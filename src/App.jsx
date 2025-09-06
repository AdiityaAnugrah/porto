import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
// import NavbarMobile from "./components/NavbarMobile";
import Footer from "./components/Footer";

function App() {
    return (
        <div style={{ minHeight: "100svh" }} className="flex flex-col">
            <Navbar />
            <div
                className="main-content"
                style={{
                    flex: 1,
                    backgroundColor: "#f8f9fa",
                }}
            >
                <Outlet />
            </div>
            {/* <NavbarMobile /> */}
            <div className="footer-desktop">
                <Footer />
            </div>
        </div>
    );
}

export default App;
