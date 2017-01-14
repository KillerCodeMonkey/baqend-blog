import { Routes, RouterModule } from '@angular/router';

import { DBReady } from './shared';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, resolve: { db: DBReady } },
    { path: ':slug', component: DetailComponent, resolve: { db: DBReady } }
];

export const AppRouter = RouterModule.forRoot(appRoutes);