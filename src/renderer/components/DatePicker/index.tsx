/* eslint-disable no-unused-vars */
import React, { ReactNode, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './styles.scss';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import Icon from '../Icon';

export interface Props {
  options?: any;
  label?: ReactNode;
  fluid?: boolean;
  placeholder?: string;
  disabled?: boolean;
  disableFutureDates?: boolean;
  value?: string | Date | null;
  onChange?: (
    selectedDates: Date[],
    dateStr: string,
    instance: flatpickr.Instance,
  ) => void;
}

export const DatePicker: React.FC<Props> = ({
  options,
  onChange,
  label,
  fluid,
  placeholder,
  disabled,
  value,
  disableFutureDates,
}) => {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();

    const instance = flatpickr(datePickerRef.current, {
      mode: 'range',
      dateFormat: 'd/m/Y',
      locale: Portuguese,
      maxDate: disableFutureDates ? today : undefined,
      defaultDate: value || undefined,
      ...options,
      onChange: onChange || undefined,
    });

    instance.calendarContainer.classList.add('flatpickr-light');

    return () => {
      instance.destroy();
    };
  }, [options, disableFutureDates]);

  return (
    <div>
      {label && <div>{label}</div>}

      <div className="datePickerContainer">
        <input
          ref={datePickerRef}
          type="text"
          style={{ width: fluid ? '100%' : '290px' }}
          placeholder={placeholder}
          disabled={disabled}
          className="input-picker"
        />

        <div className="placeholder-icon">
          <Icon name="LuCalendar" size={18} />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
