import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { Select } from '../../components/Select';
import Input from '../../components/Input';
import Text from '../../components/Text';
import { useEffect, useState } from 'react';
import './styles.scss';
import Button from '../../components/Button';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Icon from '../../components/Icon';
import { useNavigate, useParams } from 'react-router-dom';

interface Option {
  label: string;
  value: string;
}

interface Expense {
  addition: Option;
  date: string;
  name: string;
  value: number;
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
  image: any;
  atpv: any;
  expenses: any[];
  owner: string;
  plate: string;
}

interface FormValues {
  name: string;
  year: number;
  color: string;
  available: Option;
  doc: Option;
  return: Option;
  initial_fipe: number;
  final_fipe: number;
  image?: File | null;
  atpv?: File | null;
  expenses: Expense[];
  owner: string;
  plate: string;
}

export default function AddCar() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchCarDetails = async () => {
    if (id) {
      const docRef = doc(db, 'cars', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const carData = { id: docSnap.id, ...docSnap.data() } as Car;

        setValue('name', carData?.name);
        setValue('year', carData?.year);
        setValue('color', carData?.color);
        setValue('owner', carData?.owner);
        setValue('plate', carData?.plate);
        setValue(
          'available',
          carData?.available
            ? { label: 'Disponível', value: '1' }
            : { label: 'Indisponível', value: '2' },
        );
        setValue(
          'doc',
          carData?.doc
            ? { label: 'Completa', value: '1' }
            : { label: 'Incompleta', value: '2' },
        );
        setValue(
          'return',
          carData?.return
            ? { label: 'Pego em troca', value: '2' }
            : { label: 'Comprado', value: '1' },
        );
        setValue('initial_fipe', carData?.initial_fipe);
        setValue('final_fipe', carData?.final_fipe);
        setValue('image', carData?.image);
        setValue('atpv', carData?.atpv);
        setValue('expenses', carData?.expenses);
      } else {
        console.error('Carro não encontrado!');
      }
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error Select type error
    resolver: yupResolver(schema),
    defaultValues: {
      year: 0,
      initial_fipe: 0,
      final_fipe: 0,
      available: null as unknown as Option,
      doc: null as unknown as Option,
      return: null as unknown as Option,
      expenses: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenses',
  });

  const handleAtpvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue('atpv', file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue('image', file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem');
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      let imageUrl = '';

      if (typeof values.image === 'string') {
        imageUrl = values.image;
      } else {
        if (values.image) {
          imageUrl = await uploadImage(values.image);
        }
      }

      let atpvUrl = '';

      if (typeof values.atpv === 'string') {
        atpvUrl = values.atpv;
      } else {
        if (values.atpv) {
          atpvUrl = await uploadImage(values.atpv);
        }
      }

      const newCar = {
        available: values.available.value === '1',
        doc: values.doc.value === '1',
        name: values.name,
        year: values.year,
        color: values.color,
        initial_fipe: values.initial_fipe,
        final_fipe: values.final_fipe,
        return: values.return.value === '1' ? false : true,
        image: imageUrl,
        atpv: atpvUrl,
        expenses: values.expenses,
        owner: values.owner,
        plate: values.plate,
      };

      if (id && id !== 'false') {
        const carDocRef = doc(db, 'cars', id);
        await updateDoc(carDocRef, newCar);

        navigate('/cars');
        setLoading(false);
      } else {
        const carsCollection = collection(db, 'cars');
        await addDoc(carsCollection, newCar);

        navigate('/cars');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      setLoading(false);
    }
  };

  const types: Option[] = [
    { label: 'Disponível', value: '1' },
    { label: 'Indisponível', value: '2' },
  ];

  const states: Option[] = [
    { label: 'Completa', value: '1' },
    { label: 'Incompleta', value: '2' },
  ];

  const situations: Option[] = [
    { label: 'Comprado', value: '1' },
    { label: 'Pego em troca', value: '2' },
  ];

  const goToCars = () => {
    navigate('/cars');
  };

  useEffect(() => {
    fetchCarDetails();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex mt-3 mb-5 justify-content-start">
        <Text className="white f-5 bold">
          {id !== 'false' ? 'Editar veículo' : 'Criar novo veiculo'}
        </Text>
      </div>

      <form
        className="d-flex form-container flex-column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="d-flex flex-column">
          <div className="d-flex flex-wrap mb-4 gap-4">
            <div className="form-group">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Nome</Text>}
                    placeholder="Digite o nome do veículo"
                    disabled={loading}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-danger">{errors.name.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="plate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Placa</Text>}
                    placeholder="Digite a placa"
                    disabled={loading}
                  />
                )}
              />
              {errors.plate && (
                <Text className="text-danger">{errors.plate.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label={<Text className="white f-2 bold mb-1">Ano</Text>}
                    placeholder="Digite o ano"
                    value={String(field.value)}
                    disabled={loading}
                  />
                )}
              />
              {errors.year && (
                <Text className="text-danger">{errors.year.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={<Text className="white f-2 bold mb-1">Cor</Text>}
                    placeholder="Digite a cor"
                    disabled={loading}
                  />
                )}
              />
              {errors.color && (
                <Text className="text-danger">{errors.color.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="owner"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Proprietário</Text>
                    }
                    placeholder="Digite o proprietário"
                    disabled={loading}
                  />
                )}
              />
              {errors.owner && (
                <Text className="text-danger">{errors.owner.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="available"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">
                        Disponibilidade
                      </Text>
                    }
                    disabled={loading}
                    options={types}
                    placeholder="Selecione a disponibilidade"
                  />
                )}
              />
              {errors.available && (
                <Text className="text-danger">{errors.available.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="doc"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Documentação</Text>
                    }
                    disabled={loading}
                    options={states}
                    placeholder="Selecione o estado"
                  />
                )}
              />
              {errors.doc && (
                <Text className="text-danger">{errors.doc.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="return"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={
                      <Text className="white f-2 bold mb-1">Situação</Text>
                    }
                    disabled={loading}
                    options={situations}
                    placeholder="Selecione a situação"
                  />
                )}
              />
              {errors.return && (
                <Text className="text-danger">{errors.return.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="initial_fipe"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label={
                      <Text className="white f-2 bold mb-1">
                        Fipe inicial R$
                      </Text>
                    }
                    placeholder="Digite a fipe inicial"
                    value={String(field.value)}
                    disabled={loading}
                  />
                )}
              />
              {errors.initial_fipe && (
                <Text className="text-danger">
                  {errors.initial_fipe.message}
                </Text>
              )}
            </div>

            <div className="form-group">
              <Controller
                name="final_fipe"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label={
                      <Text className="white f-2 bold mb-1">Fipe final R$</Text>
                    }
                    placeholder="Digite a fipe final"
                    value={String(field.value)}
                    disabled={loading}
                  />
                )}
              />
              {errors.final_fipe && (
                <Text className="text-danger">{errors.final_fipe.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Input
                type="file"
                className="clickable"
                label={<Text className="white f-2 bold mb-1">Imagem</Text>}
                placeholder="Selecione o arquivo"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {errors.image && (
                <Text className="text-danger">{errors.image.message}</Text>
              )}
            </div>

            <div className="form-group">
              <Input
                type="file"
                className="clickable"
                label={<Text className="white f-2 bold mb-1">ATPV</Text>}
                placeholder="Selecione o arquivo"
                accept="image/*"
                onChange={handleAtpvChange}
                disabled={loading}
              />
              {errors.atpv && (
                <Text className="text-danger">{errors.atpv.message}</Text>
              )}
            </div>
          </div>

          <div className="expenses-section mb-4">
            <Text className="white f-3 bold mb-2">Custos</Text>
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
                      className="small-input"
                      label={<Text className="white f-2 bold mb-1">Nome</Text>}
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
                      className="small-input"
                      label={<Text className="white f-2 bold mb-1">Data</Text>}
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
                      className="small-input"
                      label={
                        <Text className="white f-2 bold mb-1">Valor R$</Text>
                      }
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

              <Text className="f-3 bold white">Adicionar custo</Text>
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-3 mb-5">
          <Button
            className="cancel-button"
            onClick={goToCars}
            loading={loading}
          >
            <Text className="f-3 bold white">Cancelar</Text>
          </Button>

          <Button type="submit" className="green-button" loading={loading}>
            <Text className="f-3 bold white">Salvar</Text>
          </Button>
        </div>
      </form>
    </div>
  );
}
