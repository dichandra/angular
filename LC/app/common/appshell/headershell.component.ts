import {Component, OnInit, Type, OnDestroy, DynamicComponentLoader,Injector,ViewChild,ViewContainerRef,
    AfterViewInit, provide, ComponentRef,ComponentResolver} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AppshellEventService} from './appshellevent.service';
import {RouteUtil} from './../util/routeutil.service';
import {QuickStartHeader} from './../components/main/quickstart/quickstart.component';
@Component({
    selector: 'header-shell',
    templateUrl: 'app/common/appshell/headershell.component.html'
})
export class HeaderShell implements OnInit, OnDestroy,AfterViewInit
{
    @ViewChild('dynamicHeaderContent', { read: ViewContainerRef }) container: ViewContainerRef;


    private navAppLoadedSubscription: any;
    private headerComp:any;

    constructor(private vcf: ViewContainerRef, private injector: Injector,
        private routeUtil: RouteUtil,private compResolver:ComponentResolver) 
    {
    }
    ngOnInit() 
    {
        console.debug('initializing the comp');
    }
    ngAfterViewInit()
    {

        if (!this.navAppLoadedSubscription)
        {
            console.debug('Subscription is added: ');
            this.navAppLoadedSubscription = AppshellEventService.navappLoadedEmitter.subscribe((data) => {
                this.updateHeader(data);
            });
        }
    }
    updateHeader(navComp) {
        //load the header component next to marker
        if (navComp.headerComp) {
            if (this.headerComp) {
                this.headerComp.destroy();
            }
             this.routeUtil.loadComponent(navComp.compFile, navComp.headerComp, this.compResolver, 
                this.container, comp => this.updateHeaderCallback(comp));

        }
    }
    updateHeaderCallback(comp: ComponentRef<any>)
    {
        this.headerComp = comp;
    }
    ngOnDestroy()
    {
        //Placeholder for now, must implement cleanup code.
        this.navAppLoadedSubscription.unsubscribe();
    }
   
}
