import { Button, Container } from 'react-bootstrap';
import NavBarGuest from '../components/NavBarGuest';
import Footer from '../components/Footer';
import DigGIF from '../assets/dogdig.gif';
import "../css/custom.css"
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import useAuth from '../contexts/useAuth';

function Error() {
  const navigate = useNavigate()
  const { auth } = useAuth();

  const backAPage = () =>{
    navigate(-1)
  }


  

  return (
    <>
      {auth.role === 'petowner' || auth.role=== 'admin' || auth.role === 'vet' ? (
        <Layout />
      ) : (
        <NavBarGuest />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '20px' }}>

        <h2 className="mt-5 mb-4"style={{ textAlign: 'center', marginBottom: '20px'}}>We&apos;re also trying to find that page!</h2>

        <Container style={{ backgroundColor: "rgba(211, 211, 211, 0.8)", borderRadius: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '600px' }}>

          <img src={DigGIF} style={{ borderRadius: '20px'}} />

          <Button className='mb-5' onClick={backAPage}>
            Go Back
          </Button>
          
        </Container>
       
      </div>
      <Footer style={{ marginTop: 'auto' }} />
    </>
  );
}

export default Error;
