"use strict";(self.webpackChunkloadgistix=self.webpackChunkloadgistix||[]).push([[917],{2917:(E,c,e)=>{e.r(c),e.d(c,{AuthSignInModule:()=>R});var u=e(4521),d=e(7423),I=e(7446),m=e(7322),g=e(5245),f=e(7531),h=e(773),v=e(5804),y=e(7775),A=e(7776),a=e(3075),Z=e(8288),t=e(5e3),x=e(8951),C=e(7261),S=e(9122),T=e(9808),w=e(2494);const F=["signInNgForm"];function J(n,r){if(1&n&&(t.TgZ(0,"fuse-alert",20),t._uU(1),t.qZA()),2&n){const o=t.oxw();t.Q6J("appearance","outline")("showIcon",!1)("type",o.alert.type)("@shake","error"===o.alert.type),t.xp6(1),t.hij(" ",o.alert.message," ")}}function N(n,r){1&n&&(t.TgZ(0,"mat-error"),t._uU(1," Email address is required "),t.qZA())}function b(n,r){1&n&&(t.TgZ(0,"mat-error"),t._uU(1," Please enter a valid email address "),t.qZA())}function Q(n,r){1&n&&t._UZ(0,"mat-icon",21),2&n&&t.Q6J("svgIcon","heroicons_solid:eye")}function U(n,r){1&n&&t._UZ(0,"mat-icon",21),2&n&&t.Q6J("svgIcon","heroicons_solid:eye-off")}function Y(n,r){1&n&&(t.TgZ(0,"span"),t._uU(1," Sign in "),t.qZA())}function M(n,r){1&n&&t._UZ(0,"mat-progress-spinner",22),2&n&&t.Q6J("diameter",24)("mode","indeterminate")}const k=function(){return["/sign-up"]},q=function(){return["/forgot-password"]},L=[{path:"",component:(()=>{class n{constructor(o,i,s,l,p,B){this._activatedRoute=o,this._authService=i,this._formBuilder=s,this._snackBar=l,this._router=p,this._fuseNavigationService=B,this.alert={type:"success",message:""},this.showAlert=!1}ngOnInit(){this.signInForm=this._formBuilder.group({email:["",[a.kI.required,a.kI.email]],password:["",a.kI.required],rememberMe:[""]})}signIn(){this.signInForm.invalid||(this.signInForm.disable(),this.showAlert=!1,this._authService.signIn(this.signInForm.value).subscribe(()=>{const o=this._activatedRoute.snapshot.queryParamMap.get("redirectURL")||"/signed-in-redirect";this._router.navigateByUrl(o)},o=>{this.signInForm.enable(),this.signInNgForm.resetForm(),this.alert={type:"error",message:"Wrong email or password"},this.showAlert=!0}))}updateNavigation(){return new Promise(i=>{try{const s=this._fuseNavigationService.getComponent("main");if(!s)return null;s.navigation=[{id:"supported-components",title:"Supported components",subtitle:"Compatible third party components",type:"group",icon:"memory",children:[{id:"supported-components.apex-charts",title:"ApexCharts",type:"basic",icon:"insert_chart",link:"/supported-components/apex-charts"},{id:"supported-components.full-calendar",title:"FullCalendar",type:"basic",icon:"today",link:"/supported-components/full-calendar"},{id:"supported-components.google-maps",title:"Google Maps",type:"basic",icon:"map",link:"/supported-components/google-maps"},{id:"supported-components.ngx-markdown",title:"ngx-markdown",type:"basic",icon:"text_format",link:"/supported-components/ngx-markdown"},{id:"supported-components.quill-editor",title:"Quill editor",type:"basic",icon:"font_download",link:"/supported-components/quill-editor"},{id:"supported-components.youtube-player",title:"Youtube player",type:"basic",icon:"play_circle_filled",link:"/supported-components/youtube-player"}]}],s.refresh()}catch(s){i(!1)}})}}return n.\u0275fac=function(o){return new(o||n)(t.Y36(u.gz),t.Y36(x.e),t.Y36(a.qu),t.Y36(C.ux),t.Y36(u.F0),t.Y36(S.Jf))},n.\u0275cmp=t.Xpm({type:n,selectors:[["auth-sign-in"]],viewQuery:function(o,i){if(1&o&&t.Gf(F,5),2&o){let s;t.iGM(s=t.CRH())&&(i.signInNgForm=s.first)}},decls:32,vars:16,consts:[[1,"flex","flex-col","flex-auto","items-center","sm:justify-center","min-w-0"],[1,"w-full","sm:w-auto","py-8","px-4","sm:p-12","sm:rounded-2xl","sm:shadow","sm:bg-card"],[1,"w-full","max-w-80","sm:w-80","mx-auto","sm:mx-0"],[1,"w-100-p"],["src","assets/images/logo/loadgistix.png"],["class","mt-8 -mb-4",3,"appearance","showIcon","type",4,"ngIf"],[1,"mt-8",3,"formGroup"],["signInNgForm","ngForm"],[1,"w-full"],["id","email","matInput","",3,"formControlName"],[4,"ngIf"],["id","password","matInput","","type","password",3,"formControlName"],["passwordField",""],["mat-icon-button","","type","button","matSuffix","",3,"click"],["class","icon-size-5",3,"svgIcon",4,"ngIf"],[1,"inline-flex","items-end","justify-between","w-full","mt-1.5"],[1,"ml-1","text-primary-500","hover:underline",3,"routerLink"],[1,"text-md","font-medium","text-primary-500","hover:underline",3,"routerLink"],["mat-flat-button","",1,"fuse-mat-button-large","w-full","mt-6",3,"color","disabled","click"],[3,"diameter","mode",4,"ngIf"],[1,"mt-8","-mb-4",3,"appearance","showIcon","type"],[1,"icon-size-5",3,"svgIcon"],[3,"diameter","mode"]],template:function(o,i){if(1&o){const s=t.EpF();t.TgZ(0,"div",0),t.TgZ(1,"div",1),t.TgZ(2,"div",2),t.TgZ(3,"div",3),t._UZ(4,"img",4),t.qZA(),t.YNc(5,J,2,5,"fuse-alert",5),t.TgZ(6,"form",6,7),t.TgZ(8,"mat-form-field",8),t.TgZ(9,"mat-label"),t._uU(10,"Email address"),t.qZA(),t._UZ(11,"input",9),t.YNc(12,N,2,0,"mat-error",10),t.YNc(13,b,2,0,"mat-error",10),t.qZA(),t.TgZ(14,"mat-form-field",8),t.TgZ(15,"mat-label"),t._uU(16,"Password"),t.qZA(),t._UZ(17,"input",11,12),t.TgZ(19,"button",13),t.NdJ("click",function(){t.CHM(s);const p=t.MAs(18);return p.type="password"===p.type?"text":"password"}),t.YNc(20,Q,1,1,"mat-icon",14),t.YNc(21,U,1,1,"mat-icon",14),t.qZA(),t.TgZ(22,"mat-error"),t._uU(23," Password is required "),t.qZA(),t.qZA(),t.TgZ(24,"div",15),t.TgZ(25,"a",16),t._uU(26,"Sign up "),t.qZA(),t.TgZ(27,"a",17),t._uU(28,"Forgot password? "),t.qZA(),t.qZA(),t.TgZ(29,"button",18),t.NdJ("click",function(){return i.signIn()}),t.YNc(30,Y,2,0,"span",10),t.YNc(31,M,1,2,"mat-progress-spinner",19),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA()}if(2&o){const s=t.MAs(18);t.xp6(5),t.Q6J("ngIf",i.showAlert),t.xp6(1),t.Q6J("formGroup",i.signInForm),t.xp6(5),t.Q6J("formControlName","email"),t.xp6(1),t.Q6J("ngIf",i.signInForm.get("email").hasError("required")),t.xp6(1),t.Q6J("ngIf",i.signInForm.get("email").hasError("email")),t.xp6(4),t.Q6J("formControlName","password"),t.xp6(3),t.Q6J("ngIf","password"===s.type),t.xp6(1),t.Q6J("ngIf","text"===s.type),t.xp6(4),t.Q6J("routerLink",t.DdM(14,k)),t.xp6(2),t.Q6J("routerLink",t.DdM(15,q)),t.xp6(2),t.Q6J("color","primary")("disabled",i.signInForm.disabled),t.xp6(1),t.Q6J("ngIf",!i.signInForm.disabled),t.xp6(1),t.Q6J("ngIf",i.signInForm.disabled)}},directives:[T.O5,a._Y,a.JL,a.sg,m.KE,m.hX,f.Nt,a.Fj,a.JJ,a.u,d.lW,m.R9,m.TO,u.yS,w.W,g.Hw,h.Ou],encapsulation:2,data:{animation:Z.L}}),n})()}];let R=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[u.Bz.forChild(L),d.ot,I.p9,m.lN,g.Ps,f.c,h.Cq,v.J,y.fC,A.m]]}),n})()}}]);