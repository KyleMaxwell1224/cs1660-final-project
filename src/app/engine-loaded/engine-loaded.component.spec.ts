import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineLoadedComponent } from './engine-loaded.component';

describe('EngineLoadedComponent', () => {
  let component: EngineLoadedComponent;
  let fixture: ComponentFixture<EngineLoadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineLoadedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineLoadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
