// import { Routes } from '@angular/router';

// export const routes: Routes = [];


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    loadComponent: () => import('./features/components/user-details/user-details.component').then(m => m.UserDetailsComponent),
    title: 'User Details'
  },
  {
    path: 'users',
    loadComponent: () => import('./features/components/user-table/user-table.component').then(m => m.UserTableComponent),
    title: 'User List'
  },
  {
    path: '',
    loadComponent: () => import('./features/components/user-table/user-table.component').then(m => m.UserTableComponent),
    title: 'User List'
  },
  {
    path: '**',
    loadComponent: () => import('./layout/no-data-found/no-data-found.component').then(m => m.NoDataFoundComponent),
    title: '404 Not Found'
  }
];

