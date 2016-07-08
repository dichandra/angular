///<reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import {RouteRegistry, AsyncRoute} from '@angular/router-deprecated';
import {Injectable, Type, ComponentResolver, ViewContainerRef} from '@angular/core';

/*
* Route util class for dynamically adding route configuraitons
* to existing components at run time. 
*/
export class CommonUtils
{
	public static getToClass(to)
	{
		// in case of stubs/root array, the classname we are interested in is available
		// as classname/rootclassname, for rest of the TOs __clazz_Name is required
		if (to.hasOwnProperty("className"))
		{
			return to.className;
		}
                else if(to.hasOwnProperty("rootClassName"))
                {
                    return to.rootClassName;
                }
		else
		{
                    return to.__clazz_Name;
		}
	}
	public static getToClassForProp(to:any,propName:string) 
	{
		if(to[propName])
		{
			return CommonUtils.getToClass(to[propName]);
		}
		else
		{
			//log error
			console.error(propName+" is not an attribute of "+CommonUtils.getToClass(to),to);
		}
	}
	public static getTo(to:any,propName:string)
	{
		if (to[propName]) 
		{
			return to[propName];
		}
		else 
		{
			//log error
			console.error(propName + " is not an attribute of " + CommonUtils.getToClass(to),to);
		}
	}
}
