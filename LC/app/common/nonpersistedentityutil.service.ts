import {Injectable} from '@angular/core';

@Injectable()
//This should be a singleton (have provider entry at root level)
export class NonpersistedEntityUtil
{
	private _idGen: number = -2;
	public getNextId(): number 
	{
		return this._idGen--;
	}	

	public getAndPopulateRootId(transientTo)
	{
		let id = this.getNextId();
		transientTo.id = id;
		this.populateRootIds(transientTo,id);
	}
	public populateRootIds(transientTo,id)
	{
		var keys = Object.keys(transientTo);
		for (var j= 0; j < keys.length;j++)
		{
			if (typeof transientTo[keys[j]] == 'object' && transientTo[keys[j]]
				&& transientTo[keys[j]]['rootClassName'] && transientTo[keys[j]]['relationshipType']=='owning')
			{
				transientTo[keys[j]]['id'] = id;
			}
		}
	}
}