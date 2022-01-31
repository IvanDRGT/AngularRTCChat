import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatImagePreviewComponent } from './chat-image-preview.component';

describe('ChatImagePreviewComponent', () => {
  let component: ChatImagePreviewComponent;
  let fixture: ComponentFixture<ChatImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
