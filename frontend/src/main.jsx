import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './utils/axiosConfig.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import Layout from './Layout.jsx';
import Dashboard from './pages/dashboard.jsx';
import Stocks from './pages/Stocks.jsx';
import AddMoney from './pages/addMoney.jsx';
import CreateStock from './pages/createStock.jsx';
import SearchStock from './pages/stockUpdate.jsx';

const route = createBrowserRouter([
  { path: '/', element: <Login/> },
  { path: '/signup', element: <SignUp/> },
  {
    path: '/layout',
    element: <Layout/>,
    children: [
      { path: '', element: <Dashboard/> },
      { path: 'stocks', element: <Stocks/> },
      { path: 'add-money', element: <AddMoney/> },
      { path: 'create-stock', element: <CreateStock/> },
      { path: 'search-stock', element: <SearchStock/> }
    ]
  },
])


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>
);
