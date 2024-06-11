import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import SuperTokens from 'supertokens-web-js';
import App from './App';
import './index.css';
import { RouterProvider } from '@tanstack/react-router';
import router from './providers/router-provider';


const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      {/* <App /> */ }
      <RouterProvider router={ router } />
    </StrictMode>
  );
}
