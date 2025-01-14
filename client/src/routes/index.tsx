import { ActionHistory, Dashboard, DataSensor } from '../pages';

export type RouteConfigItemType = {
  path: string;
  component: React.ReactNode;
};

export const routes: RouteConfigItemType[] = [
  { path: '/', component: <Dashboard /> },
  { path: '/datasensor', component: <DataSensor /> },
  { path: '/action_history', component: <ActionHistory /> },
];
