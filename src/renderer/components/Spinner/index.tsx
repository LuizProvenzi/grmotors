import { Spinner as LoadingSpinner } from 'react-bootstrap';
import './styles.scss';

export const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <LoadingSpinner className="spinnerContainer" />
    </div>
  );
};
