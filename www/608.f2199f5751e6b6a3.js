"use strict";(self.webpackChunkloadgistix=self.webpackChunkloadgistix||[]).push([[608],{1708:(U,u,a)=>{a.d(u,{I:()=>I});var x=a(7445),h=a(2340),e=a(5e3),_=a(8279),y=a(7261),A=a(6407),t=a(8951),T=a(4521),v=a(9808),p=a(9224);function D(s,g){if(1&s&&e._UZ(0,"img",7),2&s){const o=e.oxw().$implicit,l=e.oxw(2);e.Q6J("src",l.imagesFolder+"Adverts/"+o.id+o.avatar+"?t="+l.timestamp,e.LSH)}}function w(s,g){if(1&s&&(e.TgZ(0,"mat-card",3),e.TgZ(1,"mat-card-title-group"),e.TgZ(2,"mat-card-title",4),e._uU(3),e.qZA(),e.TgZ(4,"mat-card-subtitle"),e._uU(5),e.qZA(),e.YNc(6,D,1,1,"img",5),e.qZA(),e.TgZ(7,"mat-card-content"),e._uU(8),e._UZ(9,"br"),e._UZ(10,"br"),e.TgZ(11,"a",6),e._uU(12),e.qZA(),e.qZA(),e.qZA()),2&s){const o=g.$implicit;e.xp6(3),e.Oqu(o.title),e.xp6(2),e.Oqu(o.subTitle),e.xp6(1),e.Q6J("ngIf",o.avatar),e.xp6(2),e.hij(" ",o.content,""),e.xp6(3),e.Q6J("href",o.link,e.LSH),e.xp6(1),e.Oqu(o.link)}}function b(s,g){if(1&s&&(e.ynx(0),e.YNc(1,w,13,6,"mat-card",2),e.BQk()),2&s){const o=e.oxw();e.xp6(1),e.Q6J("ngForOf",o.advertItems)}}function S(s,g){1&s&&(e.TgZ(0,"mat-card",3),e.TgZ(1,"mat-card-title-group"),e.TgZ(2,"mat-card-title",4),e._uU(3,"Loadgistix"),e.qZA(),e.TgZ(4,"mat-card-subtitle"),e._uU(5,"Get more"),e.qZA(),e._UZ(6,"img",8),e.qZA(),e.TgZ(7,"mat-card-content"),e._uU(8," Contact us today - we will show you how to get the best out of Loadgistix! "),e.qZA(),e.qZA())}let I=(()=>{class s{constructor(o,l,d,f,O){this.apiService=o,this._snackBar=l,this.variableService=d,this.authService=f,this._router=O,this.timestamp=0,this.imagesFolder=h.N.api+"Images/",this.loading=!0,this.advertItems=[],this.timestamp=(new Date).getTime()}ngOnInit(){this.getAdverts().then(l=>{this.advertItems=l});const o=(0,x.F)(6e5);this.subscription=o.subscribe(l=>{this.authService.check().subscribe(d=>{d&&this.getAdverts().then(f=>{this.advertItems=f,this.timestamp=(new Date).getTime()})})})}getAdverts(){return new Promise(l=>{try{this.apiService.post("adverts","available",null).subscribe({next:d=>{1==d.result?l(d.data):"Expired"==d.message?this._router.navigate(["/sign-out"]):this._snackBar.open("Error: "+d.message,null,{duration:2e3})},error:d=>{console.log(d),this._snackBar.open("Error: "+d,null,{duration:2e3})},complete:()=>{}})}catch(d){l([])}})}}return s.\u0275fac=function(o){return new(o||s)(e.Y36(_.s),e.Y36(y.ux),e.Y36(A.S),e.Y36(t.e),e.Y36(T.F0))},s.\u0275cmp=e.Xpm({type:s,selectors:[["advert"]],decls:2,vars:2,consts:[[4,"ngIf"],["class","flex flex-col flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden","style","margin-bottom: 12px;",4,"ngIf"],["class","flex flex-col flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden","style","margin-bottom: 12px;",4,"ngFor","ngForOf"],[1,"flex","flex-col","flex-auto","p-6","bg-card","shadow","rounded-2xl","overflow-hidden",2,"margin-bottom","12px"],[2,"font-size","18px"],["mat-card-sm-image","",3,"src",4,"ngIf"],["target","_blank",3,"href"],["mat-card-sm-image","",3,"src"],["mat-card-sm-image","","src","assets/images/no-image.jpg"]],template:function(o,l){1&o&&(e.YNc(0,b,2,1,"ng-container",0),e.YNc(1,S,9,0,"mat-card",1)),2&o&&(e.Q6J("ngIf",l.advertItems.length>0),e.xp6(1),e.Q6J("ngIf",0===l.advertItems.length))},directives:[v.O5,v.sg,p.a8,p.C1,p.n5,p.$j,p.dn,p.vP],styles:[".mat-card-sm-image[_ngcontent-%COMP%]{max-width:120px;max-height:120px;width:auto;height:auto}"]}),s})()},1608:(U,u,a)=>{a.r(u),a.d(u,{DirectoryDetailsOpenModule:()=>Y});var x=a(4521),h=a(8966),e=a(7579),_=a(2722),y=a(7588),A=a(2340),t=a(5e3),T=a(3075),v=a(8279),p=a(7261),D=a(6407),w=a(9122),b=a(6362),S=a(4880),I=a(7455),s=a(9808),g=a(1708),o=a(8553),l=a(9224),d=a(7093);function f(n,m){if(1&n&&(t.ynx(0),t.TgZ(1,"div",25),t._uU(2),t.qZA(),t.BQk()),2&n){const i=t.oxw();t.xp6(2),t.hij(" ",i.directoryCategoryDescription,"")}}function O(n,m){if(1&n){const i=t.EpF();t.TgZ(0,"app-map",26),t.NdJ("select",function(c){return t.CHM(i),t.oxw().showItem(c)}),t.qZA()}if(2&n){const i=t.oxw();t.Q6J("directoryList",i.directoryItems)}}function C(n,m){if(1&n&&t._UZ(0,"img",47),2&n){const i=t.oxw().$implicit,r=t.oxw();t.Q6J("src",r.imagesFolder+"Directories/"+i.id+i.avatar+"?t="+r.timestamp,t.LSH)}}function L(n,m){1&n&&t._UZ(0,"img",48)}function E(n,m){if(1&n&&(t.TgZ(0,"mat-card",27),t.TgZ(1,"mat-card-content"),t.TgZ(2,"div",28),t.YNc(3,C,1,1,"img",29),t.YNc(4,L,1,0,"img",30),t.TgZ(5,"div",31),t.TgZ(6,"div",28),t.TgZ(7,"h2",32),t._uU(8),t.qZA(),t.qZA(),t.TgZ(9,"div",33),t.TgZ(10,"span",34),t._UZ(11,"img",35),t.TgZ(12,"span"),t._uU(13),t.qZA(),t.qZA(),t.qZA(),t.TgZ(14,"div",36),t.TgZ(15,"span",34),t._UZ(16,"img",37),t.TgZ(17,"a",38),t._uU(18),t.qZA(),t.qZA(),t.TgZ(19,"span",34),t._UZ(20,"img",39),t.TgZ(21,"a",38),t._uU(22),t.qZA(),t.qZA(),t.TgZ(23,"span",34),t._UZ(24,"img",40),t.TgZ(25,"a",41),t._uU(26),t.qZA(),t.qZA(),t.qZA(),t.TgZ(27,"div",42),t.TgZ(28,"span",34),t._UZ(29,"img",43),t.TgZ(30,"a",41),t._uU(31),t.qZA(),t.qZA(),t.TgZ(32,"span",34),t._UZ(33,"img",44),t.TgZ(34,"a",41),t._uU(35),t.qZA(),t.qZA(),t.TgZ(36,"span",34),t._UZ(37,"img",45),t.TgZ(38,"a",41),t._uU(39),t.qZA(),t.qZA(),t.qZA(),t.TgZ(40,"p",46),t._uU(41),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA()),2&n){const i=m.$implicit,r=t.oxw();t.xp6(3),t.Q6J("ngIf",r.screenSize>800&&i.avatar),t.xp6(1),t.Q6J("ngIf",r.screenSize>800&&!i.avatar),t.xp6(4),t.hij(" ",i.companyName,""),t.xp6(5),t.Oqu(r.getAddressSubstring(i.addressLabel,",")),t.xp6(4),t.MGl("href","tel:",i.phone,"",t.LSH),t.xp6(1),t.hij("",i.phone," "),t.xp6(3),t.MGl("href","mailto:",i.email,"",t.LSH),t.xp6(1),t.Oqu(i.email),t.xp6(3),t.Q6J("href","http"===i.website.substring(0,4)?i.website:"https://"+i.website,t.LSH),t.xp6(1),t.Oqu(i.website),t.xp6(4),t.Q6J("href",i.facebook,t.LSH),t.xp6(1),t.Oqu(i.facebook.replace("https://www.facebook.com/","")),t.xp6(3),t.Q6J("href",i.twitter,t.LSH),t.xp6(1),t.Oqu(i.twitter.replace("https://twitter.com/","")),t.xp6(3),t.Q6J("href",i.instagram,t.LSH),t.xp6(1),t.Oqu(i.instagram.replace("https://twitter.com/","")),t.xp6(2),t.hij(" ",i.description," ")}}let q=(()=>{class n{constructor(i,r,c,Z,B,F,J,Q,N,z){this.route=i,this.dialog=r,this._formBuilder=c,this.apiService=Z,this._snackBar=B,this.variableService=F,this._router=J,this._fuseNavigationService=Q,this.fuseSplashScreenService=N,this._fuseMediaWatcherService=z,this.timestamp=0,this.imagesFolder=A.N.api+"Images/",this.loading=!0,this.directoryItems=[],this._unsubscribeAll=new e.x,this.screenSize=window.innerWidth,this.directoryCategoryDescription="",this.userId=localStorage.getItem("userId"),this.navigation=[{id:"home",title:"Home",type:"basic",icon:"heroicons_outline:home",link:"/home"},{id:"business-directory",title:"Business Directory",type:"basic",icon:"heroicons_outline:chart-pie",link:"/business-directory"}],this.timestamp=(new Date).getTime(),this.fuseSplashScreenService.show(),this.loading=!0}getScreenSize(i){this.screenSize=window.innerWidth}get currentYear(){return(new Date).getFullYear()}ngOnInit(){this.route.queryParams.subscribe(i=>{this.id=i.id,this.id&&this.getDirectories().then(r=>{r.length>0?(this.directoryItems=r,this.directoryCategoryDescription=this.directoryItems[0].directoryCategoryDescription,this.variableService.setPageSelected("Directory Details"),this.fuseSplashScreenService.hide(),this.loading=!1):this._router.navigate(["/business-directory"])})}),this._fuseMediaWatcherService.onMediaChange$.pipe((0,_.R)(this._unsubscribeAll)).subscribe(({matchingAliases:i})=>{this.isScreenSmall=!i.includes("md")})}toggleNavigation(i){const r=this._fuseNavigationService.getComponent(i);r&&r.toggle()}getDirectories(){return new Promise(r=>{try{this.apiService.post("directories","category",this.id).subscribe({next:c=>{1==c.result?r(c.data):"Expired"==c.message?this._router.navigate(["/sign-out"]):(this._snackBar.open("Error: "+c.message,null,{duration:2e3}),this.fuseSplashScreenService.hide(),this.loading=!1)},error:c=>{console.log(c),this._snackBar.open("Error: "+c,null,{duration:2e3}),this.fuseSplashScreenService.hide(),this.loading=!1},complete:()=>{}})}catch(c){r([])}})}showItem(i){const r=new h.vA;r.data={directoryItem:i},r.autoFocus=!0,r.disableClose=!0,r.hasBackdrop=!0,r.ariaLabel="fffff",r.width="800px",this.dialog.open(y.I,r)}getAddressSubstring(i,r){let c=i.split(r);return c.length>1?c[0]+","+c[1]:i}}return n.\u0275fac=function(i){return new(i||n)(t.Y36(x.gz),t.Y36(h.uw),t.Y36(T.qu),t.Y36(v.s),t.Y36(p.ux),t.Y36(D.S),t.Y36(x.F0),t.Y36(w.Jf),t.Y36(b.j),t.Y36(S.T))},n.\u0275cmp=t.Xpm({type:n,selectors:[["directoryDetails"]],hostBindings:function(i,r){1&i&&t.NdJ("resize",function(Z){return r.getScreenSize(Z)},!1,t.Jf7)},decls:29,vars:3,consts:[[1,"flex","flex-col","flex-auto","w-full","min-w-0"],[1,"relative","flex","flex-0","items-center","w-full","h-16","sm:h-20","px-4","md:px-6","z-49","shadow","dark:shadow-none","dark:border-b","bg-card","dark:bg-transparent","print:hidden"],[1,"flex","items-center","mx-2","lg:mr-8"],[1,"hidden","lg:flex"],["src","assets/images/logo/logo.png",1,"dark:hidden","w-14"],["src","assets/images/logo/logo-text-on-dark.png",1,"hidden","dark:flex","w-24"],["src","assets/images/logo/logo.png",1,"flex","lg:hidden","w-12"],[1,"text-secondary","text-2xl","md:text-3xl","font-extrabold","tracking-tight","leading-7","sm:leading-10","ml-4"],[1,"relative","flex","flex-col","flex-auto","min-w-0","overflow-hidden"],[1,"flex","flex-col","flex-auto","min-w-0"],[1,"bg-card"],[1,"flex","flex-col","w-full","max-w-screen-xl","mx-auto","px-6","sm:px-8"],[1,"flex","flex-col","sm:flex-row","flex-auto","sm:items-center","min-w-0","my-2","sm:my-2"],[1,"flex","flex-auto","items-center","min-w-0"],[1,"flex","flex-col","min-w-0","ml-4"],[4,"transloco"],["fusePerfectScrollbar","",1,"page-layout","blank","p-4"],[1,"grid","grid-cols-1","sm:grid-cols-6","gap-6","w-full","min-w-0"],[1,"sm:col-span-4","lg:col-span-4","flex","flex-col","flex-auto","p-6","overflow-hidden",2,"padding","0!important"],[1,"table-container","bg-card","shadow","rounded-2xl"],[3,"directoryList","select",4,"ngIf"],["class","flex flex-col flex-auto p-6 bg-card shadow rounded-2xl overflow-hiddenmat-elevation-z5","style","padding: 4px!important;margin-bottom: 12px;",4,"ngFor","ngForOf"],[1,"sm:col-span-2","lg:col-span-2","flex","flex-col","flex-auto","p-6","overflow-hidden",2,"padding","0!important"],[1,"relative","flex","flex-0","items-center","w-full","h-14","sm:h-20","px-4","md:px-6","z-49","border-t","bg-card","dark:bg-transparent","print:hidden"],[1,"font-medium","text-secondary"],[1,"text-2xl","md:text-5xl","font-semibold","tracking-tight","leading-7","md:leading-snug","truncate"],[3,"directoryList","select"],[1,"flex","flex-col","flex-auto","p-6","bg-card","shadow","rounded-2xl","overflow-hiddenmat-elevation-z5",2,"padding","4px!important","margin-bottom","12px"],["fxFlex","","fxLayout","row wrap"],["mat-card-md-image","",3,"src",4,"ngIf"],["mat-card-md-image","","src","assets/images/no-image.jpg",4,"ngIf"],["fxFlex","","fxLayout","column"],[1,"text-secondary","text-xl","md:text-2xl","font-extrabold","tracking-tight","leading-7","sm:leading-10","truncate"],["fxFlex","","fxLayout","column","fxLayout.gt-sm","row wrap",2,"margin-bottom","4px"],["fxFlex","","fxLayout","row"],["src","assets/icons/location.png","alt","",1,"image-icon"],["fxFlex","","fxLayout","column","fxLayout.gt-xs","row wrap","fxLayoutAlign"," start","fxLayoutAlign.gt-sm","space-around center",2,"margin-bottom","4px"],["src","assets/icons/phone.png","alt","",1,"image-icon"],[1,"directory",3,"href"],["src","assets/icons/email.png","alt","",1,"image-icon"],["src","assets/icons/website.png","alt","",1,"image-icon"],["target","_blank",1,"directory",3,"href"],["fxFlex","","fxLayout","column","fxLayout.gt-sm","row wrap","fxLayoutAlign"," start","fxLayoutAlign.gt-sm","space-around center",2,"margin-bottom","12px"],["src","assets/icons/facebook.png","alt","",1,"image-icon"],["src","assets/icons/twitter.png","alt","",1,"image-icon"],["src","assets/icons/instagram.png","alt","",1,"image-icon"],[1,"directory"],["mat-card-md-image","",3,"src"],["mat-card-md-image","","src","assets/images/no-image.jpg"]],template:function(i,r){1&i&&(t.TgZ(0,"div",0),t.TgZ(1,"div",1),t.TgZ(2,"div",2),t.TgZ(3,"div",3),t._UZ(4,"img",4),t._UZ(5,"img",5),t.qZA(),t._UZ(6,"img",6),t.TgZ(7,"h2",7),t._uU(8," LOADGISTIX "),t.qZA(),t.qZA(),t.qZA(),t.TgZ(9,"div",8),t.TgZ(10,"div",9),t.TgZ(11,"div",10),t.TgZ(12,"div",11),t.TgZ(13,"div",12),t.TgZ(14,"div",13),t.TgZ(15,"div",14),t.YNc(16,f,3,1,"ng-container",15),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(17,"div",16),t.TgZ(18,"div",17),t.TgZ(19,"div",18),t.TgZ(20,"div",19),t.YNc(21,O,1,1,"app-map",20),t.qZA(),t._UZ(22,"br"),t.YNc(23,E,42,17,"mat-card",21),t.qZA(),t.TgZ(24,"div",22),t._UZ(25,"advert"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(26,"div",23),t.TgZ(27,"span",24),t._uU(28),t.qZA(),t.qZA(),t.qZA()),2&i&&(t.xp6(21),t.Q6J("ngIf",r.directoryItems.length>0),t.xp6(2),t.Q6J("ngForOf",r.directoryItems),t.xp6(5),t.hij("Loadgistix \xa9 ",r.currentYear,""))},directives:[I.KI,s.O5,s.sg,g.I,o.G,l.a8,l.dn,d.yH,d.xw,d.Wh,l.nc],styles:[".mat-badge-medium.mat-badge-above .mat-badge-content{top:unset!important;right:-28px!important}.listItem{cursor:pointer}\n"],encapsulation:2}),n})();var M=a(6038);const P=[{path:"",component:q}];let Y=(()=>{class n{}return n.\u0275fac=function(i){return new(i||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[x.Bz.forChild(P),M.m]]}),n})()}}]);