import {Component, OnInit, Type, OnDestroy,Directive} from '@angular/core';
import {AppshellEventService} from './../../../appshell/appshellevent.service';
import {AppShellUtil} from './../../../appshell/util/appshellutil.service';

@Component({
	selector:'quickstart',
	template: '<h4>QuickStart Component content will go here, this is just a placeholder as of now!!!</h4>'
})
export class QuickStart implements OnInit, OnDestroy
{
	constructor(private shellUtil:AppShellUtil,private shellEvent:AppshellEventService) { }
	ngOnInit()
	{
		let navApp = this.shellUtil.getNavApp('QuickStart');
		this.shellEvent.triggerEvent(AppshellEventService.navappLoadedEmitter,navApp);
	}
	ngOnDestroy()
	{

	}
}

@Component({
    selector: 'quickstart-header',
    template: `<img src="assets/icons/search.png">
                    <label>Search a Loan#, Borrower or Subject Property Address</label>
                  `
})
export class QuickStartHeader implements OnInit, OnDestroy {
    ngOnInit() 
    {
    }
    ngOnDestroy() {
        //Placeholder for now, must implement cleanup code.
    }
}
