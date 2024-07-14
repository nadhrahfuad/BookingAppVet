import { Button } from 'react-bootstrap';

const CustomButton = ({children, type, variant }) => {
  return (
    <Button variant={variant} type={type} >
      {children}
    </Button>
  );
};

export default CustomButton;


