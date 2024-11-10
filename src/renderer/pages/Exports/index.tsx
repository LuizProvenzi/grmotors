import Icon from '../../components/Icon';
import Text from '../../components/Text';
import { Select } from '../../components/Select';
import { useEffect, useState } from 'react';
import './styles.scss';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import moment from 'moment';
import DataTable from '../../components/DataTable';
import { formatCurrency } from '../../utils/format';
import PaginatedTable from './components/PaginatedTable';

interface Option {
  label: string;
  value: string;
}

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
  expenses: Expense[];
  image: string;
  type: string;
}

interface Expense {
  addition: {
    label: string;
    value: string;
  };
  date: string;
  name: string;
  value: any;
}

export default function Exports() {
  const [type, setType] = useState<Option>({ label: 'Geral', value: '1' });
  const [date, setDate] = useState<string>();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  const states: Option[] = [
    { label: 'Geral', value: '1' },
    { label: 'Veículos', value: '2' },
    { label: 'Garagem', value: '3' },
  ];

  const columns = [
    {
      key: 'name',
      name: <Text className="gray-2 f-2 bold">Nome</Text>,
      render: (entity: Expense) => (
        <Text className="gray-2 f-2">{entity.name ? entity.name : '-'}</Text>
      ),
    },
    {
      key: 'date',
      name: <Text className="gray-2 f-2 bold">Data</Text>,
      render: (entity: Expense) => (
        <Text className="gray-2 f-2">{entity.date ? entity.date : '-'}</Text>
      ),
    },
    {
      key: 'value',
      name: <Text className="gray-2 f-2 bold">Valor</Text>,
      render: (entity: Expense) => (
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

  const handleChangeType = (value: any) => {
    setType(value);
  };

  const handleChangeDate = (value: any) => {
    setDate(value);
  };

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

  const filterCarsByExpenseDateRange = (
    cars: Car[],
    startDateStr: string,
    endDateStr: string,
  ) => {
    const startDate = new Date(startDateStr.split('/').reverse().join('-'));
    const endDate = new Date(endDateStr.split('/').reverse().join('-'));

    return cars
      .map((car) => {
        const filteredExpenses = car.expenses.filter((expense) => {
          const expenseDate = new Date(
            expense.date.split('/').reverse().join('-'),
          );
          return expenseDate >= startDate && expenseDate <= endDate;
        });

        return {
          ...car,
          expenses: filteredExpenses,
        };
      })
      .filter((car) => car.expenses.length > 0);
  };

  const combineAllExpenses = (cars: Array<any>) => {
    if (type.value === '1') {
      return cars.reduce((allExpenses: Array<any>, car: any) => {
        return [...allExpenses, ...car.expenses];
      }, []);
    }

    if (type.value === '2') {
      return cars.reduce((allExpenses: Array<any>, car: any) => {
        if (car.type !== 'garage') {
          return [...allExpenses, ...car.expenses];
        }
        return allExpenses;
      }, []);
    }

    if (type.value === '3') {
      return cars.reduce((allExpenses: Array<any>, car: any) => {
        if (car.type === 'garage') {
          return [...allExpenses, ...car.expenses];
        }
        return allExpenses;
      }, []);
    }

    return [];
  };

  useEffect(() => {
    const carsWithinDateRange = filterCarsByExpenseDateRange(
      cars,
      date && date[0] ? moment(date[0]).format('DD/MM/YYYY') : '',
      date && date[1] ? moment(date[1]).format('DD/MM/YYYY') : '',
    );

    const allExpenses = combineAllExpenses(carsWithinDateRange);

    const sortedData = allExpenses
      ? allExpenses.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/').map(Number);
          const [dayB, monthB, yearB] = b.date.split('/').map(Number);

          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          return dateA.getTime() - dateB.getTime();
        })
      : [];

    setFilteredExpenses(sortedData);
  }, [cars]);

  return (
    <div className="d-flex flex-column mt-2 align-items-center mb-3">
      <div className="d-flex flex-column card-container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex gap-3">
            <Select
              options={states}
              label={<Text className="white f-2 bold mb-1">Relatório</Text>}
              onChange={handleChangeType}
              value={type}
              placeholder="Selecione o relatório"
            />

            <DatePicker
              placeholder="Selecione a data"
              value={date}
              onChange={(value) => handleChangeDate(value)}
              disableFutureDates
              label={<Text className="secondary f-2 bold mb-1">Datas</Text>}
            />
          </div>

          <Button
            className="black-button search-button"
            onClick={() => fetchCars()}
            disabled={!date}
          >
            <Icon name="RiSearchLine" size={18} />

            <Text className="f-3 bold white">Pesquisar</Text>
          </Button>
        </div>

        {filteredExpenses && filteredExpenses.length > 1 && (
          <div className="d-flex table-container-background mt-2">
            <PaginatedTable data={filteredExpenses} columns={columns} />
          </div>
        )}
      </div>
    </div>
  );
}
