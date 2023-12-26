import { Component, OnInit, TemplateRef, Type } from '@angular/core';
import { ModalOverlayRef } from './modaloverlayref';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less']
})
export class OverlayComponent implements OnInit {
  contentType = 'component';
  content: Type<any> = null!;
  context;

  constructor(private ref: ModalOverlayRef) {
    this.contentType = 'string';
    this.context = {};
  }

  close() {
    this.ref.close(null);
  }

  ngOnInit() {
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref)
      };
    } else {
      this.contentType = 'component';
    }
  }
}
