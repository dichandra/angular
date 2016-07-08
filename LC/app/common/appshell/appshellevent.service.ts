import {Injectable, EventEmitter} from '@angular/core';
import {EventService} from './../events/commonevent.service';

@Injectable()
export class AppshellEventService 
{
	//Trigger event for loading an app so that subscriber can respond e.g. header can load corresponding compoent
	public static navappLoadedEmitter = new EventEmitter();

	//Trigger event for unloading an app so that subscriber can respond e.g. header can do cleanup if required
	public static navappUnloadedEmitter = new EventEmitter();
	
	constructor(private eventService:EventService){}

	public triggerEvent(eventName: EventEmitter<any>, data)
	{
		EventService.triggerEvent(eventName,data);
	}

}