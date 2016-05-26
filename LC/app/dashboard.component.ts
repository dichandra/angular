import { Component, OnInit,OnDestroy,DynamicComponentLoader,ElementRef} from '@angular/core';
import { Router, RouterLink, RouteConfig,RouterOutlet,ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {RepeatedComponent} from './repeated-template.component';
import {NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import getPrototypeOf = Reflect.getPrototypeOf;
import {DataUtil} from "./dataservice/dataserviceutil.component";
import {DataService} from './dataservice/lcdata.service';
import {BorrowerComponent} from './loan/borrower/borrowers.component';
import {BorrowersInfoComponent} from './loan/borrower/borrowersinfo.component';
import {DeleteBorrowerComponent} from './loan/borrower/deleteborrowers.component';
import {AuthUtil} from './common/authutil';
import {Tabs} from './common/ui/tab/cltabs.component';
import {Tab} from './common/ui/tab/cltab.component';
import {ValidationTab} from './common/validation/validationtab.component';


@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css'],
    directives: [RepeatedComponent, RouterLink, RouterOutlet, Tabs, Tab, ValidationTab]
})
@RouteConfig([
    {
        path: '/:id',
        name: 'AddBorrowers',
        component: BorrowerComponent
    },
    {
        path: '/loandata',
        name: 'LoanData',
        component: RepeatedComponent,
        useAsDefault: true
    },
    {
        path: '/borrowerinfo:id',
        name: 'BorrowersInfo',
        component: BorrowersInfoComponent
    },
    {
        path: '/deleteborrowers:id',
        name: 'DeleteBorrowers',
        component: DeleteBorrowerComponent
    }
])
export class DashboardComponent implements OnInit, OnDestroy {
    responsibilities = [];
    searchResponse;
    writeResponse = "";
    dataPulled = {};
    dataToSave = [];
    keys :String[] = [];
    values: Object[] = [];
    loanId:number;
    loanNum;
    className:String = 'com.dorado.generated.persistence.model.loan.LoanApplicationTO';


    constructor(
        private _router: Router,
        private _dataService: DataService,
        private loader: DynamicComponentLoader, private elementRef: ElementRef) {
    }

    ngOnInit() {
        console.debug(' in init method dashboard');
        //As this is entry point of application get Authentication data
       /* if (!AuthUtil.getLoggedInUser())
        {
            this._dataService.callService('Authentication', 'getLoginResult', [], data => this.successLogin(data),
                err => this.errorLogin(err));
        }*/
     }
     public successLogin(response:any)
     {
         console.debug('User successfully logged in '+JSON.stringify(response));
         AuthUtil.setLoggedInUserData(JSON.stringify(response));
     }
     public errorLogin(response: any) 
     {
         console.debug('Error in login: '+ JSON.stringify(response));
     }
    public searchLoan(loanNumber:String):void
    {
        console.debug('searching for loan# '+loanNumber);
        this.loanNum = loanNumber;
        this.resetData();
        var args = [];
        args[0] = JSON.parse(AuthUtil.getCred()).userID;
        args[1] = loanNumber; args[2] = 10; args[3] = 1;
        this._dataService.callService('LoanPipelineService', 'findLoansByPageForUser', args, data => this.successCallBack(data),
        err => this.errorCallBack(err));
    }
    successCallBack(response:any)
    {
        if (response.length > 0 && response[0]['loanApplications'][0]['id']) {
            this.loanId = response[0]['loanApplications'][0]['id'];
            this.searchResponse = "";
            this.extractResponsibilities(response[0]['loanApplications'][0]);
            this._router.navigate(['LoanData', { className: this.className, loanId: this.loanId, title: 'Loan Application' }]);
        }
        else {
            this.searchResponse = 'No Data Found for loan: ' + this.loanNum;
            this.loanId = null;
            this.loanNum = null;
        }
    }
    errorCallBack(response: any) {
        console.debug('Error success' + JSON.stringify(response));
    }
    private resetData():void
    {
        this.loanId = null;
        this.searchResponse = null;
    }
    private extractResponsibilities(searchResultLoanApp):void
    {
        this.responsibilities  = searchResultLoanApp["responsibilities"];
    }
    saveData(loanId:number)
    {
        console.debug('in saveData');
        this._dataService.saveData(loanId,data => this.handleSaveSuccess(data),err => this.errorCallBack(err));
    }
    handleSaveSuccess(response:any)
    {
        console.debug('Save Successfull. Response data is :'+JSON.stringify(response));
    }
   
    onSelect(loanId:number,subActivity:String) 
    {

        this._router.navigate([subActivity, { id: loanId }]);                
    }
    ngOnDestroy() 
    {
        console.debug('calling dispose dashboard component');
    }    
}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */