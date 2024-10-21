import { useNavigate } from 'react-router-dom';
import './styles.scss';
import Icon from '../Icon';
import Text from '../Text';
import title from '../../../../assets/title.png';

export default function Header() {
  const navigate = useNavigate();

  const goToCars = () => {
    navigate('/cars');
  };

  const goToGarage = () => {
    navigate('/garage');
  };

  const goToExports = () => {
    navigate('/exports');
  };

  return (
    <div className="d-flex justify-content-between bar">
      <div className="d-flex title">
        <img src={title} alt="Description" />
      </div>

      <div className="d-flex">
        <div
          className="item d-flex flex-column gap-1 align-items-center justify-content-center"
          onClick={goToCars}
        >
          <Icon name="PiCarProfile" size={50} />

          <Text className="f-4 bold">Veículos</Text>
        </div>

        <div
          className="item d-flex flex-column gap-1 align-items-center justify-content-center"
          onClick={goToGarage}
        >
          <Icon name="PiGarage" size={50} />

          <Text className="f-4 bold">Garagem</Text>
        </div>

        <div
          className="item d-flex flex-column gap-1 align-items-center justify-content-center"
          onClick={goToExports}
        >
          <Icon name="PiListMagnifyingGlass" size={50} />

          <Text className="f-4 bold">Relatórios</Text>
        </div>
      </div>
    </div>
  );
}
