import {Component,Injectable,OnInit,OnChanges} from '@angular/core';

@Injectable()
export class RuntimeContext
{
	private loanContext: LoanContext;
	private loggedInUserContext: LoggedInUserContext;
	public getLoanContext()
	{
		return this.loanContext();
	}
	public getLoggedInUserContext()
	{
		return this.loggedInUserContext;
	}
}