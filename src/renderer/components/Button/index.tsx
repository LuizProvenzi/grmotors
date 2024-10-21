import React from 'react';
import {
  Button as ButtonBootstrap,
  ButtonProps as BootstrapButtonProps,
} from 'react-bootstrap';
import './styles.scss';
import { Spinner } from '../Spinner';

interface ButtonProps extends BootstrapButtonProps {
  className?: string | any;
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  loading,
  children,
  disabled,
  ...rest
}) => {
  return (
    <ButtonBootstrap
      {...rest}
      className={`btnContainer ${className}`}
      disabled={disabled || loading}
      style={{
        boxShadow: 'none',
        backgroundColor: 'none',
      }}
    >
      {loading ? (
        <div style={{ padding: '0 9px' }}>
          <Spinner />
        </div>
      ) : (
        children
      )}
    </ButtonBootstrap>
  );
};

export default Button;
