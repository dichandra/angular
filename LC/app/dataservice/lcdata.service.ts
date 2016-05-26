import { Injectable, EventEmitter } from '@angular/core';
import {Http, Headers, Response, Request, HTTP_PROVIDERS } from '@angular/http';
import {DataUtil} from './dataserviceutil.component';
import {Subject} from 'rxjs/Subject';
import {NonpersistedEntityUtil} from './../common/nonpersistedentityutil.service'; 
import {EventService} from './../common/commonevent.service'; 
import {AuthUtil} from './../common/authutil';

@Injectable()
export class DataService {
    constructor(public http: Http, private npeutil: NonpersistedEntityUtil) { }
    serviceBase = 'http://localhost/angular/';
    fetchDataString = '{ "service": "CacheSupportService", "operation":"read", "args":["';

    getEditableData(toToGet: String, idToGet: number) {
        console.log('in getEditableData');

        var serviceCall = { "service": "CacheSupportService", "operation": "read", "args": [] };
        var headers = new Headers();


        headers.append('Content-Type', 'application/json');
        serviceCall['args'].unshift(AuthUtil.getCred());
        var d = new Date();
        var UTCDateInMillis = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(),
            d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        serviceCall['args'].push(UTCDateInMillis);        
        serviceCall['args'].push(null);
        serviceCall['args'].push(toToGet);
        serviceCall['args'].push(idToGet);
        //serviceCall['args'].unshift(JSON.stringify(AuthUtil.getLoggedInUser()));
   
        //console.debug("Cred info: " + serviceCall['args'][2]);
        return this.http.post(this.serviceBase + 'jsonbridge/execute', JSON.stringify(serviceCall), { headers: headers })
            .map((responseData) => {
                let obj = responseData.json();
                DataUtil.setEditableData(DataUtil.getKey(toToGet, idToGet), obj.result);
                return obj.result;
            }
            )
    }
    getEditableDataNew(toToGet: String, idToGet: number,useCache:boolean, callBackMethod: any, errorCallBack: any) {
        console.log('in getEditableDataNew'+toToGet+' and '+idToGet);
        var args = [];
        args[0] = toToGet;
        args[1] = idToGet;
        var callResultServer : any;
        var cachedData = DataUtil.getEditableEntity(DataUtil.getKey(toToGet,idToGet));
        if (useCache && cachedData) //Have the object in the cache
        {
            args[2] = cachedData.version;
            //TODO - now that we are consuming cache updates, this should be updated to use poll() instead of readLatest
            this.callServiceInternal('CacheSupportService', 'readLatest', args)
                .subscribe(response => {
                    callResultServer = response.result;
                }, err => {
                    console.debug('Error occurred while invoking CacheSupportService.readLatest ', err); errorCallBack(err);
                },
                () => {
                    if (callResultServer) {
                        console.debug('Using latest value from readLatest');
                        DataUtil.setEditableData(DataUtil.getKey(toToGet, idToGet), callResultServer);
                        callBackMethod(callResultServer);
                    }
                    else {
                        console.debug('Using cached value');
                        callBackMethod(cachedData);
                    }
                }
                );
        }
        else //get value from server
        {
            console.debug('use cache is false or cached value is not available');
            this.callServiceInternal('CacheSupportService', 'read', args)
                .subscribe(response => {
                    callResultServer = response.result;
                }, err => {
                    console.debug('Error occurred while invoking CacheSupportService.read ', err); errorCallBack(err);
                },
                () => {
                        console.debug('Call CacheSupportService.read cmopleted successfully.');
                        DataUtil.setEditableData(DataUtil.getKey(toToGet, idToGet), callResultServer);
                        callBackMethod(callResultServer);
                }
                );
        }
    }

