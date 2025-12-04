import type { Route } from './+types/home';
import { sdk } from '@farcaster/miniapp-sdk';
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
  sdk.actions.ready();
  return <Welcome />;
}
