import { Component, OnInit,DynamicComponentLoader,ElementRef, 
    OnDestroy,ComponentResolver,ViewContainerRef} from '@angular/core';
import { Router,RouteParams } from '@angular/router-deprecated';
import {DataUtil} from "./dataservice/dataserviceutil.component";
import {DataService} from './dataservice/lcdata.service'
import {EventService} from './common/events/commonevent.service';
import {CLSValidator} from './common/validation/attribute-directive/clsvalidator.directive';



@Component({
    selector: 'json-to-ui-widget',
   template:'',
    // templateUrl: 'app/repeated.component.html',
    styleUrls: ['app/dashboard.component.css'],
    inputs:['id','className','preloadedDataMode','preloadedData','title']
})
export class RepeatedComponent implements OnInit {
    className:String;
    id:number;
    readResponse = "";
    writeResponse = "";
    dataPulled = {};
    dataToSave = [];
    readResp = "No Response Yet";
    keys :String[] = [];
    values: Object[] = [];
    preloadedDataMode: boolean;
    preloadedData = {};
    title: String;



    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _dataService:DataService,
        private loader: DynamicComponentLoader, private elementRef: ElementRef,
        private cr:ComponentResolver,private vcr:ViewContainerRef) {
    }

    ngOnInit()
     {
        console.debug(' in init method repeated template');
        if(this.preloadedDataMode)//dont load the data, work with preloaded data
        {
            this.processResult(this.preloadedData);
        }
        else //pull data now
        {
            // if the component is invoked from router
            if (this._routeParams.get('loanId') && this._routeParams.get('className'))
           {
                this.className = this._routeParams.get('className');
                this.id = this._routeParams.get('loanId');
                this.title = this._routeParams.get('title');
           }            
           /* this._dataService.getEditableData(this.className,this.id)
                .subscribe(response => {
                    this.processResult(response);
                }); */    
            this._dataService.readRoot(this.className,this.id,true,data => this.processResult(data), 
                error => this.processError(error))       
        }

    }
    processResult(response:any)
    {
        //this.readResponse = response;
        //this.dataPulled[this.className + ':' + this.id] = response;
        //this.dataToSave.push(this.className + ':' + this.id);
        //Util.setDataPulled(this.className + ':' + this.id, response);
        //Util.setDataToSave(this.className + ':' + this.id);
       // console.debug('after read data trying to read names:-' + Object.keys(response));
        this.keys = Object.keys(response);
        this.addFakeTemplate(this.title, DataUtil.getEditableData()[this.className + ':' + this.id]);
        //this.addFakeTemplate(this.title, response.result);
    }
    processError(response:any)
    {
        console.debug('Oho error!!!',response);
    }

    addFakeTemplate(title: String, data: Object) {
        if (!data && typeof data != 'object') {
            console.debug('Data Cannot be null: ' + data);
            return;
        }

        if (title && title.indexOf('useValAt') >= 0) {
            title = eval('data.' + title.split(':')[1]);
        }
        let temp = Object.keys(data);
        //let directives = [SimpleBlock];
        let directives = [];
        //this.loader.loadNextToLocation(this.toComponent(title,directives, data), this.elementRef);
        this.cr.resolveComponent(this.toComponent(title, directives, data)).
                then(factory =>
                {
                    this.vcr.createComponent(factory, 0);
                });
     
        for(let i in temp)
        {
            if(data[temp[i]])
            {

                if(typeof data[temp[i]] =='object')
                {
                    if (DataUtil.pullData((data[temp[i]]['className']), (data[temp[i]]['id'])))
                    {
                        //console.debug('pulling if'+Util.pullData((data[temp[i]]['className']),(data[temp[i]]['id']))+" ,"+temp[i]);
                        //this._dataService.readRoot(temp[i], (data[temp[i]]['className']), (data[temp[i]]['id']),true,);
                        this.pullAndPaintData(temp[i],(data[temp[i]]['className']),(data[temp[i]]['id']));
                        //this.addFakeTemplate(temp[i],this.pullData((data[temp[i]]['className']),(data[temp[i]]['id'])));
                    }
                    /*else if (Util.showData((data[temp[i]])['className']))
                    {
                        console.debug('pulling else' + Util.pullData((data[temp[i]]['className']), (data[temp[i]]['id'])) + " ," + temp[i]);
                        this.addFakeTemplate(temp[i],data[temp[i]]);
                    }*/

                }
            }
        }

    }
    public pullAndPaintData(title:String, toToPull:String, idToPull:number): void
    {
        this._dataService.getEditableData(toToPull,idToPull)
            .subscribe(response => {
                this.addFakeTemplate(title,response);
            });

    }

    toComponent(blockTitle,directives = [CLSValidator],partialData) {
        @Component({
            selector: 'json-to-ui-widget-repeater', inputs: ['_data'], templateUrl: 'app/repeated.component.html',
            directives: [CLSValidator] })
        class FakeComponent implements OnInit, OnDestroy{
            _data:Object;
            blockTitle:String;
            private saveSubscription: any;

            constructor(private loader: DynamicComponentLoader, private elementRef: ElementRef) {
                this._data = partialData;
                this.blockTitle = blockTitle;
            }
            ngOnInit()
            {
                this.saveSubscription = EventService.cacheUpdateEmitter.subscribe((data) => {
                    this.refreshBindings(data);
                });
            }
            public refreshBindings(toList:any)
            {
                if(toList && toList.length >0)//refresh bindings
                {
                    //console.debug('Refreshing bindings on cache update event version before update: ' + this._data.version);
                    this._data = DataUtil.getEditableEntity(DataUtil.getKey(this._data.__clazz_Name,this._data.id));
                    //console.debug('Refreshing bindings on cache update event new version: '+this._data.version);
                }
            }
            ngOnDestroy()
            {
                this.saveSubscription.unsubscribe();
            }
            keys():Array<String> {
                //console.debug(' in keys method');
                var arrStr = [];
                var temp = Object.keys(partialData);
                for (let i in temp) {
                    //console.debug("Content of arrays is "+temp);
                    if (typeof this._data[temp[i]] != 'object') //Display simple properties
                    {
                        arrStr.push(temp[i]);
                    }
                    /*else if (this._data[temp[i]] && (this._data[temp[i]])['className']
                        && Util.pullData((this._data[temp[i]])['className'])) // pull objects if marked for pulling
                    {

                        console.debug('thi is an object, do I need to pull' + Util.pullData((this._data[temp[i]])['className']));
                        // console.debug(' in fake component here is an object'+JSON.stringify(this._data[temp[i]]));
                    }*/
                }
                return arrStr;
            }

            getType(field:Object, index:number):String
            {
                // console.log(field+' , index '+index+' field name: '+Object.keys(this._data)[index])
                if (typeof field == 'number' && Object.keys(this._data)[index].includes('Date')) {
                    //  console.log('returning date');
                    return 'date';
                }
                return 'text';
            }

            isRR(field:Object, index:number):boolean
            {
                if(Object.keys(this._data)[index]==='relationshipType' && field === 'owning' && DataUtil.dataToPull(field['className']))
                {
                    return true;
                }
                return false;
            }
            getId(field:Object):number
            {
                console.debug('in get id method returning'+field['id']);
                if(field)
                {
                    return field['id'];
                }

            }
            getClassName(field:Object):String
            {
                console.debug('in getClassName id method returning'+field['className']);
                if(field)
                {
                    return field['className'];
                }

            }
        }
        return FakeComponent;
    }
}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */