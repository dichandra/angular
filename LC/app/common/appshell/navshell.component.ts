import {Component,Input, OnInit,Type,OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
@Component({
  selector: 'nav-shell',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/common/appshell/navshell.component.html'
})
export class NavShell implements OnInit, OnDestroy
{
  @Input()apps: NavApp[];

  ngOnInit()
  {
  }
  ngOnDestroy() 
  {
    //Placeholder for now, must implement cleanup code.
  }
}
export interface NavApp
{
  path: string;
  name: string;
  image: string;
  routerName: string;
  useAsDefault: boolean;
  compFile: string;
  component: string;
  headerComp: string;
}