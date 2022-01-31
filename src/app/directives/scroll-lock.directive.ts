import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Directive, DoCheck, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, subscribeOn, tap } from 'rxjs/operators';

@Directive({
  selector: '[scrollLock]'
})
export class ScrollLockDirective implements OnInit, AfterViewChecked, OnDestroy {
  @Input('snapEvent') snapSetter: Observable<unknown>;
  @Input('tagName') tagName: string = ''
  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.snapperElement = el.nativeElement;
  }
  ngOnInit(): void {
    this.subs.push(
      fromEvent(this.document, 'resize').subscribe(_ => {
        console.log(true);
        this.snap = true;
      })
    )
    if (this.snapSetter)
      this.subs.push(
        this.snapSetter.pipe(
          map(() => {
            return null;
          })
        ).subscribe(() => {
          this.snap = true;
          if (!this.isAtBottom)
            this.setElementToScrollTo(this.snapperElement.parentElement.getElementsByTagName(this.tagName)[0]);
          else {
            this.setElementToScrollTo(null);
          }
        })
      );
  }
  ngOnDestroy(): void {
    for (let sub of this.subs) {
      sub.unsubscribe();
    }
  }
  ngAfterViewChecked(): void {
    if (this.snap) {
      this.snap = false;
      (this.scrollToElement ?? this.snapperElement).scrollIntoView();
    }
  }
  private snapperElement: HTMLElement;
  private subs: Subscription[] = [];
  private snap: boolean = true;
  private scrollToElement: Element;

  private setElementToScrollTo(element: Element) {
    if (element) {
      this.scrollToElement = element;
    }
    else {
      this.scrollToElement = this.snapperElement;
    }
  }
  private get isAtBottom() {
    const rect = this.snapperElement.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || this.document.documentElement.clientHeight);
  }
}
