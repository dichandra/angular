import {Injectable,EventEmitter} from '@angular/core';

@Injectable()
export class EventService {
	public static saveemitter = new EventEmitter();
	public static cacheUpdateEmitter = new EventEmitter();
	public static loginEmitter = new EventEmitter();
	public static logoutEmitter = new EventEmitter();
	public static failedLoginEmitter = new EventEmitter();

	constructor() 
	{
	}
	public static triggerPreSaveEvent(data)
	{
		console.debug('triggering save event');
		this.saveemitter.next(data);
	}
	public static triggerCacheUpdateEvent(data) {
		console.debug('triggering cache update event');
		this.cacheUpdateEmitter.next(data);
	}
	public static triggerEvent(eventName:EventEmitter<any>,data)
	{
		eventName.next(data);
	}
	
}