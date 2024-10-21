import './styles.scss';

interface TextProps {
  children?: any;
  onClick?: () => void;
  className?: string;
  truncate?: boolean;
}

export default function Text(props: TextProps): JSX.Element {
  const { children, onClick, className, truncate } = props;

  const combinedClassName =
    `${className || ''} ${onClick ? 'clickable' : ''} ${truncate ? 'truncate' : ''}`.trim();

  return (
    <p id="custom-p" className={combinedClassName} onClick={onClick}>
      {children}
    </p>
  );
}
