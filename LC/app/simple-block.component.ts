import { Component} from 'angular2/core';
@Component({
    selector: 'dt2-simple-block',
    properties: ["_key","_value"],
    template: `<label>{{key}}</label>:<input [(ngModel)]="value" placeholder="key"`,
   /* template: ` <div> <label> {{key}} </label>
                    <input [(ngModel)]=values[key] placeholder="key"/>;
                </div>      `,*/
    directives: []
})
export class SimpleBlock {

    constructor() {
    }
    _key:String='test';
    _value:Object='';
    set key(value:String) {
        this._key = value;
    }

    set value(value:Object) {
        this._value = value;
    }
}