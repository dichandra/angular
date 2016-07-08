import {Injectable} from '@angular/core';
import {EventService} from './../common/events/commonevent.service'; 

@Injectable()
export class DataUtil {
    static dataToPull: Array = ['com.dorado.generated.persistence.model.loan.AdditionalLoanInfoTO',
        'com.dorado.generated.persistence.dmchannelmaster.loanproduct.LoanProductTO',
        'com.dorado.generated.persistence.dmchannelmaster.transaction.TransactionTO',
        'com.dorado.generated.persistence.dmchannelmaster.underwritingsummary.UnderwritingTO',
        'com.dorado.generated.persistence.model.loan.LoanStateTO',
        'com.dorado.generated.persistence.model.loan.ExtensionTO',
        'com.dorado.generated.persistence.dmchannelmaster.purchasetransaction.PurchaseTransactionTO',
        'com.dorado.generated.persistence.dmchannelmaster.borrower.InterviewerTO',
        'com.dorado.generated.persistence.model.loan.LoanHousingExpenseTO',
        'com.dorado.generated.persistence.dmchannelmaster.lbpostclosing.PostClosingDetailTO',
        'com.dorado.generated.persistence.dmchannelmaster.lbpostclosing.insuring.InsuringTO',
        'com.dorado.generated.persistence.model.loan.relationship.LoanGroupTO',
        'com.dorado.generated.persistence.dmchannelmaster.uwdocreview.UWDocReviewTO',
        'com.dorado.generated.persistence.dmchannelmaster.loan.government.GovLoanTO',
        'com.dorado.generated.persistence.dmchannelmaster.purchasetransaction.PTLoanProductTO'];
    static editableData = {};
    static editableDataClone = {};
    static readOnlyData = {};
   // static dataToSave = [];

    public static pullData(toName: string, toId: number): boolean {
        return this.dataToPull.indexOf(toName) >= 0 && !this.editableData.hasOwnProperty(toName + ':' + toId);
    }
    public static setEditableData(key: string, toObj: Object):void {
            this.editableData[key] = toObj;
            // this did not 'clone' child objects i.e. child objects seems to be references
            // this.editableDataClone[key] = Object.assign({}, toObj);
            this.editableDataClone[key] = JSON.parse(JSON.stringify(toObj));
            EventService.triggerEvent(EventService.readRootEmitter,key);
    }
    public static getEditableData(): any {
        return this.editableData;
    }
    public static getEditableEntity(key:string): any {
        return this.editableData[key];
    } 
    public static setReadOnlyData(key: string, toObj: Object):void {
        this.readOnlyData[key] = toObj;
    }
    public static getReadOnlyData(key: string, toObj: Object):Object {
        return this.readOnlyData[key];
    }
    public static removeEditableEntity(key:string):void 
    {
        delete this.editableData[key];
        delete this.editableDataClone[key];
    }
   /* public static setDataToSave(key: String) {
        this.dataToSave.push(key);
    }*/
    public static getKey(toToGet: string, idToGet: number): string
    {
        return toToGet + ':' + idToGet;
    }
    public static processResults(data:any)
    {
        if (data.cacheConflictDetected)
        {
            console.debug('Error: One of the entities you are trying to save is out of date.');
        }
        this.processCacheUpdates(data.cacheUpdates);
        this.processCacheDeletes(data.cacheDeletes);
        //this.tick();
    }
    public static processCacheUpdates(cacheUpdates:any):void
    {

        if(cacheUpdates)
        {
            var updatedTos = [];
            console.debug('Processing cache udpates');
            for (var j = 0; j < cacheUpdates.length;j++)
            {
                let key = this.extractKey(cacheUpdates[j]);
                updatedTos.push(key);
                if(this.getEditableEntity(key))
                {
                    this.processMerge(key, cacheUpdates[j].root);
                }
                else
                {
                    this.setEditableData(key, cacheUpdates[j].root);
                }
            }
        }
        if (updatedTos && updatedTos.length >0)
        {
            EventService.triggerCacheUpdateEvent(updatedTos);

        }
    }
    public static processCacheDeletes(cacheDeletes: any): void
    {
        if (cacheDeletes) 
        {
            console.debug('Processing cache deletes for '+JSON.stringify(cacheDeletes));
            if (cacheDeletes.length >0)
            {
                for (var j = 0; j < cacheDeletes.length;j++)
                {
                    this.removeEditableEntity(this.getKey(cacheDeletes.rootKey.toClassName, cacheDeletes.rootKey.id));
                }
            }
        }
    }    
    private static processMerge(key:string,entity:any):void
    {
        //TODO - re-eval after testing, conflicting changes may force you to do a merge/autosave
        console.debug('Warn: updating already existing entity: '+key);
        // Just overwrite for now
        var original = this.getEditableEntity(key);
        console.debug('Warn: updating version: ' + original.version);
        //original.version = entity.version;
        this.setEditableData(key, entity);
        console.debug('version after update : ' + this.getEditableEntity(key).version);
    }
    private static extractKey(cacheEntry:any)
    {
        if(cacheEntry)
        {
            return this.getKey(cacheEntry.root.__clazz_Name, cacheEntry.root.id);
        }
    }
    public static getDataToSave(): Object {
        //Change this to return elements which are to be saved i.e. only TOs which are modified
        var dataToSave = {};
        var keys = Object.keys(this.editableData);
        for (let j = 0; j < keys.length; j++)
        {
            //console.debug('Comparing ' + keys[j]);
            if (this.compareJSON(this.editableData[keys[j]], this.editableDataClone[keys[j]])) 
            {
                /*if (keys[j] == 'com.dorado.generated.persistence.dmchannelmaster.borrower.BorrowerTO:-2')
                {
                    console.debug('After Change: '+JSON.stringify(this.editableData[keys[j]]);
                    console.debug('\n\n\n============' + JSON.stringify(this.editableDataClone[keys[j]]));
                }*/
               // console.debug(' values are same ');
            }
            else 
            {
                //console.debug('values are different ship for saving');
                //console.debug(' before: ' + JSON.stringify(dataToSave));
                dataToSave[keys[j]] = this.editableData[keys[j]];
                //console.debug(' after: ' + JSON.stringify(dataToSave));

            }
        }
              console.debug(' sending following for save: '+JSON.stringify(Object.keys(dataToSave)));
             // console.debug(' sending following for save: ' + JSON.stringify(dataToSave));

           return dataToSave;
    }
    /*
    * Editable Clone data should be reset on every SUCCESSFULL save
    */
    public static resetEditableCloneData(): void 
    {
        this.editableDataClone = {};
        var keys = Object.keys(this.editableData);
        for (let j = 0; j < keys.length; j++)
        {
            this.editableDataClone[keys[j]] = JSON.parse(JSON.stringify(this.editableData[keys[j]]));
        }
    }
    public static clearEditableDataCache()
    {
        this.editableData = {};
        this.editableDataClone = {};
    }

