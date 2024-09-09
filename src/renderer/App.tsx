import { useEffect, useState } from 'react';
import './App.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Car {
  brand: string;
  model: string;
  year: number;
}

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollection = collection(db, 'cars');
        const carSnapshot = await getDocs(carsCollection);
        const carList = carSnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Car[];
        setCars(carList);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div>
      <div>oi</div>

      <div>
        <h1>Cars List teste</h1>
        <ul>
          {cars.map((car) => (
            <li key={car.year}>
              {car.model} ({car.year})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
