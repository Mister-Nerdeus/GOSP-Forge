import { renderApp } from './App';
import './styles.css';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('Missing #root element');
}

renderApp(root);
