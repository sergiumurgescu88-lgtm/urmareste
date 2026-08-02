import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import CategorySector from './pages/CategorySector.jsx';
import BusinessProfile from './pages/BusinessProfile.jsx';
import ListBusinessForm from './pages/ListBusinessForm.jsx';
import Admin from './pages/Admin.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path=":categorySlug/:sectorSlug" element={<CategorySector />} />
          <Route path="profil/:id" element={<BusinessProfile />} />
          <Route path="listeaza-te" element={<ListBusinessForm />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
