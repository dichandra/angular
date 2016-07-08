import {Injectable,EventEmitter} from '@angular/core';
@Injectable()
export class EventService {
	public static saveemitter = new EventEmitter();
        //Event emitter for any time a cache update piggyback updates a cached object
	public static cacheUpdateEmitter = new EventEmitter();
        //Event emitter for any time a cache update piggyback deletes a cached object
        public static cacheDeleteEmitter = new EventEmitter();
        //Event emitter for any time a region root is set/updated in cache, will be invoked on first time read as well
        // Please note this event will be fired in addition to cacheUpdateEmitter when cache updates piggy back updates the region roots
        public static readRootEmitter = new EventEmitter();
	public static loginEmitter = new EventEmitter();
	public static logoutEmitter = new EventEmitter();
	public static failedLoginEmitter = new EventEmitter();
	public static openLoanEmitter = new EventEmitter();

	constructor() 
	{
	}
	public static triggerPreSaveEvent(data)
	{
		console.debug('triggering save event');
		this.saveemitter.emit(data);
	}
	public static triggerCacheUpdateEvent(data) {
		console.debug('triggering cache update event');
		this.cacheUpdateEmitter.emit(data);
	}
	public static triggerEvent(eventName:EventEmitter<any>,data)
	{
		eventName.emit(data);
	}
	
}