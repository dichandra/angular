import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {DataService} from './../../dataservice/lcdata.service';
import {DataUtil} from './../../dataservice/dataserviceutil.component';
@Component({
    selector: 'deleteborrowers',
    templateUrl: 'app/loan/borrower/deleteborrowers.component.html'
})
export class DeleteBorrowerComponent implements OnInit, OnDestroy {
	private _loanId: number;
	borrData = [];
	borrIds = [];
	deletedBorrowers = [];
	borrClassName: string = 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO';

	constructor(private _routerParams: RouteParams,
		private _dataService: DataService){}
	ngOnInit() {
		console.debug('initialize DeleteBorrowerComponent');
		this.borrData = [];
		this._loanId = this._routerParams.get('id');

		this._dataService.readRoot('com.dorado.generated.persistence.model.loan.LoanApplicationTO', this._loanId,true
			,data=> this.handleGetLoan(data),err=> handleError(err));
		
	}
	handleGetLoan(response: any)
	{
		this.borrIds = response.borrowers.rootIds;
		for (var j = 0; j < this.borrIds.length; j++) 
		{
			this.getBorrowerDetails(j, this.borrIds[j]);
		}		
	}
	handleError(error:any)
	{
		console.debug('Error: ',any);
	}
	/*
	getBorrowerDetails(index: number, borrowerId: number) {
        this._dataService.getEditableData(this.borrClassName, borrowerId)
            .subscribe(response => {
				this.borrData[index] = response.result;
            }, err => { console.debug('Error occurred: ', err); }
            , () => {//code if you want to have something done when call is complete
            });
	}*/
	getBorrowerDetails(index: number, borrowerId: number) {
        this._dataService.readRoot(this.borrClassName, borrowerId,true, 
        	data => { this.borrData[index] = data }, err => this.handleError(err));
	}	
	ngOnDestroy() {
		console.debug('calling dispose deleteborrower component');
	}
	deleteBorrower(borrowerId:number)
	{
		var borrIndex = this.borrIds.indexOf(borrowerId);
		this.updateBorrower(this.borrData[borrIndex]);
		this.updateLoan(borrowerId);		
		this.deletedBorrowers.push(this.borrData[borrIndex]);
		this.borrData.splice(borrIndex,1);

	}
	updateLoan(borrowerId:number)
	{
		var loanRR = DataUtil.getEditableEntity(DataUtil.getKey
			('com.dorado.generated.persistence.model.loan.LoanApplicationTO', this._loanId));
		console.debug('Borrowers before delete: ' + this.borrIds + ' index of ' + this.borrIds.indexOf(borrowerId));
		loanRR.borrowers.rootIds.splice(this.borrIds.indexOf(borrowerId),1);
		this.borrIds = loanRR.borrowers.rootIds;
		console.debug('Borrowers after delete: ' + this.borrIds);
	}
	updateBorrower(borrower)
	{
		if (borrower.applCoAppl == 'BW' && borrower.coborrower.id)
		{
			this.deleteBorrower(borrower.coborrower.id);
			borrower.coborrower.id = 0;
	
		}
		else if (borrower.applCoAppl == 'QZ')
		{
			console.debug('Deleting Co-Borrower');
			var borr = this.getBorrowerForCoborrower(borrower.id);
			if (borr)
			{
				borr.coborrower.id = 0;//remove association
			}
		}
	}
	getBorrowerForCoborrower(coborrowerId:number)
	{
		for (var j = 0; j < this.borrData.length; j++)
		{
			if (this.borrData[j].applCoAppl == 'BW' && this.borrData[j].coborrower.id == coborrowerId)
			{
				return this.borrData[j];
			}
		}
	}

}