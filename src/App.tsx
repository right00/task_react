import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Main } from './pages/main';

export const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' Component={Main} />
    </Routes>
    </BrowserRouter>
  );
};