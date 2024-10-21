import './Card.scss';
import Text from '../../../components/Text';
import carProfile from '../../../../../assets/carProfile.png';
import { Link } from 'react-router-dom';

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
}

interface CardProps {
  car: Car;
}

export default function Card({ car }: CardProps) {
  return (
    <Link to={`/car/${car.id}`} className="link-no-underline">
      <div className="d-flex flex-column car-card position-relative">
        <div className="d-flex">
          <img src={car.image ? car.image : carProfile} alt="Carro" />
        </div>

        <div className="d-flex position-absolute car-description">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex car-title flex-column">
              <Text className="f-5 bold" truncate>
                {car.name}
              </Text>

              <Text
                className={`f-3 bold ${car.available ? 'gray' : 'primary'}`}
                truncate
              >
                {car.available ? 'Disponivel' : 'Indisponível'}
              </Text>
            </div>

            <div className="d-flex flex-column align-items-end car-doc">
              <Text className="f-5 bold"> {car.year}</Text>

              <Text className={`f-3 bold ${car.doc ? 'gray' : 'primary'}`}>
                {car.doc ? 'Documentação completa' : 'Documentação incompleta'}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
