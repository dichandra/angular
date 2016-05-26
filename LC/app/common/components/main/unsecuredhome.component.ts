import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Work} from "../work/Work";
import {WeatherWidget} from "./widgets/WeatherWidget";
import {MapWidget} from "./widgets/MapWidget";
import {CurrentEventWidget} from "./widgets/CurrentEventWidget";
import {DataService} from './../../../dataservice/lcdata.service';
import {AuthUtil} from './../../../common/authutil';


@Component({
    selector: 'main',
    directives: [WeatherWidget, MapWidget, CurrentEventWidget],
    templateUrl: 'app/common/components/main/unsecuredhome.component.html'
})



export class UnsecuredHome {
    isValid:Boolean;
    loginMessage: string;
    constructor(private _remoteService:DataService,private _router:Router) {
        this.isValid = true;

    }

    handleLogin(name, password)
    {
        console.debug('doing login here ');
        this._remoteService.callService('Authentication', 'login', [name, password, 'Reference CM 3.0|HTML'], data => this.successLogin(data),
            err => this.errorLogin(err));
    }

    public successLogin(response: any) {
        if (response[0].completionCode == 0) {
            //  console.debug('User successfully logged in ' + JSON.stringify(response));
            this.loginMessage = '';
            AuthUtil.setLoggedInUserData(response);
            AuthUtil.triggerLoginEvent();
        }
        else {
            this.loginMessage = 'You made a mistake, this is your first strike!!!';
        }

    }
    public errorLogin(response: any) {
        console.debug('Error in login: ' + JSON.stringify(response));
    }

}