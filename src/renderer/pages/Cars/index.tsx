import { useEffect, useState } from 'react';
import './styles.scss';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Card from './components/Card';
import Button from '../../components/Button';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import { Link, useNavigate } from 'react-router-dom';

interface Car {
  id: string;
  available: boolean;
  doc: boolean;
  name: string;
  year: number;
  color: string;
  initial_fipe: number;
  final_fipe: number;
  return: boolean;
  expenses: any[];
  image: string;
  type: string;
}

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  const navigate = useNavigate();

  const fetchCars = async () => {
    const querySnapshot = await getDocs(collection(db, 'cars'));
    const carList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Car,
    );

    const sortedCarList = carList.sort(
      (a, b) => Number(b.available) - Number(a.available),
    );

    setCars(sortedCarList);
  };

  const goToAddCar = () => {
    navigate('/addCar');
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="d-flex flex-column mt-2 align-items-center mb-3">
      <div className="d-flex flex-column card-container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Text className="f-5 bold white">Lista de Veículos</Text>

          <Link to={`/addCar/false`} className="link-no-underline">
            <Button className="black-button" onClick={goToAddCar}>
              <Icon name="RiAddFill" size={18} />

              <Text className="f-3 bold white">Adicionar veículo</Text>
            </Button>
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-5 mt-3 justify-content-center">
          {cars.map(
            (car) => car.type !== 'garage' && <Card key={car.id} car={car} />,
          )}
        </div>
      </div>
    </div>
  );
}
