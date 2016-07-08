import {Injectable, ElementRef} from '@angular/core';
import {CLSValidator} from './attribute-directive/clsvalidator.directive';

@Injectable()
export class ValidationManager
{
	private validators = {};
	public registerValidator(validatorId: string, validator: CLSValidator): void
	{
		//console.debug('Registering '+validatorId);
		this.validators[validatorId] = validator;
	}
	public getValidator(validatorId: string): CLSValidator
	{
		return this.validators[validatorId];
	}
	public unregisterValidator(validatorId: string): void
	{
		//console.debug('Unregistering ' + validatorId);
		delete this.validators[validatorId];
	}	
	public doValidate(errors:any):void
	{
		if(!errors)
		{
			return;
		}
		var keys = Object.keys(errors);
		for (var j = 0; j < keys.length;j++)//iternate through all activity errors
		{
			var temp = errors[keys[j]];
			for (var i = 0; i < temp.length;i++)//iternate through all errors for one activity
			{
				let errKey = this.getErrKey(temp[i]);//find the key for error
				if(this.validators[errKey])//if validator with key is present, validate it
				{
					console.debug('validation is invoked: '+errKey);
					this.validators[errKey].setValidationMessage(this.getMessage(temp[i]));
					this.validators[errKey].respondToValidation();
				}
			}
		}
	}
	public undoValidate()
	{
		let keys = Object.keys(this.validators);
		for (var j = 0; j < keys.length;j++)
		{
			if(this.validators[keys[j]].isActive())
			{
				this.validators[keys[j]].deactivate();
			}
		}
	}
	private getMessage(error:any):string
	{
		return error['msg'];
	}
	private getErrKey(error:any):string
	{
		return error['toClassName'] + ':' + error['toID'] + ':' + error['toFieldName'];
	}

}