    callServiceInternal(serviceName:string,operationName:string,args:Array)
    {
        var serviceCall = { "service": "", "operation": "", "args": [] };
        var headers = new Headers();
        serviceCall['service'] = serviceName;
        serviceCall['operation'] = operationName;
        serviceCall['args'] = args;
        headers.append('Content-Type', 'application/json');
        serviceCall['args'].unshift(null);
        var d = new Date();
        var UTCDateInMillis = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 
            d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        serviceCall['args'].unshift(UTCDateInMillis);
        //serviceCall['args'].unshift(JSON.stringify(AuthUtil.getLoggedInUser()));
        serviceCall['args'].unshift(AuthUtil.getCred());
        //console.debug("Cred info: " + serviceCall['args'][2]);

        //console.debug('query string ' + JSON.stringify(serviceCall));
        return this.http.post(this.serviceBase + 'jsonbridge/execute', JSON.stringify(serviceCall), { headers: headers })
            .map((responseData) => {
                console.debug('calling: ' + serviceName + '.' + operationName);
                let jsonData = responseData.json();
                DataUtil.processResults(jsonData);
                return jsonData;
            }
            );
    }
    callService(serviceName: string, operationName: string, args: Array,callBackMethod:any,errorCallBack:any,returnData:string)
    {
        var callResult:any;
        console.debug('in callService method');
        this.callServiceInternal(serviceName, operationName, args)
            .subscribe(response => {
                // console.debug('search result: '+JSON.stringify(response.result));
                if(returnData)
                {
                    callResult = eval('response.'+returnData);
                }
                else
                {
                    callResult = response.result;
                }
                
            }, err => { console.debug('Error occurred while invoking '+serviceName+'.'+operationName,err); errorCallBack(err)},
            () => { console.debug('Call ' + serviceName + '.' + operationName + ' cmopleted successfully.'+callResult); callBackMethod(callResult); }
                );        
    }
    createTransientRegionTOs(toList:Array<string>)
    {
        var serviceCall = { "service": "", "operation": "", "args": [] };
        var headers = new Headers();
        serviceCall['service'] = 'BulkCrudService';
        serviceCall['operation'] = 'createTransientRegionTOs';
        serviceCall['args'] = toList;

        console.debug('query string ' + JSON.stringify(serviceCall));
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.serviceBase + 'jsonbridge/execute', JSON.stringify(serviceCall), { headers: headers })
            .map((responseData) => {
                var obj = responseData.json();
                console.debug('before: ' + toList.length);
                for (var j = 0; j < toList[0].length;j++)
                {
                    this.npeutil.getAndPopulateRootId(obj.result[j]);
                    DataUtil.setEditableData(DataUtil.getKey(toList[0][j], obj.result[j].id), obj.result[j]);
                }
                return obj;
            }
            );
    }
    createTransientRegionTOsNew(toList: Array<string>,callBackMethod:any,errorCallBack:any):void
    {
        var callResult: any;
        this.callServiceInternal('BulkCrudService', 'createTransientRegionTOs', toList).subscribe(response => {
            // console.debug('search result: '+JSON.stringify(response.result));
            callResult = response.result;
            for (var j = 0; j < callResult.length; j++) {
                this.npeutil.getAndPopulateRootId(response.result[j]);
                DataUtil.setEditableData(DataUtil.getKey(response.result[j].__clazz_Name, response.result[j].id), response.result[j]);
            }
        }, err => { console.debug('Error occurred while invoking BulkCrudService.createTransientRegionTOs : ', err); errorCallBack(err) },
        () => { console.debug('Call BulkCrudService.createTransientRegionTOs cmopleted successfully.' + callResult); callBackMethod(callResult); }
        );
    }

    //Remind: if possible change/wrap to unmutable
    getReadOnlyData(toToGet: String, idToGet: number) {
        console.log('in readData method');
        let readData = DataUtil.getReadOnlyData(DataUtil.getKey(toToGet, idToGet));
        if (readData) {
            return readData;
        }
        var headers = new Headers();
        let data = this.fetchDataString + toToGet + '", "' + idToGet + '"] } ';
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.serviceBase + 'jsonbridge/execute', data, { headers: headers })
            .map((responseData) => {
                let obj = responseData.json();
                DataUtil.setReadOnlyData(DataUtil.getKey(toToGet, idToGet), obj.result);
                return obj;
            }
            )
    }


    saveData(loanId:number,callBackMethod:any,errorCallBack:any)
    {
        
        var jsonRequest = new Object();
        jsonRequest.service = 'EventAwareDataService';
        jsonRequest.operation = 'updateTOs';
        var args = [loanId, []];
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var dataToBeSaved = DataUtil.getDataToSave();
        EventService.triggerPreSaveEvent(dataToBeSaved);
        var loanData = {};
        var pushLoan = false;
        var keys = Object.keys(dataToBeSaved);
        var saveResponse = {};
        if (!keys || keys.length <= 0) {
            console.debug('There is nothing to save' + keys);
           // Following does not work with current version of Angular i.e. beta.6
           /* _observableString = new Subject<string>();
            observablestring$ = this._observableString.asObservable();
            observableString.next('{"body":"Nothing to save."}');
            observableString.complete();
            return observablestring$ ;
            */
            return {};
        }
        for (j = 0; j < keys.length; j++) {
            var tempTO: String = keys[j].toString().split(':')[0].toString();
            if (tempTO == 'com.dorado.generated.persistence.model.loan.LoanApplicationTO') //push loanTO to end
            {
                loanData['type'] = keys[j].toString().split(':')[0];
                loanData['content'] = dataToBeSaved[keys[j]];
                pushLoan = true;
            }
            else
            {
                var temp = {};
                temp['type'] = keys[j].toString().split(':')[0];
                temp['content'] = dataToBeSaved[keys[j]];
                args[1].push(temp);                
            }
        }
        if(pushLoan)
        {
            //console.debug('Adding loanTO at the end of array'+JSON.stringify(loanData));
            args[1].push(loanData);
            pushLoan = false;
        }
        if (Array.isArray(args)) {

            for (let j = 0; j < args.length; j++) {
                if (Array.isArray(args[j])) {
                    //console.log("jsonRequest.args is array1: " + JSON.stringify(jsonRequest.args[j]);
                    for (let k = 0; k < args[j].length; k++) {
                        let itemk = args[j][k];
                        itemk.content = JSON.stringify(itemk.content);
                    }
                }

            }
            this.callServiceInternal('EventAwareDataService', 'updateTOs', args)
                .subscribe(response => {
                    saveResponse = response.result;
                    //console.debug('save result:' + JSON.stringify(response));
                }, err => {
                    console.debug('Error occurred while invoking save ', err); 
                    errorCallBack(err);
                    this.handleSaveError(err);
                },
                () => {
                    console.debug('Call save cmopleted successfully.');
                    callBackMethod(saveResponse);
                    this.handleSaveSuccess(saveResponse);
                }
                );      
        }
        else {
            this.callServiceInternal('EventAwareDataService', 'updateTOs', args)
                .subscribe(response => {
                    saveResponse = response.result;
                    //console.debug('save result1:' + JSON.stringify(response));
                }, err => {
                    console.debug('Error occurred while invoking save ', err);
                    errorCallBack(err);
                    this.handleSaveError(err);
                },
                () => {
                    console.debug('Call save cmopleted successfully.');
                    callBackMethod(saveResponse);
                    this.handleSaveSuccess(saveResponse);
                }
                ); 
        }        
    }
    handleSaveSuccess(response:any)
    {
        console.debug('Erasing clone data');
        DataUtil.resetEditableCloneData();
    }
    handleSaveError(error:any)
    {
        console.debug('Error occurred while saving.',error);
    }
}