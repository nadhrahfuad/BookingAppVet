import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from "./pages/SignUpPage"
import Layout from './pages/Layout';
// import ErrorPage from './pages/ErrorPage';
import RequireAuth from './contexts/RequireAuth';
import { AuthProvider } from './contexts/AuthContext'; 
import useAuth from './contexts/useAuth'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/Profile';
import ViewPets from './pages/User/ViewPets';
import ViewVets from './pages/User/ViewVets';
import ManageAppt from './pages/ManageAppt';
import ManageUsers from './pages/Admin/ManageUsers';
// import { app } from "./firebase"




function App() {
  const { auth } = useAuth(); 
  console.log("START authonapp", auth); 

  return (
    <AuthProvider>
    <BrowserRouter>

    {/* <NavBar/> */}
        <Routes>
          <Route path="/profile" element={<Layout />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/vet" element={<SignUpPage />} />
          <Route path="/signup/admin" element={<SignUpPage />} />
          {/* <Route path="/error" element={<ErrorPage />} /> */}
          

          {/* Private routes */}

          <Route element={<RequireAuth allowedAccess={["admin"]} />}>
            <Route path="/" element={<Layout />}>
               <Route path="/:role/:id/manageusers" element={<ManageUsers />} />
            </Route>
          </Route>



          <Route element={<RequireAuth allowedAccess={["petowner"]} />}>
            <Route path="/" element={<Layout />}>
                <Route path="/:role/:id/viewpets" element = {<ViewPets/>}/>
                <Route path="/:role/:id/viewvets" element = {<ViewVets/>}/>
            </Route>           
          </Route>

          <Route element={<RequireAuth allowedAccess={["petowner", "admin", "vet"]} />}>
            <Route path="/" element={<Layout />}>
              <Route path=":role/:id/profile" element={<Profile />} />
              <Route path="/:role/:id/manage/" element = {<ManageAppt/>}/>
              </Route>
            </Route>

        </Routes>
      
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
