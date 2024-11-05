import './styles.scss';
import Text from '../../components/Text';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { formatCurrency } from '../../utils/format';
import { calculate, calculateGarage } from '../../utils/calculate';
import DataTable from '../../components/DataTable';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { Select } from '../../components/Select';

interface GarageDetails {
  id: string;
  name: string;
  closed: boolean;
  expenses: any[];
}

interface Expenses {
  name: string;
  value: number;
  date: string;
  addition: { label: string; value: string };
}

export default function Garage() {
  const [garage, setGarage] = useState<GarageDetails | null>(null);
  const [management, setManagement] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGarageDetails = async () => {
    const carsCollection = collection(db, 'cars');
    const q = query(
      carsCollection,
      where('type', '==', 'garage'),
      where('closed', '==', false),
    );
    const querySnapshot = await getDocs(q);

    const garageData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || '',
      closed: doc.data().closed || false,
      expenses: doc.data().expenses || [],
    })) as GarageDetails[];

    if (garageData) {
      setGarage(garageData[0]);
    } else {
      console.error('Dados não encontrados!');
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

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const currentYear = new Date().getFullYear();

  const currentMonthName =
    monthNames[new Date().getMonth()] + '/' + currentYear;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GarageDetails>({
    defaultValues: {
      expenses: [
        {
          name: '',
          date: '',
          value: 0,
          addition: { label: 'Não', value: 'false' },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenses',
  });

  const onSubmit = async (values: GarageDetails) => {
    setLoading(true);

    try {
      const newExpenses = {
        type: 'garage',
        name: garage?.name,
        expenses: values.expenses,
        closed: false,
      };

      if (garage?.id) {
        const carDocRef = doc(db, 'cars', garage.id);
        await updateDoc(carDocRef, newExpenses);
      }

      setManagement(!management);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      setManagement(!management);
      setLoading(false);
    }
  };

  const closeMonth = async () => {
    setLoading(true);

    try {
      const newExpenses = {
        ...garage,
        closed: true,
      };

      if (garage?.id) {
        const carDocRef = doc(db, 'cars', garage.id);
        await updateDoc(carDocRef, newExpenses);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      setLoading(false);
    }
  };

  const nextMonth = async () => {
    setLoading(true);

    try {
      const newMonth = {
        type: 'garage',
        name: currentMonthName,
        expenses: [],
        closed: false,
      };

      const carsCollection = collection(db, 'cars');
      await addDoc(carsCollection, newMonth);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      setLoading(false);
    }
  };

  const newMonth = async () => {
    await closeMonth();
    await nextMonth();

    window.location.reload();
  };

  const sortedData = garage?.expenses
    ? garage?.expenses.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateA.getTime() - dateB.getTime();
      })
    : [];

  useEffect(() => {
    fetchGarageDetails();
  }, []);

  useEffect(() => {
    if (management) {
      setValue('expenses', garage ? garage.expenses : []);
    } else {
      fetchGarageDetails();
    }
  }, [management]);

  const result = garage?.expenses ? calculate(garage?.expenses) : null;

  return (
    <div className="d-flex justify-content-center mb-3">
      {management ? (
        <form
          className="d-flex form-container flex-column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="d-flex flex-column">
            <div className="expenses-section mb-4 justify-content-center">
              <Text className="white f-5 bold mb-4">{`Gastos de ${garage?.name}`}</Text>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="d-flex gap-3 mb-3 align-items-center"
                >
                  <Controller
                    name={`expenses.${index}.name` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label={
                          <Text className="white f-2 bold mb-1">Nome</Text>
                        }
                        className="small-input"
                        placeholder="Nome"
                        disabled={loading}
                      />
                    )}
                  />

                  <Controller
                    name={`expenses.${index}.date` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label={
                          <Text className="white f-2 bold mb-1">Data</Text>
                        }
                        className="small-input"
                        placeholder="Data"
                        mask="00/00/0000"
                        disabled={loading}
                      />
                    )}
                  />

                  <Controller
                    name={`expenses.${index}.value` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={String(field.value)}
                        label={
                          <Text className="white f-2 bold mb-1">Valor R$</Text>
                        }
                        className="small-input"
                        placeholder="Valor"
                        disabled={loading}
                      />
                    )}
                  />

                  <Controller
                    name={`expenses.${index}.addition` as const}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={
                          <Text className="white f-2 bold mb-1">Adição</Text>
                        }
                        small
                        options={[
                          { label: 'Sim', value: 'true' },
                          { label: 'Não', value: 'false' },
                        ]}
                        disabled={loading}
                      />
                    )}
                  />

                  <div className="d-flex mt-4">
                    <Icon
                      name="RiCloseFill"
                      size={25}
                      onClick={() => remove(index)}
                    />
                  </div>
                </div>
              ))}

              <Button
                onClick={() =>
                  append({
                    name: '',
                    date: '',
                    value: 0,
                    addition: { label: 'Não', value: 'false' },
                  })
                }
                className="black-button"
                loading={loading}
              >
                <Icon name="RiAddFill" size={18} />

                <Text className="f-3 bold white">Adicionar gasto</Text>
              </Button>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-3 mb-5">
            <Button
              className="cancel-button"
              onClick={() => setManagement(!management)}
              loading={loading}
            >
              <Text className="f-3 bold white">Cancelar</Text>
            </Button>

            <Button type="submit" className="green-button" loading={loading}>
              <Text className="f-3 bold white">Salvar</Text>
            </Button>
          </div>
        </form>
      ) : (
        <div className="d-flex flex-column details-container">
          <div className="d-flex flex-column mb-3">
            <Text className="f-5 bold white">Garagem</Text>

            <Text className="f-4 bold white">
              Para consultar valores de meses anteriores, acesse a página de
              Relatórios.
            </Text>
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <Text className="f-5 bold">{garage?.name}</Text>

            <div className="d-flex gap-1">
              <Button
                className="black-button d-flex gap-2 align-items-center"
                onClick={() => setManagement(!management)}
              >
                <Icon name="RiPencilLine" size={16} />

                <Text className="f-3 bold white">Editar gastos</Text>
              </Button>

              {garage?.name !== currentMonthName && (
                <Button
                  className="black-button d-flex gap-2 align-items-center"
                  onClick={() => newMonth()}
                  loading={loading}
                >
                  <Icon name="RiCheckFill" size={18} />

                  <Text className="f-3 bold white">Fechar mês</Text>
                </Button>
              )}
            </div>
          </div>

          {garage?.expenses && garage?.expenses.length > 0 ? (
            <div className="d-flex flex-column">
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
          ) : (
            <Text className="f-3 bold white">Sem gastos cadastrados.</Text>
          )}
        </div>
      )}
    </div>
  );
}
