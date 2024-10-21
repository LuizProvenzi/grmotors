import { PiCarProfile, PiGarage, PiListMagnifyingGlass } from 'react-icons/pi';
import {
  RiAddFill,
  RiCloseFill,
  RiDeleteBin7Line,
  RiPencilLine,
} from 'react-icons/ri';
import './styles.scss';

interface IconProps {
  name: keyof typeof iconComponents;
  size?: number;
  onClick?: () => void;
}

const iconComponents: Record<string, React.ElementType> = {
  PiCarProfile,
  PiGarage,
  PiListMagnifyingGlass,
  RiAddFill,
  RiCloseFill,
  RiDeleteBin7Line,
  RiPencilLine,
};

const Icon: React.FC<IconProps> = ({ name, size, onClick }: IconProps) => {
  const SelectedIcon = iconComponents[name];

  if (!SelectedIcon) {
    return null;
  }

  return (
    <SelectedIcon
      size={size || '24px'}
      onClick={onClick}
      className={`custom-icon ${onClick ? 'clickable' : ''}`}
    />
  );
};

export default Icon;
