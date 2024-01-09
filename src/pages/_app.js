import "../styles/style.css";
import { UserProvider } from './context/plantillaContext.js';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
