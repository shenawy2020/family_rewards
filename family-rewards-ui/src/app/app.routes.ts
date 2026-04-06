import { Routes } from '@angular/router';
import { authGuard, adminGuard, childGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'children', loadComponent: () => import('./admin/children/children.component').then(m => m.ChildrenComponent) },
      { path: 'tasks', loadComponent: () => import('./admin/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'stars', loadComponent: () => import('./admin/stars/stars.component').then(m => m.StarsComponent) },
      { path: 'rewards', loadComponent: () => import('./admin/rewards/rewards.component').then(m => m.RewardsComponent) },
      { path: 'penalties', loadComponent: () => import('./admin/penalties/penalties.component').then(m => m.PenaltiesComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  {
    path: 'child',
    canActivate: [authGuard, childGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./child/dashboard/child-dashboard.component').then(m => m.ChildDashboardComponent) },
      { path: 'tasks', loadComponent: () => import('./child/tasks/child-tasks.component').then(m => m.ChildTasksComponent) },
      { path: 'rewards', loadComponent: () => import('./child/rewards/child-rewards.component').then(m => m.ChildRewardsComponent) },
      { path: 'wallet', loadComponent: () => import('./child/wallet/child-wallet.component').then(m => m.ChildWalletComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  {
    path: 'leaderboard',
    canActivate: [authGuard],
    loadComponent: () => import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  { path: '**', redirectTo: 'auth/login' }
];
