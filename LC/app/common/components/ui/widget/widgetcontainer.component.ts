import {Component,Input,Type,OnInit,OnDestroy,ViewChild,ViewContainerRef,ComponentRef,ComponentResolver,AfterViewInit} from '@angular/core';
import {RouteUtil} from './../../../util/routeutil.service';

@Component({selector:'clwidget',
	templateUrl: 'app/common/components/ui/widget/widgetcontainer.component.html'
			})
export class WidgetContainer implements OnInit, OnDestroy,AfterViewInit
{
	@Input() widgetComp: WidgetDef;
	@ViewChild('widgetheader', { read: ViewContainerRef }) header: ViewContainerRef;
	@ViewChild('widgetbody', { read: ViewContainerRef }) body: ViewContainerRef;

	constructor(private cr: ComponentResolver, private routeUtil: RouteUtil ) { }
	ngOnInit()
	{
	}
	ngOnDestroy() 
	{

	}
	ngAfterViewInit()
	{
		//Load widget components into respective locations
		this.routeUtil.loadComponent(this.widgetComp.compFile, this.widgetComp.headerComp, this.cr,
                this.header, comp => this.updateHeaderCallback(comp));
		this.routeUtil.loadComponent(this.widgetComp.compFile, this.widgetComp.component , this.cr,
			this.body, comp => this.updateBodyCallback(comp));
	}
	updateHeaderCallback(comp:ComponentRef<any>)
	{
		console.debug('adding component'+ comp);
	}
	updateBodyCallback(comp: ComponentRef<any>) {
		console.debug('adding component' + comp);
	}
	getWidgetStyle()
	{
		return 'col-md-6';
	}

}
export interface WidgetDef {
	name: string;
	image: string;
	compFile: string;
	component: string;
	headerComp: string;
}