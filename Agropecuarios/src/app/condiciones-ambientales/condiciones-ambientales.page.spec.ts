import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CondicionesAmbientalesPage } from './condiciones-ambientales.page';

describe('CondicionesAmbientalesPage', () => {
  let component: CondicionesAmbientalesPage;
  let fixture: ComponentFixture<CondicionesAmbientalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionesAmbientalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
