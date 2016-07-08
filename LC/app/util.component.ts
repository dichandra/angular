import {Component} from 'angular2/core';
@Component({
    selector: '',
    template: '',
})
export class Util
{
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
        'com.dorado.generated.persistence.dmchannelmaster.loan.government.GovLoanTO'];
    static dataPulled = {};
    static dataToSave = [];
    //to check if I want to pull data for this TO and that I haven't already pulled it (avoid circular references)
    public static pullData(toName:String, toId:number):boolean
    {
        return this.dataToPull.indexOf(toName)>=0 && !this.dataPulled.hasOwnProperty(toName+':'+toId);
    }
    public static showData(toName: String): boolean {
        return this.pullData(toName);
    }
    public static setDataPulled(key:String, toObj:Object)
    {
        this.dataPulled[key]=toObj;
    }
    public static setDataToSave(key:String)
    {
        this.dataToSave.push(key);
    }
    public static getDataToSave(): Object
    {
        //Change this to return elements which are to be saved i.e. only TOs corresponding to dataToSave
        return this.dataPulled;
    }
    public static clearPulledDataCache()//eacj save should clear the cache
    {
        this.dataPulled = {};
    }
}
