import { Component, Input,OnInit,OnDestroy } from '@angular/core';

@Component({
  selector: 'tab',
  styles: [`
    .pane{
      padding: 1em;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab implements OnInit,OnDestroy{
  @Input('tabTitle') title: string;
  @Input() active = false;
  ngOnInit()
  {
    console.debug('Tab Init '+this.title);
  }
  ngOnDestroy() 
  {
    console.debug('Tab Destroy '+this.title);
  }
  tabActivated(): void
  {
    console.debug('Following tab is activated: ' + this.title);
  }
  tabDeactivated(): void
  {
    console.debug('Following tab is deactivated: ' + this.title);
  }
}