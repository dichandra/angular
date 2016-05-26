import {Injectable} from '@angular/core';
import {AuthUtil} from './../../../common/authutil';
import {NavApp} from './../../../common/appshell/navshell.component';


@Injectable()
export class AppShellUtil
{
	navAppDefs;
	getNavApps(): NavApp[]
	{
        /*
        * Hard-coded the navigation app list for now
        * This should come from servers side, based on 
        * logged in user's permission. For users without
        * session (not logged in), this should be empty list 
        * routing to default route
        */


        if (AuthUtil.isAuthenticated()) {
            console.debug('returning authenticated routers');
            let navApps: NavApp[] = [/*{
                path: './home', component: 'UnsecuredHome', name: 'UHome', useAsDefault: true,
                image: 'assets/icons/navIcon1.png', compFile: 'app/common/components/main/unsecuredhome.component'
            },*/
                {
					path: './quickstart', component: 'QuickStart', headerComp: 'QuickStartHeader', name: 'QuickStart', useAsDefault: false,
					compFile: 'app/common/components/main/quickstart/quickstart.component', image: 'assets/icons/navIcon2.png'
				},
				{
					path: './addressbook', component: 'AddressBook', headerComp: 'AddrBookHeader', name: 'AddressBook', useAsDefault: false,
					compFile: 'app/common/components/main/addrbook/addrbook.component', image: 'assets/icons/navIcon3.png'
				}

            ];
            this.navAppDefs = navApps;
            return navApps;
        }
        else {
            console.debug('returning unauthenticated routers');
            return [];
        }

    }
    getNavApp(navApp:string):NavApp
    {
		let navAppReturn;
		if (this.navAppDefs)
		{
			for (var j = 0; j < this.navAppDefs.length; j++) 
			{
				if (this.navAppDefs[j].component === navApp) 
				{
					return this.navAppDefs[j];
				}

			}
    	}
    }
}
