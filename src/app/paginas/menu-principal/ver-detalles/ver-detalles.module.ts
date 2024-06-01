import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerDetallesPageRoutingModule } from './ver-detalles-routing.module';

import { VerDetallesPage } from './ver-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerDetallesPageRoutingModule
  ],
  declarations: [VerDetallesPage]
})
export class VerDetallesPageModule {}
