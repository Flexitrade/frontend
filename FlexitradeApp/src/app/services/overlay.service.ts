import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { ModalOverlayRef } from '../overlay/modaloverlayref';
import { OverlayComponent } from '../overlay/overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) { }

  open<R = any, T = any>(
    content: Type<any>,
    data: T
  ): ModalOverlayRef<R> {
    const configs = new OverlayConfig({
      hasBackdrop: true,
      panelClass: ['modal', 'is-active'],
      backdropClass: 'modal-background'
    });

    const overlayRef = this.overlay.create(configs);

    const myOverlayRef = new ModalOverlayRef<R, T>(overlayRef, content, data);

    const injector = this.createInjector(myOverlayRef, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));

    return myOverlayRef;
  }

  createInjector(ref: ModalOverlayRef, inj: Injector) {
    const injectorTokens = new WeakMap([[ModalOverlayRef, ref]]);
    return new PortalInjector(inj, injectorTokens);
  }
}
