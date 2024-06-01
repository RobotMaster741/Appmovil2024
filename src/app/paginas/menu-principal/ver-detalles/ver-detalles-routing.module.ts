import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerDetallesPage } from './ver-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: VerDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerDetallesPageRoutingModule {}
