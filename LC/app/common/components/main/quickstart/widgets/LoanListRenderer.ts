import {View, Component, Input} from '@angular/core';
import {LoanListModel} from "./LoanListModel";

@Component({
    selector: 'loan-list-renderer',
    template: `
    <style>
        .divider{
            position:absolute;
            left:50%;
            top:20%;
            bottom:20%;
            border-left:1px solid black;
        }
    </style>
        <div class="container-fluid">
            <div class="row">
               {{model.name}}
            </div>

            <div class="row">
                <div class="col-md-8">
                    <div class="col-md-6">
                        {{model.id}}
                    </div>
                    <div class="col-md-3 divider"></div>
                    <div class="col-md-4 col-sm-offset-1">
                        {{model.price}}
                    </div>
                </div>
                <div class="col-md-4"><img src="{{model.status}}"></div>
            </div>

        </div>
    `
})
export class LoanListRenderer {
    @Input() model:LoanListModel;

}
