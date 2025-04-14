// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import CreateNote from './pages/CreateNote';
// import EditNote from './pages/EditNote';
// import './styles.css';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/create" element={<CreateNote />} />
//           <Route path="/edit/:id" element={<EditNote />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;













import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotePage from './pages/NotePage';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import './index.css';

function App() {
  return (
    <div>
      <header>
        <div className="container">
          <h1>Notes App</h1>
        </div>
      </header>
      <main className="container p-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<NotePage />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;