import {Directive, ElementRef, Input, Renderer, OnInit,OnDestroy} from '@angular/core';
import {CLAbstractValidator} from './clabstractvalidator.directive';
import {ValidationManager} from './../validationmanager.service';
@Directive({
    selector: '[clsvalidator]',
    //mousover functions will be handy in case you want to display validation message
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
        '(keypress)': 'onKeyPress($event)'
    }
})
export class CLSValidator implements CLAbstractValidator, OnInit, OnDestroy {
    private _nativeel: HTMLElement;
    private _key: string;
    private _isactive: boolean;
    private _validationMessage: string;
//should be unique something like activity-name:component-name:fieldName
    @Input('clsvalidator') _handle: Array<any>;
    constructor(private renderer: Renderer, private el: ElementRef,private valManager:ValidationManager)
    {
        this._nativeel = el.nativeElement;
    }

    onMouseEnter() 
    {
        if (this._isactive)
        {
            this._highlight("red");
            let validationMessage = '<div id="' + this._key + '">' + this._validationMessage + '</div>';
            this.renderer.invokeElementMethod(
                this._nativeel, 'insertAdjacentHTML', ['afterend', validationMessage]);

            //this._nativeel.insertAdjacentText('afterend',validationMessage);
        }
    }
    onMouseLeave() 
    { 
        if(this._isactive)
        {
            if (this._nativeel.nextElementSibling && this._nativeel.nextElementSibling.id == this._key)
            {
                this._nativeel.nextElementSibling.remove();
            }
        }    
        
    }
    onKeyPress(event:any)
    {
        console.log(event, event.keyCode, event.keyIdentifier); 
    }

    ngOnInit()
    {
        //TODO - register yourself with validator framework
        this._key = this.getKey();
        if (this._key)
        {
            this.valManager.registerValidator(this._key, this);
        }
    }

    validationFocus() 
    {
        this.renderer.invokeElementMethod(
            this._nativeel, 'focus', []);
    }
    private _highlight(color: string) 
    {
        if (this._isactive)
        {
            this._nativeel.style.backgroundColor = color;
        }
    }
    respondToValidation()
    {
        this.activate();
        this._highlight('red');
    }
    activate()
    {
        this._isactive = true;
    }
    deactivate()
    {
        this._highlight(null);
        this._isactive = false;
    }
    respondToClick()
    {

    }
    isActive()
    {
        return this._isactive;
    }
    ngOnDestroy()
    {
        //TODO unregister yourself with validator framework
        this.deactivate();
        this.valManager.unregisterValidator(this._key);
    }
    //create a key with following info fully qualified <toClassName>:<toID>:<toFieldName>
    private getKey():string
    {
        var to = this._handle[0];
        var fieldName = this._handle[1];
        //if (to && to['id'])
        if (to)//TODO for testing ignore id
        {
            return to['__clazz_Name'] + ':' + to['id'] + ':' +fieldName;
        }
        console.debug('Error: invalid argument',to);
    }
    setValidationMessage(valMessage:string):void
    {
        this._validationMessage = valMessage;
    }

}