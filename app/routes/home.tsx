import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'On-Chain Wrapped' },
    { name: 'description', content: 'On-Chain Wrapped base and farcaster mini-app' },
  ];
}

export function loader() {
  return {};
}

export default function Home() {
  return <Welcome />;
}
