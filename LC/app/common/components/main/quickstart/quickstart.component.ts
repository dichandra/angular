import {Component, OnInit, Type, OnDestroy, Directive, EventEmitter} from '@angular/core';
import {AppshellEventService} from './../../../appshell/appshellevent.service';
import {AppShellUtil} from './../../../appshell/util/appshellutil.service';
import {WidgetContainer, WidgetDef} from './../../ui/widget/widgetcontainer.component';
import {AuthUtil} from './../../../../common/authutil';
import {DataService} from './../../../../dataservice/lcdata.service';
import {LoanSubApp} from './../../ui/loansubapp/loansubapp.component';
import {EventService} from './../../../commonevent.service';


@Component({
	selector: 'quickstart',
	templateUrl: 'app/common/components/main/quickstart/quickstart.component.html',
	directives: [WidgetContainer,LoanSubApp]
})
export class QuickStart implements OnInit, OnDestroy {
	private qs: any;
	private openLoanEmitter: EventEmitter<any>;

	constructor(private shellUtil: AppShellUtil, private shellEvent: AppshellEventService) { }
	ngOnInit() {
		let navApp = this.shellUtil.getNavApp('QuickStart');
		this.shellEvent.triggerEvent(AppshellEventService.navappLoadedEmitter, navApp);
		this.openLoanEmitter = EventService.openLoanEmitter.subscribe(data => this.openLoan(data));
	}
	ngOnDestroy() {
		this.openLoanEmitter.unsubscribe();
	}
	openLoan(searchResult: any) {
		//console.debug('search result is ' + JSON.stringify(searchResult);
		if (searchResult && searchResult.context=='searchResult')
		{
			console.debug('before ',this.qs);
			this.qs = searchResult.data;
			console.debug('after ', this.qs);

		}
	}
	getWidgetComp(): WidgetDef {
		return {
			name: "My Loans", image: "", compFile: 'app/common/components/main/quickstart/widgets/myloanwidget.component',
			component: 'MyLoanBody', headerComp: 'MyLoanHeader'
		}
	}
	getSearchResult():any
	{
		//console.debug(this.qs[0]['loanApplications'][0]["planContext"]['id']);
		return this.qs;
	}

}

@Component({
    selector: 'quickstart-header',
	templateUrl: 'app/common/components/main/quickstart/quickstart-header.component.html'
})
export class QuickStartHeader implements OnInit, OnDestroy {
	showSearchResultPanel: boolean = false;
	qs: string;
	loanId;
	loanNum;
	searchResponse;
	loan: any;
	searchResponseData: any;
	constructor(private shellEvent: AppshellEventService, private _dataService: DataService) {
	}
    ngOnInit() {
    }
    ngOnDestroy() {
        //Placeholder for now, must implement cleanup code.
        this.searchResponseData = null;
		this.qs = null;
		this.loanId = null;
		this.loanNum = null;
		this.searchResponse = null;
		this.loan = null;

    }
	/* searchLoan(searchQuery)
	 {
		 console.debug('quick start search event');
		 this.qs = searchQuery;
		 this.showSearchResultPanel = true;
		 this.shellEvent.triggerEvent(QuickStartEvent.qshSearchEmitter,searchQuery);
	 }*/
	public searchLoan(loanNumber: String): void {
        console.debug('searching for loan# ' + loanNumber);
        //this.loanNum = loanNumber;
        //this.resetData();
        var args = [];
        this.loanNum = loanNumber;
        args[0] = JSON.parse(AuthUtil.getCred()).userID;
        args[1] = loanNumber; args[2] = 10; args[3] = 1;
        this._dataService.callService('LoanPipelineService', 'findLoansByPageForUser', args, data => this.successCallBack(data),
			err => this.errorCallBack(err));
    }
    successCallBack(response: any) {
        if (response.length > 0 && response[0]['loanApplications'][0]['id']) {
            this.loanId = response[0]['loanApplications'][0]['id'];
            this.loan = response[0]['loanApplications'][0];
            this.searchResponse = "";
            this.searchResponseData = response;
        }
        else {
            this.searchResponse = 'No Data Found for loan: ' + this.loanNum;
            this.loanId = null;
            this.loanNum = null;
        }
        this.showSearchResultPanel = true;
    }
    errorCallBack(response: any) {
        console.debug('Error success' + JSON.stringify(response));
    }
    closeSearchResultPanel() {
		this.showSearchResultPanel = false;
    }
    openLoan(responseData) {
		this.shellEvent.triggerEvent(EventService.openLoanEmitter, {context:'searchResult',data:responseData });
    }

}
class QuickStartEvent {

}