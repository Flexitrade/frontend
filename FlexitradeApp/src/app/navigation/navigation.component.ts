import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OverlayService } from '../services/overlay.service';
import { LoginComponent } from '../login/login.component';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.less'],
})
export class NavigationComponent implements OnInit {
    loginComponent = LoginComponent;
    loginComponentResponse = null;

    constructor(public authService: AuthService, private overlayService: OverlayService) { }

    ngOnInit(): void { }

    open(content: ComponentType<any>) {
        const ref = this.overlayService.open(content, null);

        ref.afterClosed$.subscribe(res => {
            if (typeof content === 'string') {
            } else if (content === this.loginComponent) {
                this.loginComponentResponse = res.data;
            } else {
                this.loginComponentResponse = res.data;
            }
        });
    }
}