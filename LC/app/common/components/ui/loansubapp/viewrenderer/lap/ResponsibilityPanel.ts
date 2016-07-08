import { Component, ElementRef, Input } from '@angular/core';
import { ActivityGroupPanel } from './ActivityGroupPanel';

@Component({
  selector: 'responsibility',
  templateUrl: './app/common/components/ui/loansubapp/viewrenderer/lap/ResponsibilityPanel.html',
  styleUrls: ['./app/common/components/ui/loansubapp/viewrenderer/lap/ResponsibilityPanel.css'],
  directives: [ActivityGroupPanel],
})
export class ResponsibilityPanel {
  @Input() set responsibility(resp: any) {
    this.resp = resp;
    this.backgroundColor = this.getStateColor(resp.summaryState);
  }
  resp: Object;
  backgroundColor: string;

  //private const STATUS_STARTED_STYLE: String = "responsibilityStartedTitle";
  private static STATUS_STARTED_COLOR: string = "#669900";
  private static STATUS_STARTED: string = "STARTED";

  //private const STATUS_COMPLETE_STYLE: String = "responsibilityCompleteTitle";
  private static STATUS_COMPLETE_COLOR: string = "#669900";
  private static STATUS_COMPLETE: string = "COMPLETE";

  //private const STATUS_ERROR_STYLE: String = "responsibilityErrorTitle";
  private static STATUS_ERROR_COLOR: string = "#FF6600";
  private static STATUS_ERROR: string = "ERROR";

  //private const STATUS_NONE_STYLE: String = "responsibilityNoneTitle";
  private static STATUS_NONE_COLOR: string = "#666666";
  private static STATUS_NONE: string = "NONE";

  constructor(private el: ElementRef) {
  }

  getStateColor(str: string): string {
    let stateColor: string = ResponsibilityPanel.STATUS_NONE_COLOR;
    switch (str) {
      case ResponsibilityPanel.STATUS_STARTED:
        stateColor = ResponsibilityPanel.STATUS_STARTED_COLOR;
        break
      case ResponsibilityPanel.STATUS_COMPLETE:
        stateColor = ResponsibilityPanel.STATUS_COMPLETE_COLOR;
        break;
      case ResponsibilityPanel.STATUS_ERROR:
        stateColor = ResponsibilityPanel.STATUS_ERROR_COLOR;
        break;
    }
    console.debug(stateColor);
    return stateColor;
  }

}
