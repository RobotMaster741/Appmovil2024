import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerDetallesPage } from './ver-detalles.page';

describe('VerDetallesPage', () => {
  let component: VerDetallesPage;
  let fixture: ComponentFixture<VerDetallesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
