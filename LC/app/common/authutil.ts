import {EventService} from './events/commonevent.service';
export class AuthUtil
{
	private static loginResult: any;
	private static cred: any;
	static getLoggedInUser():any
	{
		return this.loginResult;
	}
	static setLoggedInUserData(loggedInUserData:any):void
	{
		this.loginResult = loggedInUserData;
		this.cred = JSON.stringify(this.loginResult[0].cred);
	}
	static getCred(): any 
	{
		if (this.loginResult)
		{
			return this.cred;
		}
	}
	static triggerLoginEvent()
	{
		EventService.triggerEvent(EventService.loginEmitter, this.getCred())
	}
    public static isAuthenticated(): boolean
    {
		if (this.getLoggedInUser())
		{
			return true;
		}
		else 
		{
			return false;
		}
	}	
}
