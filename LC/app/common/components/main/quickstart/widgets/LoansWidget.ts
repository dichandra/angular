import {View, Component, NgFor, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import {ChoiceModel} from '../../models/ChoiceModel';
import {LoanListModel} from '../../models/LoanListModel';
import {LoanListRenderer} from '../../renderers/LoanListRenderer';

@Component({
    selector: 'loans-widget'

})
@View({
    directives: [NgFor, FORM_DIRECTIVES, CORE_DIRECTIVES, LoanListRenderer],
    template: `

    <div class="panel widgetContainer">

    <div class="panel-heading">

      <div class="col-md-2">
        <h4>Loans</h4>
      </div>
      <div class="col-md-6">
        <form >
          <div class="form-group form-horizontal">
            <select id="cbChoices" class="form-control" [(ngModel)]="model.choice" ngControl="choice">
              <option *ngFor="#choice of choices" [value]="choice">{{choice}}</option>
            </select>
          </div>
        </form>
      </div>
      <div class="col-md-4 pull-right">
        <div class="col-xs-1"><img src="./assets/icons/componentIcon1.png"></div>
        <div class="col-xs-1"><img src="./assets/icons/componentIcon2.png"></div>
        <div class="col-xs-1"><img src="./assets/icons/componentIcon3.png"></div>
        <div class="col-xs-1"><img src="./assets/icons/componentIcon4.png"></div>
        <div class="col-xs-1"><img src="./assets/icons/componentIcon5.png"></div>
      </div>
    </div>
    <br>
    <hr>
    <div class="panel-body col-md-12">
      <loan-list-renderer
      *ngFor="#loan of loans"
      [model]="loan"
      (click)="selectLoan(loan)">

      </loan-list-renderer>
    </div>
</div>

    `
})


export class LoansWidget {

    choices = ['All Loans - Property Ordered', 'All Loans', 'Property Ordered', 'Weather Changer'];
    model = new ChoiceModel(15, 'Kenny', this.choices[0]);

    loans = [
        new LoanListModel(10001101317, 'John Smith', '$100,000', './assets/icons/iconStatus1.png'),
        new LoanListModel(10001101405, 'Jane Jones', '$200,000', './assets/icons/iconStatus2.png'),
        new LoanListModel(10001101500, 'Jim Johnson', '$300,000', './assets/icons/iconStatus3.png')
    ]

    constructor(){}

    selectLoan(selModel){
        console.log(selModel.name);
    }

}
