import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiesgosInfoPage } from './riesgos-info.page';

describe('RiesgosInfoPage', () => {
  let component: RiesgosInfoPage;
  let fixture: ComponentFixture<RiesgosInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgosInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
