  // import React from 'react';
  // import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
  // import { AuthProvider } from './context/AuthContext';
  // import ProtectedRoute from './components/ProtectedRoute.jsx';
  // import Login from './components/Login.jsx';
  // import Signup from './components/Signup.jsx';
  // import OtpVerification from './components/OtpVerification.jsx';
  // import NotesList from './components/NotesList.jsx';
  // import CreateNote from './components/CreateNote.jsx';
  // import EditNote from './components/EditNote.jsx';
  // import Navbar from './components/Navbar.jsx';
  // import './App.css';

  // function OtpVerificationWrapper() {
  //   const location = useLocation();
  //   const email = location.state?.email;

  //   if (!email) {
  //     return <Navigate to="/signup" />;
  //   }

  //   return <OtpVerification email={email} />;
  // }

  // function App() {
  //   return (
  //     <AuthProvider>
  //       <div className="App">
  //         <Navbar />
  //         <div className="container">
  //           <Routes>
  //             <Route path="/login" element={<Login />} />
  //             <Route path="/signup" element={<Signup />} />
  //             <Route path="/verify-otp" element={<OtpVerificationWrapper />} />
  //             <Route 
  //               path="/" 
  //               element={
  //                 <ProtectedRoute>
  //                   <NotesList />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route 
  //               path="/create" 
  //               element={
  //                 <ProtectedRoute>
  //                   <CreateNote />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //             <Route 
  //               path="/edit/:id" 
  //               element={
  //                 <ProtectedRoute>
  //                   <EditNote />
  //                 </ProtectedRoute>
  //               } 
  //             />
  //           </Routes>
  //         </div>
  //       </div>
  //     </AuthProvider>
  //   );
  // }

  // export default App;


















  import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import OtpVerification from './components/OtpVerification.jsx';
import NotesList from './components/NotesList.jsx';
import CreateNote from './components/CreateNote.jsx';
import EditNote from './components/EditNote.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';

function OtpVerificationWrapper() {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/signup" />;
  }

  return <OtpVerification email={email} />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerificationWrapper />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <NotesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditNote />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </AuthProvider> 
  );
}

export default App;
