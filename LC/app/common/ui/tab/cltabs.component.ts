import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Tab } from './cltab.component';
@Component({
  selector: 'tabs',
  template: `
    <ul class="nav nav-tabs">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class Tabs implements AfterContentInit {

  @ContentChildren('cltab') tabs: QueryList<Tab>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: Tab) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tabi => {
      if (tabi !== tab) {
        tabi.active = false;
        tabi.tabDeactivated();
      }
    });

    // activate the tab the user has clicked on.
    tab.active = true;
    tab.tabActivated();

  }

}
