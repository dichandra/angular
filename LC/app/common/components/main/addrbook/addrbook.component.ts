import {Component, OnInit, Type, OnDestroy,Directive} from '@angular/core';
import {AppshellEventService} from './../../../appshell/appshellevent.service';
import {AppShellUtil} from './../../../appshell/util/appshellutil.service';

@Component({
	selector:'addrbook',
	template: '<h4>Address Book Component content will go here, this is just a placeholder as of now!!!</h4>'
})
export class AddressBook implements OnInit, OnDestroy
{
	constructor(private shellUtil:AppShellUtil,private shellEvent:AppshellEventService) { }
	ngOnInit()
	{
		let navApp = this.shellUtil.getNavApp('AddressBook');
		this.shellEvent.triggerEvent(AppshellEventService.navappLoadedEmitter,navApp);
	}
	ngOnDestroy()
	{

	}
}
@Component({
    selector: 'addrbook-header',
    template: `addressbook`
})
export class AddrBookHeader implements OnInit, OnDestroy {
    ngOnInit() {
    }
    ngOnDestroy() {
        //Placeholder for now, must implement cleanup code.
    }
}
