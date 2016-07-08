import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import {LoanCenterApp} from './loancenter.component';
import {HTTP_PROVIDERS} from "@angular/http";
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'
import 'rxjs/add/operator/map';
bootstrap(AppComponent,[HTTP_PROVIDERS]);

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
