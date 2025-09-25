import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Footer from "./components/Footer/footer";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
