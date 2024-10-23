import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  year: yup
    .number()
    .required('Ano é obrigatório')
    .typeError('Ano deve ser um número')
    .default(0),
  color: yup.string().required('Cor é obrigatória'),
  available: yup.object().nullable().required('Disponibilidade é obrigatória'),
  doc: yup.object().nullable().required('Documentação é obrigatória'),
  return: yup.object().nullable().required('Situação é obrigatória'),
  initial_fipe: yup
    .number()
    .required('Fipe inicial é obrigatória')
    .typeError('Fipe final deve ser um número válido')
    .default(0),
  final_fipe: yup
    .number()
    .required('Fipe final é obrigatória')
    .typeError('Fipe final deve ser um número válido')
    .default(0),
  image: yup.mixed().nullable(),
  plate: yup.string().required('Placa é obrigatória'),
  owner: yup.string().required('Proprietário é obrigatório'),
});
