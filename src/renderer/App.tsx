import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './App.scss';
import Cars from './pages/Cars';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddCar from './pages/AddCar';
import CarDetails from './pages/CarDetails';
import Garage from './pages/Garage';
import Exports from './pages/Exports';

export default function App() {
  return (
    <div className="layout">
      <Router>
        <Header />

        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/cars" />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/addCar/:id" element={<AddCar />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/exports" element={<Exports />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
