import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {LoanActivityPanel} from './lap/LoanActivityPanel';

@Component({
	selector: 'planrenderer',
	templateUrl: 'app/common/components/ui/loansubapp/viewrenderer/planrenderer.component.html',
        directives: [LoanActivityPanel],
})
export class PlanRenderer implements OnInit, OnDestroy {
	@Input() planContextTO: any;
	responsibilityTOs: any;

	constructor() { }
	ngOnInit() 
	{
		if (this.planContextTO)
		{
			this.responsibilityTOs = this.planContextTO.responsibilityContextTOs;
		}
	}
	ngOnDestroy() {

	}
}
