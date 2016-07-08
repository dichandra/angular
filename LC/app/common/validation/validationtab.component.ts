import {Component,OnInit,OnDestroy,Input} from '@angular/core';
import {Tab} from './../components/ui/tab/cltab.component'; 
import {DataService} from './../../dataservice/lcdata.service';
import {ValidationManager} from './validationmanager.service';

@Component({
	selector: 'validationtab',
	styles: [`
    .pane{
      padding: 1em;
    }
  `],
	templateUrl: 'app/common/validation/validation.component.html'
})

export class ValidationTab extends Tab implements OnInit, OnDestroy
{
	@Input('tabTitle') title: string;
	@Input() active = false;	
	@Input() loanId: number;
	errors = [];
	constructor(private _dataService: DataService, private _valManager: ValidationManager)
	{
		super();
	}
	ngOnInit() 
	{
		//you dont want to do any initialization here, do initialization in tabActivated method instead
	}
	ngOnDestroy() 
	{
		// do cleanup here
	}
	tabActivated(): void 
	{
		console.debug('Tab validationtab activated with loanId: ' + this.loanId);
        this._dataService.callService('EventAwareDataService', 'validateAllActivities', [this.loanId], data => this.successCallBack(data),
			err => this.errorCallBack(err),'errors');		
	}
	tabDeactivated(): void
	{
		this._valManager.undoValidate();
	}
	successCallBack(data:any):void
	{
		this.errors = data;
		this._valManager.doValidate(this.errors);
	}
	errorCallBack(response: any)
	{
        console.debug('Error success' + JSON.stringify(response));
    }
    getErrors(error:any):any
    {
		return Object.keys(this.errors);
    }
	getCount(error: string): string 
	{
		return this.errors[error].length + ' errors!';
    }
}