    /*
    * Compares two JSON representation of TOs and returns true if same
    * returns false in case different. This is very primitive implementation 
    * of deep comparing the data
    */

    public static compareJSON(argA,argB):boolean 
    {
        var aChain = [], bChain = [], temp;
        if (argA === argB)//anything is not defined or null 
        {
            //console.debug('Json compare checkpoint 1 returning true');
            return true;
        }

        if (isNaN(argA) && isNaN(argB) && typeof argA === 'number' && typeof argB === 'number') 
        {
            //console.debug('Json compare checkpoint 2 returning true');
            return true;
        }

        // Check for infinitie linking loops
        if (aChain.indexOf(argA) > -1 || bChain.indexOf(argB) > -1) 
        {
            //console.debug('Json compare checkpoint 3 returning false');
            return false;
        }

        var keyA = Object.keys(argA).sort();
        var keyB = Object.keys(argB).sort();
        if (!keyA || !keyB || keyA.length != keyB.length) 
        {
            //console.debug('Json compare checkpoint 4 returning false');
            return false;
        } 
        // Quick checking of one object beeing a subset of another.
        for (let temp in argB) {
            if (argB.hasOwnProperty(temp) !== argA.hasOwnProperty(temp))
            {
                //console.debug('Json compare checkpoint 5 returning false');                
                return false;
            }
            else if (typeof argB[temp] !== typeof argA[temp]) 
            {
                //console.debug('Json compare checkpoint 6 returning false' + typeof argB[temp] + argB[temp] + " and " + typeof argA[temp] + argA[temp]);               
                return false;
            }
        }

        for (let temp in argA) {
            if (argB.hasOwnProperty(temp) !== argA.hasOwnProperty(temp)) {
                //console.debug('Json compare checkpoint 7 returning false');
                return false;
            }
            else if (typeof argB[temp] !== typeof argA[temp])
            {
                //console.debug('Json compare checkpoint 8 returning false');
                return false;
            }

            /*seperated out into a switch in case object to compare have multiple type of properties
            */
            switch (typeof (argA[temp]))  
            {
                case 'object':
                    aChain.push(argA);
                    bChain.push(argB);

                    if (!this.compareJSON(argA[temp], argB[temp])) {
                        //console.debug('Json compare checkpoint 9 returning false' + argB[temp] + ' and ' + argA[temp]);                        
                        return false;
                    }
                    aChain.pop();
                    bChain.pop();
                    break;

                default:
                    if (argA[temp] !== argB[temp]) {
                        //console.debug('Json compare checkpoint 10 returning false');                        
                        return false;
                    }
                    break;
            }
        }
        //console.debug('Json compare checkpoint 11 returning true');
        return true;

    } 
    public static tick() 
    {
        setTimeout(() => 
        {
            console.log('Causing UI refresh')
        }, 0);
    }    
}
