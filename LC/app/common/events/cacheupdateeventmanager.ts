import {Injectable,EventEmitter,OnDestroy} from '@angular/core';
import {EventService} from './commonevent.service';

export class CacheUpdateEventManager {
        private static cacheUpdateSubscriberMap = new Map();
        private static cacheDeleteSubscriberMap = new Map();
        private static readRootSubscriberMap = new Map();
        private static cacheUpdateSubscription: any;
        private static readRootSubscription: any;
        private static cacheDeleteSubscription: any;

        //Specifically for cache updates which come back as piggyback for a service call
        public static subscribeForCacheUpdateEvent(regionRootTo:string,regionRootId:number,callBackMethod:any)
        {
            //Subscribing to cacheUpdateEmitter on registration of first ever subscriber going through Event Manager
            //for the POC of LoanSubAPp I don't think this class will ever be garbage collected so not worrying about 
            // cleanup at this point
            if(!this.cacheUpdateSubscription)
            {
                this.cacheUpdateSubscription = EventService.cacheUpdateEmitter.subscribe((data) => {
                this.invokeSubscribers(this.cacheUpdateSubscriberMap,data);
                });
            }
            let subscriberArray = this.cacheUpdateSubscriberMap[this.getKey(regionRootTo,regionRootId)];
            if (subscriberArray)
            {
                subscriberArray.push(callBackMethod);
            }
            else
            {
                this.cacheUpdateSubscriberMap[this.getKey(regionRootTo,regionRootId)] = [callBackMethod];
            }
        }
        //for generic read root/update root calls. Should be invoked on first read and subsequent updates. 
        public static subscribeForReadRootEvent(regionRootTo:string,regionRootId:number,callBackMethod:any)
        {
            //Subscribing to readRootEmitter on registration of first ever subscriber going through Event Manager
            //for the POC of LoanSubAPp I don't think this class will ever be garbage collected so not worrying about 
            // cleanup at this point
            if(!this.readRootSubscription)
            {
                this.readRootSubscription = EventService.readRootEmitter.subscribe((data) => {
                this.invokeSubscribers(this.readRootSubscriberMap,[data]);
                });
            }
            let subscriberArray = this.readRootSubscriberMap[this.getKey(regionRootTo,regionRootId)];
            if (subscriberArray)
            {
                subscriberArray.push(callBackMethod);
            }
            else
            {
                this.readRootSubscriberMap[this.getKey(regionRootTo,regionRootId)] = [callBackMethod];
            }
        }        
        //remove the callback method from the subscriber map, 
        //TODO remove the key if there is no vlaues remaining for the key
        public static unsubscribeFromCacheUpdateEvent(regionRootTo:string,regionRootId:number,callBackMethod:any)
        {
            let key = this.getKey(regionRootTo,regionRootId);
            let subscriberArray = this.cacheUpdateSubscriberMap[key];
            if (!subscriberArray)
            {
                console.debug('There is no subscriber found to unsubscibe for '+key);
            }
            else
            {
                let index = subscriberArray.indexOf(key,0);
                if(index > -1)
                {
                    subscriberArray.splice(index,1);
                }
                else
                {
                    console.debug('There is no subscriber callback found to unsubscibe for '+key);
                }
            }
        }

	private static getKey(rootTO:string,rootId:number)
        {
            return rootTO+':'+rootId;
        }
        private static invokeSubscribers(subscriberMap,data)
        {
            //invoke all the subscribers of the uppdates
            //cache update event has array of keys (toname+toid) of updated roots
            for(let key of data)
            {
                let arrCallBack = subscriberMap[key];
                if(arrCallBack)
                {
                    for(let callBack of arrCallBack)
                    {
                        callBack(key);
                    }
                }
            }
        }
 
}