import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {DataService} from './../../dataservice/lcdata.service';
import {RepeatedComponent} from './../../repeated-template.component';
import {EventService} from './../../common/events/commonevent.service';
import {DataUtil} from './../../dataservice/dataserviceutil.component';
@Component({
    selector: 'borrowersinfo',
    templateUrl: 'app/loan/borrower/borrowersinfo.component.html',
    directives: [RepeatedComponent]
})
export class BorrowersInfoComponent implements OnInit, OnDestroy {
	private _loanId: number;
	borrIds = [];
	borrClassName: String = 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO';
	saveSubscription: any;

	constructor(private _routerParams: RouteParams,
		private _dataService: DataService,
		private _evtMgr: EventService) 
	{
	}
	ngOnInit() {
		console.debug('initialize BorrowersInfoComponent');
		this._loanId = this._routerParams.get('id');
		/*
		*/
		//create transient tos for borrower pair
		this._dataService.readRoot('com.dorado.generated.persistence.model.loan.LoanApplicationTO', 
			this._loanId,true,data => this.handleGetLoan(data),err => this.hanelError(err));
	}
	private handleGetLoan(response: any)
	{
		this.borrIds = response.borrowers.rootIds;
		console.debug('in borrowersinfo component information is loanId' + this._loanId + ' borrower ids: ' + this.borrIds);
	}
	private hanelError(result: any) {

	}
	ngOnDestroy()
	{
		console.debug('in OnDestroy method of BorrowersInfoComponent');
	}


}