"use strict";(self.webpackChunkloadgistix=self.webpackChunkloadgistix||[]).push([[75],{1708:(D,h,n)=>{n.d(h,{I:()=>x});var _=n(7445),d=n(2340),t=n(5e3),f=n(8279),v=n(7261),m=n(6407),g=n(8951),u=n(4521),p=n(9808),c=n(9224);function Z(s,e){if(1&s&&t._UZ(0,"img",7),2&s){const r=t.oxw().$implicit,i=t.oxw(2);t.Q6J("src",i.imagesFolder+"Adverts/"+r.id+r.avatar+"?t="+i.timestamp(),t.LSH)}}function C(s,e){if(1&s&&(t.TgZ(0,"mat-card",3),t.TgZ(1,"mat-card-title-group"),t.TgZ(2,"mat-card-title",4),t._uU(3),t.qZA(),t.TgZ(4,"mat-card-subtitle"),t._uU(5),t.qZA(),t.YNc(6,Z,1,1,"img",5),t.qZA(),t.TgZ(7,"mat-card-content"),t._uU(8),t._UZ(9,"br"),t._UZ(10,"br"),t.TgZ(11,"a",6),t._uU(12),t.qZA(),t.qZA(),t.qZA()),2&s){const r=e.$implicit;t.xp6(3),t.Oqu(r.title),t.xp6(2),t.Oqu(r.subTitle),t.xp6(1),t.Q6J("ngIf",r.avatar),t.xp6(2),t.hij(" ",r.content,""),t.xp6(3),t.Q6J("href",r.link,t.LSH),t.xp6(1),t.Oqu(r.link)}}function T(s,e){if(1&s&&(t.ynx(0),t.YNc(1,C,13,6,"mat-card",2),t.BQk()),2&s){const r=t.oxw();t.xp6(1),t.Q6J("ngForOf",r.advertItems)}}function A(s,e){1&s&&(t.TgZ(0,"mat-card",3),t.TgZ(1,"mat-card-title-group"),t.TgZ(2,"mat-card-title",4),t._uU(3,"Loadgistix"),t.qZA(),t.TgZ(4,"mat-card-subtitle"),t._uU(5,"Get more"),t.qZA(),t._UZ(6,"img",8),t.qZA(),t.TgZ(7,"mat-card-content"),t._uU(8," Contact us today - we will show you how to get the best out of Loadgistix! "),t.qZA(),t.qZA())}let x=(()=>{class s{constructor(r,i,a,o,l){this.apiService=r,this._snackBar=i,this.variableService=a,this.authService=o,this._router=l,this.imagesFolder=d.N.api+"Images/",this.loading=!0,this.advertItems=[]}ngOnInit(){this.getAdverts().then(i=>{this.advertItems=i});const r=(0,_.F)(6e5);this.subscription=r.subscribe(i=>{this.authService.check().subscribe(a=>{a&&this.getAdverts().then(o=>{this.advertItems=o})})})}timestamp(){return(new Date).getTime()}getAdverts(){return new Promise(i=>{try{this.apiService.post("adverts","available",null).subscribe({next:a=>{1==a.result?i(a.data):"Expired"==a.message?this._router.navigate(["/sign-out"]):this._snackBar.open("Error: "+a.message,null,{duration:2e3})},error:a=>{console.log(a),this._snackBar.open("Error: "+a,null,{duration:2e3})},complete:()=>{}})}catch(a){i([])}})}}return s.\u0275fac=function(r){return new(r||s)(t.Y36(f.s),t.Y36(v.ux),t.Y36(m.S),t.Y36(g.e),t.Y36(u.F0))},s.\u0275cmp=t.Xpm({type:s,selectors:[["advert"]],decls:2,vars:2,consts:[[4,"ngIf"],["class","flex flex-col flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden","style","margin-bottom: 12px;",4,"ngIf"],["class","flex flex-col flex-auto p-6 bg-card shadow rounded-2xl overflow-hidden","style","margin-bottom: 12px;",4,"ngFor","ngForOf"],[1,"flex","flex-col","flex-auto","p-6","bg-card","shadow","rounded-2xl","overflow-hidden",2,"margin-bottom","12px"],[2,"font-size","18px"],["mat-card-sm-image","",3,"src",4,"ngIf"],["target","_blank",3,"href"],["mat-card-sm-image","",3,"src"],["mat-card-sm-image","","src","assets/images/no-image.jpg"]],template:function(r,i){1&r&&(t.YNc(0,T,2,1,"ng-container",0),t.YNc(1,A,9,0,"mat-card",1)),2&r&&(t.Q6J("ngIf",i.advertItems.length>0),t.xp6(1),t.Q6J("ngIf",0===i.advertItems.length))},directives:[p.O5,p.sg,c.a8,c.C1,c.n5,c.$j,c.dn,c.vP],styles:[".mat-card-sm-image[_ngcontent-%COMP%]{max-width:120px;max-height:120px;width:auto;height:auto}"]}),s})()},3413:(D,h,n)=>{n.d(h,{M:()=>s});var _=n(8966),d=n(8120),t=n(5e3),f=n(8279),v=n(2313),m=n(7093),g=n(3075),u=n(7322),p=n(7531),c=n(9808),Z=n(7423);function C(e,r){if(1&e){const i=t.EpF();t.TgZ(0,"div",4),t.TgZ(1,"mat-form-field",5),t.TgZ(2,"mat-label"),t._uU(3,"VehicleDescription"),t.qZA(),t._UZ(4,"input",16),t.TgZ(5,"mat-star-rating",7),t.NdJ("ratingUpdated",function(o){return t.CHM(i),t.oxw().onRatingChanged("ratingVehicleDescription",o)}),t.qZA(),t.TgZ(6,"mat-error"),t._uU(7,"Rating is required"),t.qZA(),t.qZA(),t.qZA()}if(2&e){const i=t.oxw();t.xp6(5),t.Q6J("rating",i.ratingVehicleDescription)("starCount",5)("color",i.starColorP)}}function T(e,r){if(1&e){const i=t.EpF();t.TgZ(0,"div",4),t.TgZ(1,"mat-form-field",5),t.TgZ(2,"mat-label"),t._uU(3,"LoadDescription"),t.qZA(),t._UZ(4,"input",17),t.TgZ(5,"mat-star-rating",7),t.NdJ("ratingUpdated",function(o){return t.CHM(i),t.oxw().onRatingChanged("ratingLoadDescription",o)}),t.qZA(),t.TgZ(6,"mat-error"),t._uU(7,"Rating is required"),t.qZA(),t.qZA(),t.qZA()}if(2&e){const i=t.oxw();t.xp6(5),t.Q6J("rating",i.ratingLoadDescription)("starCount",5)("color",i.starColorP)}}function A(e,r){if(1&e){const i=t.EpF();t.TgZ(0,"div",4),t.TgZ(1,"mat-form-field",5),t.TgZ(2,"mat-label"),t._uU(3,"Payment"),t.qZA(),t._UZ(4,"input",18),t.TgZ(5,"mat-star-rating",7),t.NdJ("ratingUpdated",function(o){return t.CHM(i),t.oxw().onRatingChanged("ratingPayment",o)}),t.qZA(),t.TgZ(6,"mat-error"),t._uU(7,"Rating is required"),t.qZA(),t.qZA(),t.qZA()}if(2&e){const i=t.oxw();t.xp6(5),t.Q6J("rating",i.ratingPayment)("starCount",5)("color",i.starColorP)}}function x(e,r){if(1&e){const i=t.EpF();t.TgZ(0,"div",4),t.TgZ(1,"mat-form-field",5),t.TgZ(2,"mat-label"),t._uU(3,"Condition"),t.qZA(),t._UZ(4,"input",19),t.TgZ(5,"mat-star-rating",7),t.NdJ("ratingUpdated",function(o){return t.CHM(i),t.oxw().onRatingChanged("ratingCondition",o)}),t.qZA(),t.TgZ(6,"mat-error"),t._uU(7,"Rating is required"),t.qZA(),t.qZA(),t.qZA()}if(2&e){const i=t.oxw();t.xp6(5),t.Q6J("rating",i.ratingCondition)("starCount",5)("color",i.starColorP)}}let s=(()=>{class e{constructor(i,a,o,l,P){this.dialog=i,this.dialogRef=a,this.data=o,this.apiService=l,this.sanitizer=P,this.starColor=d.r.accent,this.starColorP=d.r.primary,this.starColorW=d.r.warn,this.ratingPunctuality=0,this.ratingVehicleDescription=0,this.ratingLoadDescription=0,this.ratingPayment=0,this.ratingCondition=0,this.ratingCare=0,this.ratingAttitude=0,this.hasError=(E,y)=>this.form.controls[E].hasError(y),this.reviewType=o.reviewType,"Driver"===o.reviewType&&(this.reviewDriverRow=o.item),"Load"===o.reviewType&&(this.reviewLoadRow=o.item)}ngOnInit(){this.form=this.data.form,this.ratingPunctuality=this.form.controls.ratingPunctuality.value,this.ratingVehicleDescription=this.form.controls.ratingVehicleDescription.value,this.ratingLoadDescription=this.form.controls.ratingLoadDescription.value,this.ratingPayment=this.form.controls.ratingPayment.value,this.ratingCondition=this.form.controls.ratingCondition.value,this.ratingCare=this.form.controls.ratingCare.value,this.ratingAttitude=this.form.controls.ratingAttitude.value}onRatingChanged(i,a){switch(this.reviewType){case"Driver":switch(i){case"ratingPunctuality":this.ratingPunctuality=a,this.form.controls.ratingPunctuality.setValue(a);break;case"ratingVehicleDescription":this.ratingVehicleDescription=a,this.form.controls.ratingVehicleDescription.setValue(a);break;case"ratingCare":this.ratingCare=a,this.form.controls.ratingCare.setValue(a);break;case"ratingCondition":this.ratingCondition=a,this.form.controls.ratingCondition.setValue(a);break;case"ratingAttitude":this.ratingAttitude=a,this.form.controls.ratingAttitude.setValue(a)}break;case"Load":switch(i){case"ratingPunctuality":this.ratingPunctuality=a,this.form.controls.ratingPunctuality.setValue(a);break;case"ratingLoadDescription":this.ratingLoadDescription=a,this.form.controls.ratingLoadDescription.setValue(a);break;case"ratingPayment":this.ratingPayment=a,this.form.controls.ratingPayment.setValue(a);break;case"ratingCare":this.ratingCare=a,this.form.controls.ratingCare.setValue(a);break;case"ratingAttitude":this.ratingAttitude=a,this.form.controls.ratingAttitude.setValue(a)}}}onNoClick(){this.dialogRef.close(!1)}onYesClick(){this.dialogRef.close(this.form.value)}}return e.\u0275fac=function(i){return new(i||e)(t.Y36(_.uw),t.Y36(_.so),t.Y36(_.WI),t.Y36(f.s),t.Y36(v.H7))},e.\u0275cmp=t.Xpm({type:e,selectors:[["dialog-review"]],decls:38,vars:12,consts:[["mat-dialog-title","",1,"accent","dialog-title","bg-primary","text-on-primary","text-secondary"],["mat-dialog-content","","fxLayout","column"],["fxLayout","column","fxLayoutAlign","start","fxFlex","1 0 auto","name","form","novalidate","",1,"mat-white-bg","w-100-p",2,"padding","0px!important",3,"formGroup"],["fxLayout","row wrap",1,"w-100-p"],["fxFlex","100","fxFlex.gt-xs","50",1,"p-4",2,"padding","0px!important"],["appearance","outline","floatLabel","true",1,"w-100-p"],["matInput","","type","number","placeholder","Punctuality","formControlName","ratingPunctuality","id","ratingPunctuality",2,"display","none"],[3,"rating","starCount","color","ratingUpdated"],["fxFlex","100","fxFlex.gt-xs","50","class","p-4","style","padding: 0px!important;",4,"ngIf"],["matInput","","type","number","placeholder","Attitude","formControlName","ratingAttitude","id","ratingAttitude",2,"display","none"],["fxFlex","100",1,"p-4",2,"padding","0px!important"],["matInput","","type","note","placeholder","Note","formControlName","note","id","note"],["mat-dialog-actions","",1,"dialog-footer"],[2,"flex","1 1 auto"],["mat-flat-button","","color","warn",3,"click"],["mat-flat-button","","color","primary",3,"disabled","click"],["matInput","","type","number","placeholder","VehicleDescription","formControlName","ratingVehicleDescription","id","ratingVehicleDescription",2,"display","none"],["matInput","","type","number","placeholder","LoadDescription","formControlName","ratingLoadDescription","id","ratingLoadDescription",2,"display","none"],["matInput","","type","number","placeholder","Payment","formControlName","ratingPayment","id","ratingPayment",2,"display","none"],["matInput","","type","number","placeholder","Condition","formControlName","ratingCondition","id","ratingCondition",2,"display","none"]],template:function(i,a){1&i&&(t.TgZ(0,"h1",0),t._uU(1,"Add Review"),t.qZA(),t.TgZ(2,"div",1),t.TgZ(3,"form",2),t.TgZ(4,"div",3),t.TgZ(5,"div",4),t.TgZ(6,"mat-form-field",5),t.TgZ(7,"mat-label"),t._uU(8,"Punctuality"),t.qZA(),t._UZ(9,"input",6),t.TgZ(10,"mat-star-rating",7),t.NdJ("ratingUpdated",function(l){return a.onRatingChanged("ratingPunctuality",l)}),t.qZA(),t.TgZ(11,"mat-error"),t._uU(12,"Rating is required"),t.qZA(),t.qZA(),t.qZA(),t.YNc(13,C,8,3,"div",8),t.YNc(14,T,8,3,"div",8),t.YNc(15,A,8,3,"div",8),t.YNc(16,x,8,3,"div",8),t.TgZ(17,"div",4),t.TgZ(18,"mat-form-field",5),t.TgZ(19,"mat-label"),t._uU(20,"Attitude"),t.qZA(),t._UZ(21,"input",9),t.TgZ(22,"mat-star-rating",7),t.NdJ("ratingUpdated",function(l){return a.onRatingChanged("ratingAttitude",l)}),t.qZA(),t.TgZ(23,"mat-error"),t._uU(24,"Rating is required"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(25,"div",10),t.TgZ(26,"mat-form-field",5),t.TgZ(27,"mat-label"),t._uU(28,"Note"),t.qZA(),t._UZ(29,"textarea",11),t.TgZ(30,"mat-error"),t._uU(31,"Note is required"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(32,"div",12),t._UZ(33,"span",13),t.TgZ(34,"button",14),t.NdJ("click",function(){return a.onNoClick()}),t._uU(35,"Cancel"),t.qZA(),t.TgZ(36,"button",15),t.NdJ("click",function(){return a.onYesClick()}),t._uU(37,"Submit"),t.qZA(),t.qZA()),2&i&&(t.xp6(3),t.Q6J("formGroup",a.form),t.xp6(7),t.Q6J("rating",a.ratingPunctuality)("starCount",5)("color",a.starColorP),t.xp6(3),t.Q6J("ngIf","Driver"===a.reviewType),t.xp6(1),t.Q6J("ngIf","Load"===a.reviewType),t.xp6(1),t.Q6J("ngIf","Load"===a.reviewType),t.xp6(1),t.Q6J("ngIf","Driver"===a.reviewType),t.xp6(6),t.Q6J("rating",a.ratingAttitude)("starCount",5)("color",a.starColorP),t.xp6(14),t.Q6J("disabled",!a.form.valid))},directives:[_.uh,_.xY,m.xw,g._Y,g.JL,m.Wh,m.yH,g.sg,u.KE,u.hX,p.Nt,g.wV,g.Fj,g.JJ,g.u,d.T,u.TO,c.O5,_.H8,Z.lW],encapsulation:2}),e})()}}]);