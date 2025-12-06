import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiesgosPage } from './riesgos.page';

describe('RiesgosPage', () => {
  let component: RiesgosPage;
  let fixture: ComponentFixture<RiesgosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
