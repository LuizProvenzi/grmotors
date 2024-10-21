import React, { ReactNode } from 'react';
import ReactSelect, { SingleValue } from 'react-select';
import colors from '../../../../assets/colors.module.scss';

interface Option {
  label: string | null;
  value: string | null;
}

interface SelectProps {
  options: Option[];
  label?: ReactNode;
  value: SingleValue<Option> | Option[];
  className?: string | any;
  placeholder?: string;
  disabled?: boolean;
  fluid?: boolean;
  noClear?: boolean;
  small?: boolean;
  onChange: (selectedOption: SingleValue<Option>) => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder,
  label,
  onChange,
  disabled,
  fluid,
  noClear,
  small,
}) => {
  const isClearable = options.length > 1 && !noClear;

  return (
    <div>
      {label && <div>{label}</div>}

      <ReactSelect
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        isClearable={isClearable}
        isDisabled={disabled}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '16px',
            borderColor: state.isFocused ? colors.primary : colors.black,
            boxShadow: 'none',
            width: fluid ? '100%' : small ? '205px' : '290px',
            minWidth: small ? '205px' : '290px',
            borderRadius: '8px',
            padding: '2.5px 4px',
            backgroundColor: state.isDisabled ? colors.hover : colors.black,
            color: state.isDisabled ? colors.gray : 'inherit',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
            '&:hover': {
              borderColor: state.isDisabled ? colors.black : colors.primary,
            },
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            fontSize: '16px',
            color: colors.gray,
            backgroundColor: colors.black,
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '16px',
            backgroundColor: state.isFocused ? colors.black : colors.background,
            color: state.isSelected ? colors.primary : colors.white,
          }),
          singleValue: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '16px',
            color: state.isDisabled ? colors.gray : colors.white,
          }),
          placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isDisabled ? colors.gray : colors.white,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),
          menuPortal: (baseStyles) => ({ ...baseStyles, zIndex: 9999 }),
        }}
      />
    </div>
  );
};
