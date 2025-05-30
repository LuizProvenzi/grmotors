import React, { ReactNode, useState, useRef } from 'react';
import './styles.scss';
import { IMaskInput } from 'react-imask';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label?: ReactNode;
  className?: string | any;
  fluid?: boolean;
  placeholder?: string;
  value?: string;
  mask?: string;
  disabled?: boolean;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      placeholder,
      fluid,
      onChange,
      value,
      disabled,
      type,
      mask,
    },
    ref,
  ) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (e.target.files && e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName(null);
      }
    };

    const handleFileButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="position-relative">
        {label && <div>{label}</div>}

        <div className="custom-file-input-wrapper">
          <IMaskInput
            type={type !== 'file' ? type : 'text'}
            placeholder={placeholder}
            className={`${className} custom-input`}
            style={{ width: fluid ? '100%' : '290px' }}
            onChange={handleInputChange}
            value={value}
            mask={mask || ''}
            disabled={disabled}
            hidden={type === 'file'}
          />

          {type === 'file' && (
            <>
              <button
                type="button"
                className="custom-file-button"
                onClick={handleFileButtonClick}
                disabled={disabled}
              >
                {fileName ? fileName : 'Escolher arquivo'}
              </button>
              <input
                type="file"
                className="file-input-hidden"
                ref={fileInputRef}
                onChange={handleInputChange}
                disabled={disabled}
              />
            </>
          )}
        </div>
      </div>
    );
  },
);

export default Input;
