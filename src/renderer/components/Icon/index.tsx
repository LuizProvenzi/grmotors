import { PiCarProfile, PiGarage, PiListMagnifyingGlass } from 'react-icons/pi';
import { LuCalendar } from 'react-icons/lu';
import {
  RiAddFill,
  RiCloseFill,
  RiDeleteBin7Line,
  RiPencilLine,
  RiCheckFill,
  RiFileList2Line,
  RiSearchLine,
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
} from 'react-icons/ri';
import './styles.scss';

interface IconProps {
  name: keyof typeof iconComponents;
  size?: number;
  disabled?: boolean;
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
  RiCheckFill,
  RiFileList2Line,
  RiSearchLine,
  LuCalendar,
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
};

const Icon: React.FC<IconProps> = ({
  name,
  size,
  onClick,
  disabled,
}: IconProps) => {
  const SelectedIcon = iconComponents[name];

  if (!SelectedIcon) {
    return null;
  }

  return (
    <SelectedIcon
      size={size || '24px'}
      onClick={!disabled && onClick}
      className={`custom-icon ${onClick && !disabled ? 'clickable' : ''} ${disabled ? 'disable-icon' : ''}`}
    />
  );
};

export default Icon;
