import {Component, Inject, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { Router, RouterLink, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {UnsecuredHome} from './common/components/main/unsecuredhome.component';
import {NavApp,NavShell} from './common/appshell/navshell.component';
import {HeaderShell} from './common/appshell/headershell.component';
import {RouteUtil} from "./common/util/routeutil.service";
import {NonpersistedEntityUtil} from './common/nonpersistedentityutil.service';
import {EventService} from './common/events/commonevent.service';
import {ValidationManager} from './common/validation/validationmanager.service';
import {DataService} from './dataservice/lcdata.service'
import {AuthUtil} from './common/authutil';
import {AppShellUtil} from './common/appshell/util/appshellutil.service';
import {AppshellEventService} from './common/appshell/appshellevent.service';



@Component({
    selector: 'loancenter-app',
    directives: [RouterLink, RouterOutlet,NavShell,HeaderShell],
    templateUrl:'app/loancenter.component.html',
    providers: [
        ROUTER_PROVIDERS,
        DataService,
        NonpersistedEntityUtil,
        EventService,
        ValidationManager,
        RouteUtil,
        AppShellUtil,
        AppshellEventService
    ]
})

@RouteConfig([
    {
        path: "/",
        component: UnsecuredHome,
        name: 'UHome',
        useAsDefault: true
    }
])
export class LoanCenterApp implements OnInit,OnDestroy
{
    navApps: NavApp[];
    private loginSubscription: EventEmitter<any>;
    constructor(private routeUtil:RouteUtil,private router:Router,private shellUtil:AppShellUtil) 
    {

        this.navApps = this.getNavApps();
        console.log('AppShell: route config size After: ' + JSON.stringify(routeUtil.getRoutes(this.constructor)));        
    }
    ngOnInit()
    {
        //TODO - this part should happen only after login, should not repeat on each initialization
        this.loginSubscription = EventService.loginEmitter.subscribe((data) => {
            this.handleLogin(data);
        });
    }
    ngOnDestroy()
    {
        //add cleanup code here
        this.loginSubscription.unsubscribe();
    }
    handleLogin(data)
    {
        //Routing business should be externalized into a seperate service to have more control over it
        //pull apps user has access to and add them into router configuration
        this.navApps=this.getNavApps();
        this.navApps.forEach((app) => {
            this.routeUtil.addRoute(this.constructor, this.routeUtil.createAsyncRoute(app));
        });
        this.router.navigate(['QuickStart']);
    }
    getNavApps():NavApp[]
    {
        return this.shellUtil.getNavApps();
    }
}