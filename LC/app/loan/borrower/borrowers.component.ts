import {Component, OnInit,OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {DataService} from './../../dataservice/lcdata.service';
import {EventService} from './../../common/events/commonevent.service';
import {DataUtil} from './../../dataservice/dataserviceutil.component';
import {CLSValidator} from './../../common/validation/attribute-directive/clsvalidator.directive';
@Component({
    selector: 'borrowers',
    templateUrl: 'app/loan/borrower/addborrowers.component.html',
   // template : ' hello There',
    directives: [CLSValidator]
})
export class BorrowerComponent implements OnInit, OnDestroy
{
	private _loanId: number;
	borrData = [];
	borrowerId: number;
	borrClassName:String = 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO';
	perClassName: String = '';
	saveSubscription: any;

	constructor(private _routerParams:RouteParams,
				private _dataService:DataService)
	{

	}
	ngOnInit() 
	{
		this.saveSubscription = EventService.saveemitter.subscribe((data) => {
			this.prepBorrowersBeforeSave(data);
		});
		console.debug('initialize BorrowerComponent');
		this._loanId = this._routerParams.get('id');
		//create transient tos for borrower pair
		let args = [];
        let borrowers = [];
        borrowers[0] = 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO';
        borrowers[1] = 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO';
        args[0] = borrowers;
		/*this._dataService.createTransientRegionTOs(args).subscribe(response => {
			this.prepBorrowers(response);
			for (var j = 0; j < args[0].length; j++)//resetting caches after prepping borrowers
			{
				DataUtil.setEditableData(DataUtil.getKey(borrowers[j], response.result[j].id), response.result[j]);
			}
			this.borrData = response.result;
		});*/
		this._dataService.createTransientRegionTOsNew(args,data=>this.handleCreateTransientTOs(data),err=>this.handleError(err));

  	/*	this._dataService.callService('BulkCrudService', 'createTransientRegionTOs', args).
            subscribe(response => 
            	{ 
					this.borrData = response.result;
					console.debug('in on select :' + JSON.stringify(this.borrData)); 
            	}
            	);
            	*/
	}
	handleCreateTransientTOs(data:any):void
	{
		this.prepBorrowers(data);
		for (var j = 0; j < data.length; j++)//resetting caches after prepping borrowers
		{
			DataUtil.setEditableData(DataUtil.getKey(data[j].__clazz_Name, data[j].id), data[j]);
		}
		this.borrData = data;
	}
	handleError(err:any):void
	{
		console.debug('Error occured',err);
	}
	prepBorrowers(data)
	{
		//console.debug(' data in prepborrowers : '+JSON.stringify(data))
		data[0]['applCoAppl'] = 'BW';
		data[0].coborrower['id'] = data[1]['id']
		data[1]['applCoAppl'] = 'QZ';
		
	}
	prepBorrowersBeforeSave(data)
	{
		//console.debug('save data: '+JSON.stringify(data));
		/*for()
		{

		}*/
	}
	ngOnDestroy() 
	{
		console.debug('calling dispose borrower component');
		this.saveSubscription.unsubscribe();
	}


}