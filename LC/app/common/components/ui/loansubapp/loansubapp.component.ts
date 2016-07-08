import {Component, Input, OnInit, OnDestroy,AfterViewInit,EventEmitter} from '@angular/core';
import {CommonUtils} from './../../../util/commonutils';
import {DataService} from './../../../../dataservice/lcdata.service';
import {PlanRenderer} from './viewrenderer/planrenderer.component';
import {EventService} from './../../../commonevent.service';

@Component({
	selector: 'loansubapp',
	templateUrl: 'app/common/components/ui/loansubapp/loansubapp.component.html',
	directives:[PlanRenderer]
})
/**
* This component is root UI component for rendering everything related to a loan (considering a single loan at this point)
*/
export class LoanSubApp implements OnInit, OnDestroy,AfterViewInit 
{
	planContextStub: any;
	planContextTO: any;
	loanAppProx: any;
	//for first time initialization
	@Input() searchResult: any;
	openLoanEmitter: EventEmitter<any>;
	
	constructor(private _dataService:DataService) 
	{
		//Event wont work for the first time as the component is created/rendered on the event itself for the first time.
		this.openLoanEmitter = EventService.openLoanEmitter.subscribe(data => this.handleOpenLoan(data));
	}
	ngOnInit() 
	{
		this.handleOpenLoan({ context: 'searchResult', data: this.searchResult });
    }

	ngOnDestroy() 
	{
		//not sure if angular will clean this up on destroy, so doing it explicitly. 
		//Should be done higher up in class heirarchy or in utility in generic manner
		this.planContextTO = null;
		this.loanAppProx = null;
		this.openLoanEmitter.unsubscribe();
	}
	ngAfterViewInit()
	{	
	}
	handleOpenLoan(data)
	{
		console.debug('in handleOpenLoan method ');
		if (data && data.context == 'searchResult')
		{
			this.planContextStub = data.data[0]['loanApplications'][0]["planContext"];
			this.loanAppProx = data.data[0]['loanApplications'][0];
			this._dataService.readRoot(CommonUtils.getToClass(this.planContextStub),
				this.planContextStub.id, true,
				data => this.handlePlanContext(data),
				err => this.errorCallBack(err));
		}
		else
		{
			console.error("Data is missing or loan open context is not supported yet.",data);
		}
	}
	handlePlanContext(data)
	{
		this.planContextTO = data;
                this.getActivityContexts(data.activityContexts.rootIds,CommonUtils.getToClass(data.activityContexts));
	}
        getActivityContexts(activityIds:Array<number>,toName:string)
        {
            this._dataService.readRootsArray(toName,
                                activityIds,
				data => this.handleActivityContexts(data),
				err => this.errorCallBack(err));            
        }
        handleActivityContexts(data)
        {
            console.debug(data);
        }
	//no error handling as yet
	errorCallBack(data)
	{
		console.error(data);
	}

}
