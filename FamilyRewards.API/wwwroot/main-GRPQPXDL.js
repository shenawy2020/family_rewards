import{a as Ze,b as te,c as $e,d as qe,e as Ye,f as T}from"./chunk-TXFFVEMB.js";import{a as lt,b as ct,c as mt,d as pt}from"./chunk-LYC3JNC5.js";import"./chunk-TKWX7EN2.js";import{d as ot,e as L,f as st,h as ge}from"./chunk-5MWPFQYX.js";import{e as Xe,i as Je,j as et,m as tt,z as it}from"./chunk-V5PLLTU2.js";import{a as fe,d as S}from"./chunk-XFPU35PC.js";import{a as dt}from"./chunk-QPGP6D6D.js";import{B as nt,C as rt,D as at,i as Ne,j as Ue,k as Qe,l as Ge,m as He,n as We,q as ne,r as Ke,s as B,t as ie}from"./chunk-YNNQLRXF.js";import{$b as _,Aa as K,Ab as je,B as ye,Ba as Pe,Bb as he,C as j,Cb as o,Db as a,Eb as G,G as ke,Ga as Fe,H as De,I as me,Lb as k,Pb as u,R as pe,Rb as m,Sb as E,T as y,Ta as Ie,Tb as C,Ub as J,Va as d,Vb as H,W as Me,Wb as D,Xb as M,Z,Za as Oe,_ as F,_a as ue,aa as z,ab as Re,ac as R,ba as Se,bb as Ve,bc as v,ca as l,cb as X,da as Ae,db as Be,dc as s,ec as P,fc as p,ha as h,hc as V,i as A,ia as f,ib as b,j as Ce,jb as O,la as N,ma as $,mb as U,pa as q,qa as I,t as ce,ta as Ee,ua as Te,uc as ze,vb as Q,vc as ee,wb as w,xb as x,ya as Y,zb as Le}from"./chunk-SZEVDHHZ.js";var Dt="@",Mt=(()=>{class i{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=l(N);loadingSchedulerFn=l(St,{optional:!0});_engine;constructor(e,t,n,c,g){this.doc=e,this.delegate=t,this.zone=n,this.animationType=c,this.moduleImpl=g}ngOnDestroy(){this._engine?.flush()}loadImpl(){let e=()=>this.moduleImpl??import("./chunk-3RBPMZOF.js").then(n=>n),t;return this.loadingSchedulerFn?t=this.loadingSchedulerFn(e):t=e(),t.catch(n=>{throw new Me(5300,!1)}).then(({\u0275createEngine:n,\u0275AnimationRendererFactory:c})=>{this._engine=n(this.animationType,this.doc);let g=new c(this.delegate,this._engine,this.zone);return this.delegate=g,g})}createRenderer(e,t){let n=this.delegate.createRenderer(e,t);if(n.\u0275type===0)return n;typeof n.throwOnSyntheticProps=="boolean"&&(n.throwOnSyntheticProps=!1);let c=new _e(n);return t?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(g=>{let kt=g.createRenderer(e,t);c.use(kt),this.scheduler??=this.injector.get(Te,null,{optional:!0}),this.scheduler?.notify(10)}).catch(g=>{c.use(n)}),c}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}componentReplaced(e){this._engine?.flush(),this.delegate.componentReplaced?.(e)}static \u0275fac=function(t){Be()};static \u0275prov=Z({token:i,factory:i.\u0275fac})}return i})(),_e=class{delegate;replay=[];\u0275type=1;constructor(r){this.delegate=r}use(r){if(this.delegate=r,this.replay!==null){for(let e of this.replay)e(r);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(r,e){return this.delegate.createElement(r,e)}createComment(r){return this.delegate.createComment(r)}createText(r){return this.delegate.createText(r)}get destroyNode(){return this.delegate.destroyNode}appendChild(r,e){this.delegate.appendChild(r,e)}insertBefore(r,e,t,n){this.delegate.insertBefore(r,e,t,n)}removeChild(r,e,t,n){this.delegate.removeChild(r,e,t,n)}selectRootElement(r,e){return this.delegate.selectRootElement(r,e)}parentNode(r){return this.delegate.parentNode(r)}nextSibling(r){return this.delegate.nextSibling(r)}setAttribute(r,e,t,n){this.delegate.setAttribute(r,e,t,n)}removeAttribute(r,e,t){this.delegate.removeAttribute(r,e,t)}addClass(r,e){this.delegate.addClass(r,e)}removeClass(r,e){this.delegate.removeClass(r,e)}setStyle(r,e,t,n){this.delegate.setStyle(r,e,t,n)}removeStyle(r,e,t){this.delegate.removeStyle(r,e,t)}setProperty(r,e,t){this.shouldReplay(e)&&this.replay.push(n=>n.setProperty(r,e,t)),this.delegate.setProperty(r,e,t)}setValue(r,e){this.delegate.setValue(r,e)}listen(r,e,t,n){return this.shouldReplay(e)&&this.replay.push(c=>c.listen(r,e,t,n)),this.delegate.listen(r,e,t,n)}shouldReplay(r){return this.replay!==null&&r.startsWith(Dt)}},St=new z("");function ut(i="animations"){return Oe("NgAsyncAnimations"),Ae([{provide:Re,useFactory:()=>new Mt(l($),l(Ue),l(I),i)},{provide:Fe,useValue:i==="noop"?"NoopAnimations":"BrowserAnimations"}])}var re=()=>{let i=l(T),r=l(te);return i.isLoggedIn?!0:(r.navigate(["/auth/login"]),!1)},ht=()=>{let i=l(T),r=l(te);return i.isAdmin?!0:(r.navigate(["/child/dashboard"]),!1)},ft=()=>{let i=l(T),r=l(te);return i.isChild?!0:(r.navigate(["/admin/dashboard"]),!1)};var gt=[{path:"",redirectTo:"auth/login",pathMatch:"full"},{path:"auth",children:[{path:"login",loadComponent:()=>import("./chunk-5YPMNN54.js").then(i=>i.LoginComponent)},{path:"register",loadComponent:()=>import("./chunk-F4HIGLZZ.js").then(i=>i.RegisterComponent)}]},{path:"admin",canActivate:[re,ht],children:[{path:"dashboard",loadComponent:()=>import("./chunk-NQM3VAQO.js").then(i=>i.DashboardComponent)},{path:"children",loadComponent:()=>import("./chunk-PF2NNOSF.js").then(i=>i.ChildrenComponent)},{path:"tasks",loadComponent:()=>import("./chunk-6ZX2YVWJ.js").then(i=>i.TasksComponent)},{path:"stars",loadComponent:()=>import("./chunk-W462PGVA.js").then(i=>i.StarsComponent)},{path:"rewards",loadComponent:()=>import("./chunk-TI6BIBDI.js").then(i=>i.RewardsComponent)},{path:"penalties",loadComponent:()=>import("./chunk-3TTLWC6G.js").then(i=>i.PenaltiesComponent)},{path:"",redirectTo:"dashboard",pathMatch:"full"}]},{path:"child",canActivate:[re,ft],children:[{path:"dashboard",loadComponent:()=>import("./chunk-QAZGPNH3.js").then(i=>i.ChildDashboardComponent)},{path:"tasks",loadComponent:()=>import("./chunk-XTPVJVZP.js").then(i=>i.ChildTasksComponent)},{path:"rewards",loadComponent:()=>import("./chunk-HT6RSIHA.js").then(i=>i.ChildRewardsComponent)},{path:"wallet",loadComponent:()=>import("./chunk-SUN2GOYX.js").then(i=>i.ChildWalletComponent)},{path:"",redirectTo:"dashboard",pathMatch:"full"}]},{path:"leaderboard",canActivate:[re],loadComponent:()=>import("./chunk-FXOZP57V.js").then(i=>i.LeaderboardComponent)},{path:"**",redirectTo:"auth/login"}];var _t=(i,r)=>{let t=l(T).token;if(t){let n=i.clone({setHeaders:{Authorization:`Bearer ${t}`}});return r(n)}return r(i)};var vt={providers:[ze({eventCoalescing:!0}),Ye(gt),He(We([_t])),ut()]};var bt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=O({type:i});static \u0275inj=F({imports:[B]})}return i})();var wt=(()=>{class i{get vertical(){return this._vertical}set vertical(e){this._vertical=S(e)}_vertical=!1;get inset(){return this._inset}set inset(e){this._inset=S(e)}_inset=!1;static \u0275fac=function(t){return new(t||i)};static \u0275cmp=b({type:i,selectors:[["mat-divider"]],hostAttrs:["role","separator",1,"mat-divider"],hostVars:7,hostBindings:function(t,n){t&2&&(Q("aria-orientation",n.vertical?"vertical":"horizontal"),v("mat-divider-vertical",n.vertical)("mat-divider-horizontal",!n.vertical)("mat-divider-inset",n.inset))},inputs:{vertical:"vertical",inset:"inset"},decls:0,vars:0,template:function(t,n){},styles:[`.mat-divider {
  display: block;
  margin: 0;
  border-top-style: solid;
  border-top-color: var(--mat-divider-color, var(--mat-sys-outline-variant));
  border-top-width: var(--mat-divider-width, 1px);
}
.mat-divider.mat-divider-vertical {
  border-top: 0;
  border-right-style: solid;
  border-right-color: var(--mat-divider-color, var(--mat-sys-outline-variant));
  border-right-width: var(--mat-divider-width, 1px);
}
.mat-divider.mat-divider-inset {
  margin-left: 80px;
}
[dir=rtl] .mat-divider.mat-divider-inset {
  margin-left: auto;
  margin-right: 80px;
}
`],encapsulation:2,changeDetection:0})}return i})(),xt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=O({type:i});static \u0275inj=F({imports:[B]})}return i})();var se=["*"],Tt=["content"],Pt=[[["mat-drawer"]],[["mat-drawer-content"]],"*"],Ft=["mat-drawer","mat-drawer-content","*"];function It(i,r){if(i&1){let e=k();o(0,"div",1),u("click",function(){h(e);let n=m();return f(n._onBackdropClicked())}),a()}if(i&2){let e=m();v("mat-drawer-shown",e._isShowingBackdrop())}}function Ot(i,r){i&1&&(o(0,"mat-drawer-content"),C(1,2),a())}var Rt=[[["mat-sidenav"]],[["mat-sidenav-content"]],"*"],Vt=["mat-sidenav","mat-sidenav-content","*"];function Bt(i,r){if(i&1){let e=k();o(0,"div",1),u("click",function(){h(e);let n=m();return f(n._onBackdropClicked())}),a()}if(i&2){let e=m();v("mat-drawer-shown",e._isShowingBackdrop())}}function Lt(i,r){i&1&&(o(0,"mat-sidenav-content"),C(1,2),a())}var jt=`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`;var zt=new z("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),we=new z("MAT_DRAWER_CONTAINER"),ae=(()=>{class i extends L{_platform=l(ie);_changeDetectorRef=l(ee);_container=l(be);constructor(){let e=l(K),t=l(ot),n=l(I);super(e,t,n)}ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>{this._changeDetectorRef.markForCheck()})}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:t}=this._container;return e!=null&&e.mode!=="over"&&e.opened||t!=null&&t.mode!=="over"&&t.opened}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=b({type:i,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(t,n){t&2&&(R("margin-left",n._container._contentMargins.left,"px")("margin-right",n._container._contentMargins.right,"px"),v("mat-drawer-content-hidden",n._shouldBeHidden()))},features:[V([{provide:L,useExisting:i}]),U],ngContentSelectors:se,decls:1,vars:0,template:function(t,n){t&1&&(E(),C(0))},encapsulation:2,changeDetection:0})}return i})(),ve=(()=>{class i{_elementRef=l(K);_focusTrapFactory=l(et);_focusMonitor=l(Xe);_platform=l(ie);_ngZone=l(I);_renderer=l(Ve);_interactivityChecker=l(Je);_doc=l($);_container=l(we,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e==="end"?"end":"start",e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next()}_mode="over";get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=S(e)}_disableClose=!1;get autoFocus(){let e=this._autoFocus;return e??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(e){(e==="true"||e==="false"||e==null)&&(e=S(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(S(e))}_opened=Ee(!1);_openedVia=null;_animationStarted=new A;_animationEnd=new A;openedChange=new q(!0);_openedStream=this.openedChange.pipe(j(e=>e),ce(()=>{}));openedStart=this._animationStarted.pipe(j(()=>this.opened),me(void 0));_closedStream=this.openedChange.pipe(j(e=>!e),ce(()=>{}));closedStart=this._animationStarted.pipe(j(()=>!this.opened),me(void 0));_destroyed=new A;onPositionChanged=new q;_content;_modeChanged=new A;_injector=l(N);_changeDetectorRef=l(ee);constructor(){this.openedChange.pipe(y(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,t=this._elementRef.nativeElement;return[e.listen(t,"keydown",n=>{n.keyCode===27&&!this.disableClose&&!tt(n)&&this._ngZone.run(()=>{this.close(),n.stopPropagation(),n.preventDefault()})}),e.listen(t,"transitionend",this._handleTransitionEvent),e.listen(t,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_forceFocus(e,t){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let n=()=>{c(),g(),e.removeAttribute("tabindex")},c=this._renderer.listen(e,"blur",n),g=this._renderer.listen(e,"mousedown",n)})),e.focus(t)}_focusByCssSelector(e,t){let n=this._elementRef.nativeElement.querySelector(e);n&&this._forceFocus(n,t)}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":ue(()=>{!this._focusTrap.focusInitialElement()&&typeof e.focus=="function"&&e.focus()},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(e){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(e=!this.opened,t){e&&t&&(this._openedVia=t);let n=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||"program");return e||(this._openedVia=null),n}_setOpen(e,t,n){return e===this.opened?Promise.resolve(e?"open":"close"):(this._opened.set(e),this._container?._transitionsEnabled?(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()}),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",e),!e&&t&&this._restoreFocus(n),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(c=>{this.openedChange.pipe(De(1)).subscribe(g=>c(g?"open":"close"))}))}_setIsAnimating(e){this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",e)}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let t=this._elementRef.nativeElement,n=t.parentNode;e==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),n.insertBefore(this._anchor,t)),n.appendChild(t)):this._anchor&&this._anchor.parentNode.insertBefore(t,this._anchor)}_handleTransitionEvent=e=>{let t=this._elementRef.nativeElement;e.target===t&&this._ngZone.run(()=>{e.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static \u0275fac=function(t){return new(t||i)};static \u0275cmp=b({type:i,selectors:[["mat-drawer"]],viewQuery:function(t,n){if(t&1&&H(Tt,5),t&2){let c;D(c=M())&&(n._content=c.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(t,n){t&2&&(Q("align",null)("tabIndex",n.mode!=="side"?"-1":null),R("visibility",!n._container&&!n.opened?"hidden":null),v("mat-drawer-end",n.position==="end")("mat-drawer-over",n.mode==="over")("mat-drawer-push",n.mode==="push")("mat-drawer-side",n.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:se,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(t,n){t&1&&(E(),o(0,"div",1,0),C(2),a())},dependencies:[L],encapsulation:2,changeDetection:0})}return i})(),be=(()=>{class i{_dir=l(Ke,{optional:!0});_element=l(K);_ngZone=l(I);_changeDetectorRef=l(ee);_animationDisabled=nt();_transitionsEnabled=!1;_allDrawers;_drawers=new Pe;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=S(e)}_autosize=l(zt);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:S(e)}_backdropOverride=null;backdropClick=new q;_start=null;_end=null;_left=null;_right=null;_destroyed=new A;_doCheckSubject=new A;_contentMargins={left:null,right:null};_contentMarginChanges=new A;get scrollable(){return this._userContent||this._content}_injector=l(N);constructor(){let e=l(ie),t=l(st);this._dir?.change.pipe(y(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),t.change().pipe(y(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(pe(this._allDrawers),y(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(t=>!t._container||t._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(pe(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(ke(10),y(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,t=0;if(this._left&&this._left.opened){if(this._left.mode=="side")e+=this._left._getWidth();else if(this._left.mode=="push"){let n=this._left._getWidth();e+=n,t-=n}}if(this._right&&this._right.opened){if(this._right.mode=="side")t+=this._right._getWidth();else if(this._right.mode=="push"){let n=this._right._getWidth();t+=n,e-=n}}e=e||null,t=t||null,(e!==this._contentMargins.left||t!==this._contentMargins.right)&&(this._contentMargins={left:e,right:t},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(y(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!=="side"&&e.openedChange.pipe(y(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(y(this._drawers.changes)).subscribe(()=>{ue({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(y(ye(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let t=this._element.nativeElement.classList,n="mat-drawer-container-has-open";e?t.add(n):t.remove(n)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position=="end"?(this._end!=null,this._end=e):(this._start!=null,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!=="side":this._backdropOverride}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=b({type:i,selectors:[["mat-drawer-container"]],contentQueries:function(t,n,c){if(t&1&&J(c,ae,5)(c,ve,5),t&2){let g;D(g=M())&&(n._content=g.first),D(g=M())&&(n._allDrawers=g)}},viewQuery:function(t,n){if(t&1&&H(ae,5),t&2){let c;D(c=M())&&(n._userContent=c.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(t,n){t&2&&v("mat-drawer-container-explicit-backdrop",n._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[V([{provide:we,useExisting:i}])],ngContentSelectors:Ft,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(t,n){t&1&&(E(Pt),w(0,It,1,2,"div",0),C(1),C(2,1),w(3,Ot,2,0,"mat-drawer-content")),t&2&&(x(n.hasBackdrop?0:-1),d(3),x(n._content?-1:3))},dependencies:[ae],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2,changeDetection:0})}return i})(),oe=(()=>{class i extends ae{static \u0275fac=(()=>{let e;return function(n){return(e||(e=Y(i)))(n||i)}})();static \u0275cmp=b({type:i,selectors:[["mat-sidenav-content"]],hostAttrs:[1,"mat-drawer-content","mat-sidenav-content"],features:[V([{provide:L,useExisting:i}]),U],ngContentSelectors:se,decls:1,vars:0,template:function(t,n){t&1&&(E(),C(0))},encapsulation:2,changeDetection:0})}return i})(),xe=(()=>{class i extends ve{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=S(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=fe(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=fe(e)}_fixedBottomGap=0;static \u0275fac=(()=>{let e;return function(n){return(e||(e=Y(i)))(n||i)}})();static \u0275cmp=b({type:i,selectors:[["mat-sidenav"]],hostAttrs:[1,"mat-drawer","mat-sidenav"],hostVars:16,hostBindings:function(t,n){t&2&&(Q("tabIndex",n.mode!=="side"?"-1":null)("align",null),R("top",n.fixedInViewport?n.fixedTopGap:null,"px")("bottom",n.fixedInViewport?n.fixedBottomGap:null,"px"),v("mat-drawer-end",n.position==="end")("mat-drawer-over",n.mode==="over")("mat-drawer-push",n.mode==="push")("mat-drawer-side",n.mode==="side")("mat-sidenav-fixed",n.fixedInViewport))},inputs:{fixedInViewport:"fixedInViewport",fixedTopGap:"fixedTopGap",fixedBottomGap:"fixedBottomGap"},exportAs:["matSidenav"],features:[V([{provide:ve,useExisting:i}]),U],ngContentSelectors:se,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(t,n){t&1&&(E(),o(0,"div",1,0),C(2),a())},dependencies:[L],encapsulation:2,changeDetection:0})}return i})(),Ct=(()=>{class i extends be{_allDrawers=void 0;_content=void 0;static \u0275fac=(()=>{let e;return function(n){return(e||(e=Y(i)))(n||i)}})();static \u0275cmp=b({type:i,selectors:[["mat-sidenav-container"]],contentQueries:function(t,n,c){if(t&1&&J(c,oe,5)(c,xe,5),t&2){let g;D(g=M())&&(n._content=g.first),D(g=M())&&(n._allDrawers=g)}},hostAttrs:[1,"mat-drawer-container","mat-sidenav-container"],hostVars:2,hostBindings:function(t,n){t&2&&v("mat-drawer-container-explicit-backdrop",n._backdropOverride)},exportAs:["matSidenavContainer"],features:[V([{provide:we,useExisting:i},{provide:be,useExisting:i}]),U],ngContentSelectors:Vt,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(t,n){t&1&&(E(Rt),w(0,Bt,1,2,"div",0),C(1),C(2,1),w(3,Lt,2,0,"mat-sidenav-content")),t&2&&(x(n.hasBackdrop?0:-1),d(3),x(n._content?-1:3))},dependencies:[oe],styles:[jt],encapsulation:2,changeDetection:0})}return i})(),yt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=O({type:i});static \u0275inj=F({imports:[ge,B,ge]})}return i})();var de=class i{constructor(r){this.http=r;let e=localStorage.getItem("app_theme")||"teal";this.applyTheme(e)}themeSubject=new Ce("teal");theme$=this.themeSubject.asObservable();palettes=[{name:"Teal",key:"teal",primary:"#4dc9d6",primaryLight:"#b2ebf2",primaryDark:"#00838f",gradient:"linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%)",bgPrimary:"#e8f6f8",bgSecondary:"#d4f0f5"},{name:"Purple",key:"purple",primary:"#ab47bc",primaryLight:"#e1bee7",primaryDark:"#6a1b9a",gradient:"linear-gradient(135deg, #ab47bc 0%, #9c27b0 40%, #7b1fa2 100%)",bgPrimary:"#f3e5f5",bgSecondary:"#e8d5f5"},{name:"Blue",key:"blue",primary:"#42a5f5",primaryLight:"#bbdefb",primaryDark:"#1565c0",gradient:"linear-gradient(135deg, #42a5f5 0%, #2196f3 40%, #1976d2 100%)",bgPrimary:"#e3f2fd",bgSecondary:"#d0e8fc"},{name:"Green",key:"green",primary:"#66bb6a",primaryLight:"#c8e6c9",primaryDark:"#2e7d32",gradient:"linear-gradient(135deg, #66bb6a 0%, #4caf50 40%, #388e3c 100%)",bgPrimary:"#e8f5e9",bgSecondary:"#d5efd7"},{name:"Pink",key:"pink",primary:"#ec407a",primaryLight:"#f8bbd0",primaryDark:"#c2185b",gradient:"linear-gradient(135deg, #ec407a 0%, #e91e63 40%, #d81b60 100%)",bgPrimary:"#fce4ec",bgSecondary:"#f8d1dc"},{name:"Orange",key:"orange",primary:"#ffa726",primaryLight:"#ffe0b2",primaryDark:"#e65100",gradient:"linear-gradient(135deg, #ffa726 0%, #ff9800 40%, #f57c00 100%)",bgPrimary:"#fff3e0",bgSecondary:"#ffe6c9"}];get currentTheme(){return this.themeSubject.value}getPalette(r){return this.palettes.find(e=>e.key===(r||this.currentTheme))||this.palettes[0]}applyTheme(r){let e=this.getPalette(r);if(!e)return;this.themeSubject.next(r),localStorage.setItem("app_theme",r);let t=document.documentElement;t.style.setProperty("--accent-teal",e.primary),t.style.setProperty("--bg-primary",e.bgPrimary),t.style.setProperty("--bg-secondary",e.bgSecondary),t.style.setProperty("--nav-gradient",e.gradient),t.style.setProperty("--accent-primary",e.primary),t.style.setProperty("--accent-primary-light",e.primaryLight),t.style.setProperty("--accent-primary-dark",e.primaryDark)}saveToServer(r){return this.http.put(`${ne.apiUrl}/users/preferences`,{themeColor:r})}static \u0275fac=function(e){return new(e||i)(Se(Ge))};static \u0275prov=Z({token:i,factory:i.\u0275fac,providedIn:"root"})};var Qt=["sidenav"],Gt=(i,r)=>r.key;function Ht(i,r){if(i&1){let e=k();o(0,"a",15),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(1,"span"),s(2,"\u{1F4CA}"),a(),s(3),a(),o(4,"a",16),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(5,"span"),s(6,"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}"),a(),s(7),a(),o(8,"a",17),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(9,"span"),s(10,"\u2705"),a(),s(11),a(),o(12,"a",18),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(13,"span"),s(14,"\u{1F31F}"),a(),s(15),a(),o(16,"a",19),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(17,"span"),s(18,"\u{1F381}"),a(),s(19),a(),o(20,"a",20),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(21,"span"),s(22,"\u26A0\uFE0F"),a(),s(23),a()}if(i&2){let e=m(2);d(3),p(" ",e.i18n.t("nav.dashboard")," "),d(4),p(" ",e.i18n.t("nav.children")," "),d(4),p(" ",e.i18n.t("nav.tasks")," "),d(4),p(" ",e.i18n.t("nav.stars")," "),d(4),p(" ",e.i18n.t("nav.rewards")," "),d(4),p(" ",e.i18n.t("nav.penalties")," ")}}function Wt(i,r){if(i&1){let e=k();o(0,"a",21),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(1,"span"),s(2,"\u{1F3E0}"),a(),s(3),a(),o(4,"a",22),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(5,"span"),s(6,"\u{1F4CB}"),a(),s(7),a(),o(8,"a",23),u("click",function(){h(e),m(2);let n=_(2);return f(n.close())}),o(9,"span"),s(10,"\u{1F4B0}"),a(),s(11),a()}if(i&2){let e=m(2);d(3),p(" ",e.i18n.t("nav.home")," "),d(4),p(" ",e.i18n.t("nav.myTasks")," "),d(4),p(" ",e.i18n.t("nav.wallet")," ")}}function Zt(i,r){if(i&1){let e=k();w(0,Ht,24,6)(1,Wt,12,3),o(2,"a",11),u("click",function(){h(e),m();let n=_(2);return f(n.close())}),o(3,"span"),s(4,"\u{1F3C6}"),a(),s(5),a(),G(6,"div",12),o(7,"button",13),u("click",function(){h(e);let n=m(),c=_(2);return n.toggleLang(),f(c.close())}),o(8,"span"),s(9,"\u{1F310}"),a(),s(10),a(),o(11,"button",13),u("click",function(){h(e);let n=m(),c=_(2);return n.showThemePicker=!0,f(c.close())}),o(12,"span"),s(13,"\u{1F3A8}"),a(),s(14),a(),o(15,"button",14),u("click",function(){h(e);let n=m(),c=_(2);return n.auth.logout(),f(c.close())}),o(16,"span"),s(17,"\u{1F6AA}"),a(),s(18),a()}if(i&2){let e=m();x(e.auth.isAdmin?0:1),d(5),p(" ",e.i18n.t("nav.ranks")," "),d(5),p(" ",e.i18n.currentLang==="ar"?"English":"\u0639\u0631\u0628\u064A"," "),d(4),p(" ",e.i18n.t("nav.theme")," "),d(4),p(" ",e.i18n.t("nav.logout")," ")}}function $t(i,r){if(i&1&&(o(0,"a",42)(1,"span",30),s(2,"\u{1F4CA}"),a(),s(3),a(),o(4,"a",43)(5,"span",30),s(6,"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}"),a(),s(7),a(),o(8,"a",44)(9,"span",30),s(10,"\u2705"),a(),s(11),a(),o(12,"a",45)(13,"span",30),s(14,"\u{1F31F}"),a(),s(15),a(),o(16,"a",46)(17,"span",30),s(18,"\u{1F381}"),a(),s(19),a(),o(20,"a",47)(21,"span",30),s(22,"\u26A0\uFE0F"),a(),s(23),a()),i&2){let e=m(2);d(3),p(" ",e.i18n.t("nav.dashboard")," "),d(4),p(" ",e.i18n.t("nav.children")," "),d(4),p(" ",e.i18n.t("nav.tasks")," "),d(4),p(" ",e.i18n.t("nav.stars")," "),d(4),p(" ",e.i18n.t("nav.rewards")," "),d(4),p(" ",e.i18n.t("nav.penalties")," ")}}function qt(i,r){if(i&1&&(o(0,"a",48)(1,"span",30),s(2,"\u{1F3E0}"),a(),s(3),a(),o(4,"a",49)(5,"span",30),s(6,"\u{1F4CB}"),a(),s(7),a(),o(8,"a",50)(9,"span",30),s(10,"\u{1F4B0}"),a(),s(11),a()),i&2){let e=m(2);d(3),p(" ",e.i18n.t("nav.home")," "),d(4),p(" ",e.i18n.t("nav.myTasks")," "),d(4),p(" ",e.i18n.t("nav.wallet")," ")}}function Yt(i,r){if(i&1){let e=k();o(0,"nav",8)(1,"div",24)(2,"button",25),u("click",function(){h(e),m();let n=_(2);return f(n.toggle())}),o(3,"mat-icon"),s(4,"menu"),a()(),o(5,"a",26)(6,"span",5),s(7,"\u2B50"),a(),o(8,"span",27),s(9),a()(),o(10,"div",28),w(11,$t,24,6)(12,qt,12,3),o(13,"a",29)(14,"span",30),s(15,"\u{1F3C6}"),a(),s(16),a()(),o(17,"div",31)(18,"button",32),u("click",function(){h(e);let n=m();return f(n.toggleLang())}),s(19," \u{1F310} "),a(),o(20,"button",33),u("click",function(){h(e);let n=m();return f(n.showThemePicker=!n.showThemePicker)}),s(21," \u{1F3A8} "),a(),o(22,"button",34),G(23,"img",35),o(24,"span",36),s(25),a(),o(26,"mat-icon",37),s(27,"expand_more"),a()(),o(28,"mat-menu",null,1)(30,"div",38)(31,"span",39),s(32),a(),o(33,"span",40),s(34),a()(),G(35,"mat-divider"),o(36,"button",41),u("click",function(){h(e);let n=m();return f(n.auth.logout())}),o(37,"mat-icon"),s(38,"logout"),a(),s(39),a()()()()()}if(i&2){let e=_(29),t=m();d(9),P(t.i18n.t("common.appName")),d(2),x(t.auth.isAdmin?11:12),d(5),p(" ",t.i18n.t("nav.ranks")," "),d(6),he("matMenuTriggerFor",e),d(),he("src",t.getNavAvatar(),Ie)("alt",(t.auth.currentUser==null?null:t.auth.currentUser.fullName)||"User"),d(2),P(t.auth.currentUser==null?null:t.auth.currentUser.fullName),d(7),P(t.auth.currentUser==null?null:t.auth.currentUser.fullName),d(),v("admin",t.auth.isAdmin),d(),P(t.auth.isAdmin?"\u{1F451} Admin":"\u2B50 Child"),d(5),p(" ",t.i18n.t("nav.logout")," ")}}function Kt(i,r){i&1&&(o(0,"mat-icon"),s(1,"check"),a())}function Xt(i,r){if(i&1){let e=k();o(0,"button",55),u("click",function(){let n=h(e).$implicit,c=m(2);return f(c.selectTheme(n.key))}),w(1,Kt,2,0,"mat-icon"),a()}if(i&2){let e=r.$implicit,t=m(2);R("background",e.primary),v("active",t.theme.currentTheme===e.key),d(),x(t.theme.currentTheme===e.key?1:-1)}}function Jt(i,r){if(i&1){let e=k();o(0,"div",51),u("click",function(){h(e);let n=m();return f(n.showThemePicker=!1)}),o(1,"div",52),u("click",function(n){return n.stopPropagation()}),o(2,"h3"),s(3),a(),o(4,"div",53),Le(5,Xt,2,5,"button",54,Gt),a()()()}if(i&2){let e=m();d(3),P(e.i18n.t("theme.pickColor")),d(2),je(e.theme.palettes)}}var le=class i{constructor(r,e,t){this.auth=r;this.i18n=e;this.theme=t}showThemePicker=!1;sidenav;ngOnInit(){if(this.auth.currentUser){let r=this.auth.currentUser;r.themeColor&&this.theme.applyTheme(r.themeColor),r.language&&this.i18n.setLanguage(r.language)}}toggleLang(){let r=this.i18n.currentLang==="en"?"ar":"en";this.i18n.setLanguage(r);let e="${environment.apiUrl.replace('/api', '')}/api/users/preferences"}selectTheme(r){this.theme.applyTheme(r),this.theme.saveToServer(r).subscribe(),this.showThemePicker=!1}getNavAvatar(){let r=this.auth.currentUser?.avatarUrl;return r?.startsWith("/uploads")?`${ne.apiUrl.replace("/api","")}${r}`:r||"https://api.dicebear.com/7.x/fun-emoji/svg?seed="+encodeURIComponent(this.auth.currentUser?.fullName||"")}static \u0275fac=function(e){return new(e||i)(X(T),X(dt),X(de))};static \u0275cmp=b({type:i,selectors:[["app-root"]],viewQuery:function(e,t){if(e&1&&H(Qt,5),e&2){let n;D(n=M())&&(t.sidenav=n.first)}},decls:15,vars:6,consts:[["sidenav",""],["menu","matMenu"],[1,"app-shell"],["mode","over","position","start",1,"mobile-sidenav"],[1,"sidenav-header"],[1,"brand-star"],[1,"sidenav-brand"],[1,"sidenav-links"],[1,"app-nav"],[1,"theme-overlay"],[1,"app-content"],["routerLink","/leaderboard","routerLinkActive","active-link",1,"sidenav-link",3,"click"],[1,"sidenav-divider"],[1,"sidenav-link",3,"click"],[1,"sidenav-link","logout-link",3,"click"],["routerLink","/admin/dashboard","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/admin/children","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/admin/tasks","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/admin/stars","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/admin/rewards","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/admin/penalties","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/child/dashboard","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/child/tasks","routerLinkActive","active-link",1,"sidenav-link",3,"click"],["routerLink","/child/wallet","routerLinkActive","active-link",1,"sidenav-link",3,"click"],[1,"nav-inner"],[1,"hamburger-btn",3,"click"],["routerLink","/",1,"nav-brand"],[1,"brand-text"],[1,"nav-links"],["routerLink","/leaderboard","routerLinkActive","active-link",1,"nav-link"],[1,"link-icon"],[1,"nav-actions"],["title","Toggle Language",1,"action-btn",3,"click"],["title","Theme",1,"action-btn",3,"click"],[1,"user-btn",3,"matMenuTriggerFor"],[1,"user-avatar",3,"src","alt"],[1,"user-name"],[1,"dropdown-arrow"],[1,"menu-header"],[1,"menu-name"],[1,"menu-role"],["mat-menu-item","",3,"click"],["routerLink","/admin/dashboard","routerLinkActive","active-link",1,"nav-link"],["routerLink","/admin/children","routerLinkActive","active-link",1,"nav-link"],["routerLink","/admin/tasks","routerLinkActive","active-link",1,"nav-link"],["routerLink","/admin/stars","routerLinkActive","active-link",1,"nav-link"],["routerLink","/admin/rewards","routerLinkActive","active-link",1,"nav-link"],["routerLink","/admin/penalties","routerLinkActive","active-link",1,"nav-link"],["routerLink","/child/dashboard","routerLinkActive","active-link",1,"nav-link"],["routerLink","/child/tasks","routerLinkActive","active-link",1,"nav-link"],["routerLink","/child/wallet","routerLinkActive","active-link",1,"nav-link"],[1,"theme-overlay",3,"click"],[1,"theme-picker",3,"click"],[1,"theme-swatches"],[1,"swatch",3,"background","active"],[1,"swatch",3,"click"]],template:function(e,t){e&1&&(o(0,"mat-sidenav-container",2)(1,"mat-sidenav",3,0)(3,"div",4)(4,"span",5),s(5,"\u2B50"),a(),o(6,"span",6),s(7),a()(),o(8,"div",7),w(9,Zt,19,5),a()(),o(10,"mat-sidenav-content"),w(11,Yt,40,12,"nav",8),w(12,Jt,7,1,"div",9),o(13,"main",10),G(14,"router-outlet"),a()()()),e&2&&(d(7),P(t.i18n.t("common.appName")),d(2),x(t.auth.isLoggedIn?9:-1),d(2),x(t.auth.isLoggedIn?11:-1),d(),x(t.showThemePicker?12:-1),d(),v("with-nav",t.auth.isLoggedIn))},dependencies:[Ze,$e,qe,Ne,bt,it,at,rt,pt,ct,lt,mt,xt,wt,yt,xe,Ct,oe],styles:[".app-shell[_ngcontent-%COMP%]{min-height:100vh;background:var(--bg-primary)}.app-nav[_ngcontent-%COMP%]{background:var(--nav-gradient, linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%));padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:0 4px 20px #00000026}.nav-inner[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;max-width:1400px;margin:0 auto;height:64px}.hamburger-btn[_ngcontent-%COMP%]{display:none;background:#fff3;border:none;border-radius:12px;padding:6px;cursor:pointer;color:#fff}.nav-brand[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0}.brand-star[_ngcontent-%COMP%]{font-size:1.6rem;animation:float 3s infinite ease-in-out}.brand-text[_ngcontent-%COMP%]{font-size:1.3rem;font-weight:700;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.1)}.nav-links[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;flex:1;justify-content:center;flex-wrap:nowrap;overflow-x:auto}.nav-link[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;padding:8px 14px;border-radius:12px;color:#ffffffe6;text-decoration:none;font-size:.85rem;font-weight:500;transition:all .2s;white-space:nowrap}.nav-link[_ngcontent-%COMP%]:hover{background:#fff3;color:#fff}.nav-link.active-link[_ngcontent-%COMP%]{background:#ffffff4d;color:#fff;font-weight:600}.link-icon[_ngcontent-%COMP%]{font-size:1rem}.nav-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0}.action-btn[_ngcontent-%COMP%]{background:#ffffff26;border:1px solid rgba(255,255,255,.2);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;transition:all .2s}.action-btn[_ngcontent-%COMP%]:hover{background:#ffffff4d}.user-btn[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;background:#fff3;border:2px solid rgba(255,255,255,.3);border-radius:24px;padding:4px 12px 4px 4px;cursor:pointer;transition:all .2s;color:#fff;font-family:Fredoka,sans-serif;font-size:.9rem}.user-btn[_ngcontent-%COMP%]:hover{background:#ffffff4d}.user-avatar[_ngcontent-%COMP%]{width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,.6)}.user-name[_ngcontent-%COMP%]{font-weight:500}.dropdown-arrow[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px}.menu-header[_ngcontent-%COMP%]{padding:12px 16px;display:flex;flex-direction:column;gap:4px}.menu-name[_ngcontent-%COMP%]{font-weight:600;font-size:1rem}.menu-role[_ngcontent-%COMP%]{font-size:.8rem;color:var(--text-secondary)}.app-content[_ngcontent-%COMP%]{padding:24px;max-width:1400px;margin:0 auto;position:relative;z-index:1}.mobile-sidenav[_ngcontent-%COMP%]{width:280px;background:#fff!important;border-radius:0 20px 20px 0}[dir=rtl][_ngcontent-%COMP%]   .mobile-sidenav[_ngcontent-%COMP%]{border-radius:20px 0 0 20px}.sidenav-header[_ngcontent-%COMP%]{padding:24px;background:var(--nav-gradient, linear-gradient(135deg, #4dc9d6 0%, #45b7d1 40%, #42a5f5 100%));display:flex;align-items:center;gap:12px}.sidenav-brand[_ngcontent-%COMP%]{font-size:1.3rem;font-weight:700;color:#fff}.sidenav-links[_ngcontent-%COMP%]{padding:16px 0}.sidenav-link[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:14px 24px;text-decoration:none;color:var(--text-primary);font-weight:500;font-size:.95rem;transition:background .2s;width:100%;background:none;border:none;cursor:pointer;font-family:Fredoka,sans-serif;text-align:start}.sidenav-link[_ngcontent-%COMP%]:hover{background:var(--bg-primary)}.sidenav-link.active-link[_ngcontent-%COMP%]{background:var(--bg-primary);font-weight:600}.sidenav-link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-size:1.2rem}.sidenav-divider[_ngcontent-%COMP%]{height:1px;background:var(--border);margin:8px 24px}.logout-link[_ngcontent-%COMP%]{color:#ef5350}.theme-overlay[_ngcontent-%COMP%]{position:fixed;inset:0;background:#0006;z-index:1000;display:flex;align-items:center;justify-content:center;animation:_ngcontent-%COMP%_fadeIn .2s ease}.theme-picker[_ngcontent-%COMP%]{background:#fff;border-radius:24px;padding:28px;box-shadow:0 8px 32px #0003;min-width:300px;text-align:center}.theme-picker[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:20px;font-size:1.2rem}.theme-swatches[_ngcontent-%COMP%]{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.swatch[_ngcontent-%COMP%]{width:52px;height:52px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;color:#fff}.swatch[_ngcontent-%COMP%]:hover{transform:scale(1.15)}.swatch.active[_ngcontent-%COMP%]{border-color:#333;transform:scale(1.15);box-shadow:0 4px 12px #0000004d}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0}to{opacity:1}}@media(max-width:768px){.nav-links[_ngcontent-%COMP%], .user-name[_ngcontent-%COMP%]{display:none}.hamburger-btn[_ngcontent-%COMP%]{display:flex}.app-content[_ngcontent-%COMP%]{padding:16px}.action-btn[_ngcontent-%COMP%]{width:32px;height:32px;font-size:.95rem}}@media(max-width:480px){.app-nav[_ngcontent-%COMP%]{padding:0 12px}.brand-text[_ngcontent-%COMP%]{font-size:1.1rem}.app-content[_ngcontent-%COMP%]{padding:12px}}"]})};Qe(le,vt).catch(i=>console.error(i));
