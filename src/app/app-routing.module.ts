import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'example-vis', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'example-vis',
    loadChildren: () => import('./example-vis/example-vis.module').then( m => m.ExampleVisPageModule)
  },
  {
    path: 'metro-vis',
    loadChildren: () => import('./metro-vis/metro-vis.module').then( m => m.MetroVisPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
