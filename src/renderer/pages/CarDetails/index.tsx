import './styles.scss';
import { Button } from 'react-bootstrap';
import carProfile from '../../../../assets/carProfile.png';
import Text from '../../components/Text';
import { formatCurrency } from '../../utils/format';
import { calculate } from '../../utils/calculate';
import Icon from '../../components/Icon';
import DataTable from '../../components/DataTable';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useEffect, useState } from 'react';

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
  image: string;
  expenses: any[];
  owner: string;
  plate: string;
}

interface Expenses {
  addition: { label: string; value: string };
  name: string;
  value: number;
  date: string;
}

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);

  const navigate = useNavigate();

  const fetchCarDetails = async () => {
    if (id) {
      const docRef = doc(db, 'cars', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const carData = { id: docSnap.id, ...docSnap.data() } as Car;
        setCar(carData);
      } else {
        console.error('Carro não encontrado!');
      }
    }
  };

  const deleteCar = async (carId: any) => {
    try {
      const carDoc = doc(db, 'cars', carId);

      await deleteDoc(carDoc);
      navigate('/cars');
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      name: <Text className="gray-2 f-2 bold">Nome</Text>,
      render: (entity: Expenses) => (
        <Text className="gray-2 f-2">{entity.name ? entity.name : '-'}</Text>
      ),
    },
    {
      key: 'date',
      name: <Text className="gray-2 f-2 bold">Data</Text>,
      render: (entity: Expenses) => (
        <Text className="gray-2 f-2">{entity.date ? entity.date : '-'}</Text>
      ),
    },
    {
      key: 'value',
      name: <Text className="gray-2 f-2 bold">Valor</Text>,
      render: (entity: Expenses) => (
        <Text className="gray-2 f-2">
          {entity.value
            ? entity.addition.value === 'true'
              ? '+ ' + formatCurrency(entity.value)
              : '- ' + formatCurrency(entity.value)
            : '-'}
        </Text>
      ),
    },
  ];

  const goToCars = () => {
    navigate('/cars');
  };

  useEffect(() => {
    fetchCarDetails();
  }, []);

  const result = car?.expenses ? calculate(car?.expenses) : null;

  const sortedData = car?.expenses
    ? car?.expenses.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateA.getTime() - dateB.getTime();
      })
    : [];

  return (
    <div className="d-flex justify-content-center mb-3">
      <div className="d-flex flex-column details-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Text className="f-5 bold white">Detalhes do veículo</Text>

          <div className="d-flex gap-2">
            <Link to={`/addCar/${id}`} className="link-no-underline">
              <Button className="black-button">
                <Icon name="RiPencilLine" size={25} />
              </Button>
            </Link>

            <Button className="black-button" onClick={() => deleteCar(id)}>
              <Icon name="RiDeleteBin7Line" size={25} />
            </Button>

            <Button className="black-button" onClick={goToCars}>
              <Icon name="RiCloseFill" size={25} />
            </Button>
          </div>
        </div>

        <div className="d-flex">
          <div className="d-flex flex-column car-img position-relativcar-img">
            <img src={car?.image ? car.image : carProfile} alt="Carro" />
          </div>

          <div className="d-flex flex-column ms-4">
            <Text className="f-5 bold">{car?.name}</Text>

            <Text className="f-4 bold">{car?.plate}</Text>

            <Text className="f-4 bold">{car?.year}</Text>

            <Text className="f-4 bold">{car?.color}</Text>

            <Text className="f-4 bold">{car?.owner}</Text>

            {car?.available ? (
              <Text className="f-4 bold">Disponível</Text>
            ) : (
              <Text className="f-4 bold primary">Indisponível</Text>
            )}

            {car?.doc ? (
              <Text className="f-4 bold">Documentação completa</Text>
            ) : (
              <Text className="f-4 bold primary">Documentação incompleta</Text>
            )}

            <Text className="f-4 bold">
              {car?.return ? 'Pego em troca' : 'Comprado'}
            </Text>

            {car?.initial_fipe !== 0 && (
              <Text className="f-4 bold">{`Fipe inicial: ${car?.initial_fipe && formatCurrency(car.initial_fipe)}`}</Text>
            )}

            {car?.final_fipe !== 0 && (
              <Text className="f-4 bold">{`Fipe final: ${car?.final_fipe && formatCurrency(car.final_fipe)}`}</Text>
            )}
          </div>
        </div>

        {car?.expenses && car?.expenses.length > 0 && (
          <div className="d-flex flex-column mt-4">
            <div className="d-flex align-items-center">
              <Text className="f-5 bold">Tabela de custos</Text>
            </div>

            <div className="d-flex">
              <DataTable data={sortedData} columns={columns} />
            </div>

            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <Text className="f-5 bold">Total</Text>
              </div>

              {result && (
                <div className="d-flex">
                  {result.message === 'positive' ? (
                    <Text className="f-5 bold green">
                      + {formatCurrency(result.total)}
                    </Text>
                  ) : (
                    <Text className="f-5 bold primary">
                      {formatCurrency(result.total)}
                    </Text>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
