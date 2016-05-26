import { Component, ViewChild, ComponentRef } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {DataService} from './dataservice/lcdata.service'
import { DashboardComponent } from './dashboard.component';
import { BorrowerComponent } from './loan/borrower/borrowers.component';
import {NonpersistedEntityUtil} from './common/nonpersistedentityutil.service'; 
import {EventService} from './common/commonevent.service'; 
import {AuthUtil} from './common/authutil';
import {ValidationManager} from './common/validation/validationmanager.service';



@Component({
    selector: 'my-app',
  templateUrl:'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES, DashboardComponent],
    providers: [
        ROUTER_PROVIDERS,
        DataService,
        NonpersistedEntityUtil,
        EventService,
        ValidationManager
    ]
})
@RouteConfig([
    {
        path: '/dashboard/...',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    }

])
export class AppComponent {
    title = 'Welcome to LoanCenter';
    j_username = '';
    j_password = '';
    loanNumber = '';
    loginMessage = '';
    
    private _dashboardComponent: DashboardComponent;

    constructor(private _dataService:DataService)
    {}
    public searchLoan():void
    {
        console.debug('Searching loan '+this.loanNumber);        
        this._dashboardComponent.searchLoan(this.loanNumber);
    }
    /*
    *As @ViewChild wont inject dynamically added components by router-outlet
    * I am capturing the child in a different way. We will have to figure out
    * proper way of doing this once router module is released. The current version 
    * of router is deprecated and there is no un-deprecated release version available
    */
    captureChild(compRef:any)
    {
        if (compRef && compRef.constructor.name == 'DashboardComponent')
        {
            this._dashboardComponent = compRef;
        }
    }
    public isAuthenticated():boolean
    {
         if(AuthUtil.getLoggedInUser())
         {
             return true;
         }
         else
         {
             return false;
         }    
     }
     public doLogin()
     {
         //do login here
         console.debug('doing login here ');
         this._dataService.callService('Authentication', 'login', [this.j_username, this.j_password, 'Reference CM 3.0|HTML'], data => this.successLogin(data),
                err => this.errorLogin(err));
     }
     public successLogin(response:any)
     {
         if (response[0].completionCode ==0)
         {
           //  console.debug('User successfully logged in ' + JSON.stringify(response));
             this.loginMessage = '';
             AuthUtil.setLoggedInUserData(response);    
         }
         else
         {
             this.loginMessage = 'You made a mistake, this is your first strike!!!';
         }
         
     }
     public errorLogin(response: any)
     {
         console.debug('Error in login: ' + JSON.stringify(response));
     }

}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */