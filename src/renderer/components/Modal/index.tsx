import { Modal as ContentModal } from 'react-bootstrap';
import './styles.scss';

interface IndexProps {
  show: boolean;
  children?: any;
}

export default function Modal(props: IndexProps): JSX.Element {
  const { children, show } = props;

  return (
    <ContentModal show={show} centered className="auto-width-modal">
      <div className="p-4 modal-content modal-background">{children}</div>
    </ContentModal>
  );
}
