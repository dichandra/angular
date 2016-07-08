import { Component, Input } from '@angular/core';
import { ActivityPanel } from './ActivityPanel';

@Component({
  selector: 'activity-group',
  templateUrl: './app/common/components/ui/loansubapp/viewrenderer/lap/ActivityGroupPanel.html',
  styleUrls:  ['./app/common/components/ui/loansubapp/viewrenderer/lap/ActivityGroupPanel.css'],
  directives: [ActivityPanel],
})
export class ActivityGroupPanel {
  @Input() activityGroup: Object;

  constructor() {  }

}
