import { Component, Input } from '@angular/core';
import { ResponsibilityPanel } from './ResponsibilityPanel';


@Component({
  selector: 'lap',
  // template: `
  //   <div>
  //     This is an inline test....
  //   </div>
  // `,
  // styles: ['div {border-radius: 8px; border-style: solid; border-width: 1px; width: 800px; }'],
  templateUrl: './app/common/components/ui/loansubapp/viewrenderer/lap/LoanActivityPanel.html',
  styleUrls:  ['./app/common/components/ui/loansubapp/viewrenderer/lap/LoanActivityPanel.css'],
  directives: [ResponsibilityPanel],
})

export class LoanActivityPanel {

  @Input() responsibilityContextTOs: any;

  constructor() {
  }

}
