///<reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import {RouteRegistry, AsyncRoute} from '@angular/router-deprecated';
import {Injectable, Type, ComponentResolver, ViewContainerRef} from '@angular/core';

@Injectable()
/*
* Route util class for dynamically adding route configuraitons
* to existing components at run time. 
*/
export class RouteUtil {
	constructor(private registry: RouteRegistry)
	{}
	// Gets the list of registered with @RouteConfig routes
	// associated with given `component`
	getRoutes(component: Type) 
	{
		let routeConfig = Reflect.getMetadata('annotations', component);
		return Reflect.getMetadata('annotations', component)
			.filter(a => {
				return a.constructor.name === 'RouteConfigAnnotation';
			}).pop();
	}
	// Updates the metadata added by @RouteConfig associated
	// with given `component`
	updateRouteConfig(component: Type, routeConfig)
	{
		let annotations = Reflect.getMetadata('annotations', component);
		let routeConfigIndex = -1;
		for (let i = 0; i < annotations.length; i += 1) 
		{
			if (annotations[i].constructor.name === 'RouteConfigAnnotation') {
				routeConfigIndex = i;
				break;
			}
		}
		if (routeConfigIndex < 0)
		{
			throw new Error('No route metadata attached to the component');
		}
		annotations[routeConfigIndex] = routeConfig;
		Reflect.defineMetadata('annotations', annotations, component);
	}
	// Adds additional `route` to given `component`
	addRoute(component: Type, route)
	{
		let routeConfig = this.getRoutes(component);
		routeConfig.configs.push(route);
		this.updateRouteConfig(component, routeConfig);
		this.registry.config(component, route);
	}
	createAsyncRoute(routeDef:any):AsyncRoute
	{
		return new AsyncRoute({
			path: routeDef.path,
			loader: () => this.getComponent(routeDef.compFile, routeDef.component),
			name: routeDef.name
		});
	}
	getComponent(compFile:string,compName:string):any
	{
		return System.import(compFile).then(file => eval('file.' + compName));
	}
	loadComponent(compFile: string, compName: string, cr: ComponentResolver, vcr: ViewContainerRef, callback: Function) 
	{
        System.import(compFile)
            .then(m => {
				cr.resolveComponent(eval('m.' + compName)).then(factory => {
					callback(vcr.createComponent(factory, 0));
				});
			})
	}
}
