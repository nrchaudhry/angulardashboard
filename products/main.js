(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /root/.openclaw/workspace/projects/angulardashboard/src/main.ts */"zUnb");


/***/ }),

/***/ "0dSB":
/*!****************************!*\
  !*** ./src/app/setting.ts ***!
  \****************************/
/*! exports provided: setting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setting", function() { return setting; });
const setting = {
    CustomerAppPath: 'https://customers.petease.com.pk/#/',
    studentAppPath: 'https://students.petease.com.pk/#/',
    AppsStorePath: 'https://apps.petease.com.pk/#/',
    LoginAppPath: 'https://accounts.petease.com.pk/#/',
    application_ID: 'CWIZTECHApplicationManagementDev',
    companyName: 'Compuwiz Technologies',
    companyShortName: 'CWizTech',
    logo: 'https://design.cwiztech.com/images/logo-tansparent.png',
    logo1white: 'https://design.cwiztech.com/images/logo-tansparent.png',
    loginBanner1: 'https://design.petease.com.pk/images/intro-back.jpg',
    icon: 'https://design.cwiztech.com/images/favicon.ico',
    servicePath: 'fivestar/',
    commonServicePath: '',
    isHash: '/#',
    redirctPath: '',
    //redirctPath: '/doctor',
    isApplication: false,
};


/***/ }),

/***/ "6xnn":
/*!*********************************************!*\
  !*** ./src/app/services/setting.headers.ts ***!
  \*********************************************/
/*! exports provided: RequestOptionsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestOptionsService", function() { return RequestOptionsService; });
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/http */ "qlzE");
/* harmony import */ var src_app_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/setting */ "0dSB");


class RequestOptionsService extends _angular_http__WEBPACK_IMPORTED_MODULE_0__["BaseRequestOptions"] {
    constructor() {
        super();
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('grant_type', 'password');
    }
    merge(options) {
        const newOptions = super.merge(options);
        if (options.url) {
            if (options.url.search('/USERLOGIN/') !== -1) {
                var token = JSON.parse(localStorage.getItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID)).basic_Token_;
            }
            else {
                var token = JSON.parse(localStorage.getItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID)).access_token;
            }
            newOptions.headers.set('authorization', `bearer ${token}`);
            newOptions.headers.set('ApplicationCode', src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
            return newOptions;
        }
        else {
            newOptions.headers.set('authorization', `bearer ${JSON.parse(localStorage.getItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID)).access_token}`);
            newOptions.headers.set('ApplicationCode', src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
            return newOptions;
        }
    }
}


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "D8EZ":
/*!************************************************!*\
  !*** ./src/app/pages/login/login.component.ts ***!
  \************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/setting */ "0dSB");
/* harmony import */ var _utilities_Shared_Funtions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utilities/Shared_Funtions */ "z6r1");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-toastr */ "5eHb");
/* harmony import */ var _login_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./login.service */ "fxZ6");







class LoginComponent {
    constructor(router, toastr, loginservice, activatedRoute) {
        this.router = router;
        this.toastr = toastr;
        this.loginservice = loginservice;
        this.activatedRoute = activatedRoute;
    }
    ngOnInit() {
        if (this.loginservice.logged() == true) {
            setTimeout(() => this.toastr.success('Sucessfully loged in!'));
            this.offSpinner();
            Object(_utilities_Shared_Funtions__WEBPACK_IMPORTED_MODULE_2__["redirectByHref"])(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].redirctPath + '/#/home');
            return;
        }
        else {
            this.activatedRoute.queryParams.subscribe((params) => {
                if (params.access_token &&
                    params.application_ID &&
                    params.expires_in &&
                    params.last_LOGIN &&
                    params.user_NAME) {
                    let statusdetail = this.loginservice.saveDetail(params);
                    let statusToken = this.loginservice.saveToken(params.access_token);
                    if (statusdetail && statusToken) {
                        if (this.loginservice.logged()) {
                            setTimeout(() => this.toastr.success('Sucessfully loged in!'));
                            this.offSpinner();
                            Object(_utilities_Shared_Funtions__WEBPACK_IMPORTED_MODULE_2__["redirectByHref"])(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].redirctPath + '/#/home');
                            return;
                        }
                        else {
                            this.offSpinner();
                            this.loginservice.logout();
                            return false;
                        }
                    }
                }
                else {
                    if (this.loginservice.logged() == false) {
                        location.assign(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].LoginAppPath + '?application_ID=' + src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
                        return;
                    }
                    else {
                        this.offSpinner();
                        this.loginservice.logout();
                        return;
                    }
                }
            });
        }
    }
    offSpinner() { }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_login_service__WEBPACK_IMPORTED_MODULE_5__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"])); };
LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["app-login"]], decls: 10, vars: 0, consts: [[1, "auth-wrapper"], [1, "all-wrapper", "menu-side", "with-pattern", "p-4"], [1, ""], [1, "auto"], [1, "loader"], [1, "loader-inner"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "One Moment Please...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".auth-box-w[_ngcontent-%COMP%] {\n  background-color: #ffffffe3;\n}\n\n.auth-box-w[_ngcontent-%COMP%] {\n  background-color: #ffffffe3;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  background-attachment: fixed;\n  background-color: #f5f5f5;\n  background-image: url(/assets/theme/1.jpg);\n  background-size: cover;\n  width: 100%;\n  min-height: 100%;\n  position: absolute;\n}\n\n._registerationPage[_ngcontent-%COMP%] {\n  padding: 0 1em;\n}\n\n._loginPage[_ngcontent-%COMP%]   ._registerationSteps[_ngcontent-%COMP%] {\n  max-width: 450px;\n}\n\n._registerationPage[_ngcontent-%COMP%]   ._registerationSteps[_ngcontent-%COMP%] {\n  max-width: 550px;\n  padding: 3em;\n  margin: 4em auto;\n  position: relative;\n}\n\n.login-box[_ngcontent-%COMP%] {\n  max-width: 450px;\n  margin: auto;\n  padding: 7% 0;\n}\n\n.login-box-body[_ngcontent-%COMP%] {\n  background: #fff;\n  padding: 3em;\n  color: #333;\n  border-radius: 2px;\n  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);\n}\n\n.login-logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .login-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 308px;\n  margin: auto;\n  display: block;\n}\n\n.login-logo[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 4em;\n}\n\n.login-page[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  min-width: 100px;\n  text-transform: uppercase;\n  opacity: 1;\n}\n\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n\nform[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0em;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n}\n\n.input-lg[_ngcontent-%COMP%] {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n\nlabel[_ngcontent-%COMP%] {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold;\n  cursor: default;\n}\n\n.form-control[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 49px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n  border-color: #ddd;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-shadow: none !important;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n}\n\n.login-page[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  min-width: 100px;\n  text-transform: uppercase;\n  opacity: 1;\n  box-shadow: none !important;\n}\n\n.btn.disabled[_ngcontent-%COMP%], .btn[disabled][_ngcontent-%COMP%], fieldset[disabled][_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n}\n\ninput[type='reset'][disabled][_ngcontent-%COMP%], input[type='submit'][disabled][_ngcontent-%COMP%], html[_ngcontent-%COMP%]   input[type='button'][disabled][_ngcontent-%COMP%], button[disabled][_ngcontent-%COMP%] {\n  cursor: default;\n}\n\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #4485f7;\n  border-color: #4485f7;\n}\n\nbutton[disabled][_ngcontent-%COMP%], html[_ngcontent-%COMP%]   input[disabled][_ngcontent-%COMP%] {\n  cursor: default;\n}\n\n.loader[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 80px;\n  height: 80px;\n  position: relative;\n  border: 4px solid black;\n  top: 50%;\n  animation: loader 2s infinite ease;\n}\n\n.loader-inner[_ngcontent-%COMP%] {\n  vertical-align: top;\n  display: inline-block;\n  width: 100%;\n  background-color: black;\n  animation: loader-inner 2s infinite ease-in;\n}\n\n@keyframes loader {\n  0% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(180deg);\n  }\n  50% {\n    transform: rotate(180deg);\n  }\n  75% {\n    transform: rotate(360deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loader-inner {\n  0% {\n    height: 0%;\n  }\n  25% {\n    height: 0%;\n  }\n  50% {\n    height: 100%;\n  }\n  75% {\n    height: 100%;\n  }\n  100% {\n    height: 0%;\n  }\n}\n\n.auto[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSw0QkFBNEI7RUFDNUIseUJBQXlCO0VBQ3pCLDBDQUEwQztFQUMxQyxzQkFBc0I7RUFDdEIsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsWUFBWTtFQUNaLFdBQVc7RUFDWCxrQkFBa0I7RUFHbEIsMENBQTBDO0FBQzVDOztBQUVBOztFQUVFLFlBQVk7RUFDWixZQUFZO0VBQ1osY0FBYztBQUNoQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLFVBQVU7QUFDWjs7QUFFQTtFQUdFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2Ysc0JBQXNCO0VBQ3RCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWCxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGVBQWU7RUFDZix1QkFBdUI7RUFDdkIsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIsc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQiwyQkFBMkI7RUFDM0Isd0VBQXdFO0FBQzFFOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLHlCQUF5QjtFQUN6QixVQUFVO0VBQ1YsMkJBQTJCO0FBQzdCOztBQUVBOzs7RUFHRSxtQkFBbUI7QUFDckI7O0FBRUE7Ozs7RUFJRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLHFCQUFxQjtBQUN2Qjs7QUFFQTs7RUFFRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLHVCQUF1QjtFQUN2QixRQUFRO0VBQ1Isa0NBQWtDO0FBQ3BDOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsdUJBQXVCO0VBQ3ZCLDJDQUEyQztBQUM3Qzs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx5QkFBeUI7RUFDM0I7RUFDQTtJQUNFLHlCQUF5QjtFQUMzQjtFQUNBO0lBQ0UseUJBQXlCO0VBQzNCO0VBQ0E7SUFDRSx5QkFBeUI7RUFDM0I7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaO0VBQ0E7SUFDRSxVQUFVO0VBQ1o7RUFDQTtJQUNFLFlBQVk7RUFDZDtFQUNBO0lBQ0UsWUFBWTtFQUNkO0VBQ0E7SUFDRSxVQUFVO0VBQ1o7QUFDRjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEIiLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hdXRoLWJveC13IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZmUzO1xufVxuXG4uYXV0aC1ib3gtdyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmZlMztcbn1cblxuLmxvZ2luLXBhZ2Uge1xuICBiYWNrZ3JvdW5kLWF0dGFjaG1lbnQ6IGZpeGVkO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoL2Fzc2V0cy90aGVtZS8xLmpwZyk7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiAxMDAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5fcmVnaXN0ZXJhdGlvblBhZ2Uge1xuICBwYWRkaW5nOiAwIDFlbTtcbn1cblxuLl9sb2dpblBhZ2UgLl9yZWdpc3RlcmF0aW9uU3RlcHMge1xuICBtYXgtd2lkdGg6IDQ1MHB4O1xufVxuXG4uX3JlZ2lzdGVyYXRpb25QYWdlIC5fcmVnaXN0ZXJhdGlvblN0ZXBzIHtcbiAgbWF4LXdpZHRoOiA1NTBweDtcbiAgcGFkZGluZzogM2VtO1xuICBtYXJnaW46IDRlbSBhdXRvO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5sb2dpbi1ib3gge1xuICBtYXgtd2lkdGg6IDQ1MHB4O1xuICBtYXJnaW46IGF1dG87XG4gIHBhZGRpbmc6IDclIDA7XG59XG5cbi5sb2dpbi1ib3gtYm9keSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIHBhZGRpbmc6IDNlbTtcbiAgY29sb3I6ICMzMzM7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgLW1vei1ib3gtc2hhZG93OiAwIDEwcHggNTBweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAxMHB4IDUwcHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICBib3gtc2hhZG93OiAwIDEwcHggNTBweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG59XG5cbi5sb2dpbi1sb2dvIGEsXG4ubG9naW4tbG9nbyBpbWcge1xuICB3aWR0aDogMzA4cHg7XG4gIG1hcmdpbjogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5sb2dpbi1sb2dvIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiA0ZW07XG59XG5cbi5sb2dpbi1wYWdlIC5idG4ge1xuICBtaW4td2lkdGg6IDEwMHB4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAxO1xufVxuXG4qIHtcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAtbW96LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmZvcm0ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luLXRvcDogMGVtO1xufVxuXG4uZm9ybS1ncm91cCB7XG4gIG1hcmdpbi1ib3R0b206IDE1cHg7XG59XG5cbi5pbnB1dC1sZyB7XG4gIGhlaWdodDogNDZweDtcbiAgcGFkZGluZzogMTBweCAxNnB4O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGxpbmUtaGVpZ2h0OiAxLjMzMzMzMzM7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbn1cblxubGFiZWwge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4uZm9ybS1jb250cm9sIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDQ5cHg7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGxpbmUtaGVpZ2h0OiAxLjQyODU3MTQzO1xuICBjb2xvcjogIzU1NTtcbiAgYm9yZGVyLWNvbG9yOiAjZGRkO1xuICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIGVhc2UtaW4tb3V0IDAuMTVzLCBib3gtc2hhZG93IGVhc2UtaW4tb3V0IDAuMTVzO1xufVxuXG4ubG9naW4tcGFnZSAuYnRuIHtcbiAgbWluLXdpZHRoOiAxMDBweDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgb3BhY2l0eTogMTtcbiAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xufVxuXG4uYnRuLmRpc2FibGVkLFxuLmJ0bltkaXNhYmxlZF0sXG5maWVsZHNldFtkaXNhYmxlZF0gLmJ0biB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbmlucHV0W3R5cGU9J3Jlc2V0J11bZGlzYWJsZWRdLFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdLFxuaHRtbCBpbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF0sXG5idXR0b25bZGlzYWJsZWRdIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuXG4uYnRuLXByaW1hcnkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDQ4NWY3O1xuICBib3JkZXItY29sb3I6ICM0NDg1Zjc7XG59XG5cbmJ1dHRvbltkaXNhYmxlZF0sXG5odG1sIGlucHV0W2Rpc2FibGVkXSB7XG4gIGN1cnNvcjogZGVmYXVsdDtcbn1cblxuLmxvYWRlciB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDgwcHg7XG4gIGhlaWdodDogODBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBib3JkZXI6IDRweCBzb2xpZCBibGFjaztcbiAgdG9wOiA1MCU7XG4gIGFuaW1hdGlvbjogbG9hZGVyIDJzIGluZmluaXRlIGVhc2U7XG59XG5cbi5sb2FkZXItaW5uZXIge1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgYW5pbWF0aW9uOiBsb2FkZXItaW5uZXIgMnMgaW5maW5pdGUgZWFzZS1pbjtcbn1cblxuQGtleWZyYW1lcyBsb2FkZXIge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIGxvYWRlci1pbm5lciB7XG4gIDAlIHtcbiAgICBoZWlnaHQ6IDAlO1xuICB9XG4gIDI1JSB7XG4gICAgaGVpZ2h0OiAwJTtcbiAgfVxuICA1MCUge1xuICAgIGhlaWdodDogMTAwJTtcbiAgfVxuICA3NSUge1xuICAgIGhlaWdodDogMTAwJTtcbiAgfVxuICAxMDAlIHtcbiAgICBoZWlnaHQ6IDAlO1xuICB9XG59XG5cbi5hdXRvIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LoginComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-login',
                templateUrl: './login.component.html',
                styleUrls: ['./login.component.css'],
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }, { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"] }, { type: _login_service__WEBPACK_IMPORTED_MODULE_5__["LoginService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] }]; }, null); })();


/***/ }),

/***/ "RjSP":
/*!****************************************************!*\
  !*** ./src/app/services/http-error.interceptor.ts ***!
  \****************************************************/
/*! exports provided: HttpErrorInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpErrorInterceptor", function() { return HttpErrorInterceptor; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");


class HttpErrorInterceptor {
    intercept(request, next) {
        return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])((error) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${error.error.message}`;
            }
            else {
                // server-side error
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])(errorMessage);
        }));
    }
}


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/setting */ "0dSB");
/* harmony import */ var _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-loading-bar/core */ "scMJ");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");





class AppComponent {
    constructor() {
        this.favIcon = document.querySelector('#appIcon');
        this.title = 'Order Management - ERP';
        this.changeIcon();
    }
    changeIcon() {
        this.favIcon.href = src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].icon;
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "ngx-loading-bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "router-outlet");
    } }, directives: [_ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_2__["LoadingBarComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css'],
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/http */ "qlzE");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "5eHb");
/* harmony import */ var _ngx_loading_bar_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-loading-bar/http */ "bQuY");
/* harmony import */ var _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-loading-bar/router */ "T/fw");
/* harmony import */ var _ngx_loading_bar_http_client__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-loading-bar/http-client */ "tRAK");
/* harmony import */ var _toverux_ngx_sweetalert2__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @toverux/ngx-sweetalert2 */ "IzFx");
/* harmony import */ var _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-loading-bar/core */ "scMJ");
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-spinner */ "JqCM");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/service-worker */ "Jho9");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _pages_login_login_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./pages/login/login.component */ "D8EZ");
/* harmony import */ var _pages_notfound_notfound_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./pages/notfound/notfound.component */ "bPkx");
/* harmony import */ var _services_setting_headers__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./services/setting.headers */ "6xnn");
/* harmony import */ var _services_http_error_interceptor__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./services/http-error.interceptor */ "RjSP");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../environments/environment */ "AytR");



























class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [
        {
            provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HTTP_INTERCEPTORS"],
            useClass: _services_http_error_interceptor__WEBPACK_IMPORTED_MODULE_20__["HttpErrorInterceptor"],
            multi: true,
        },
        {
            provide: _angular_http__WEBPACK_IMPORTED_MODULE_4__["RequestOptions"],
            useClass: _services_setting_headers__WEBPACK_IMPORTED_MODULE_19__["RequestOptionsService"],
        },
        // AuthGuardService,
        _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"],
        { provide: _angular_common__WEBPACK_IMPORTED_MODULE_2__["LocationStrategy"], useClass: _angular_common__WEBPACK_IMPORTED_MODULE_2__["HashLocationStrategy"] },
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrModule"].forRoot(),
            _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"],
            _angular_http__WEBPACK_IMPORTED_MODULE_4__["HttpModule"],
            _ngx_loading_bar_http__WEBPACK_IMPORTED_MODULE_6__["LoadingBarHttpModule"],
            _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_7__["LoadingBarRouterModule"],
            _ngx_loading_bar_http_client__WEBPACK_IMPORTED_MODULE_8__["LoadingBarHttpClientModule"],
            _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_10__["LoadingBarModule"].forRoot(),
            _toverux_ngx_sweetalert2__WEBPACK_IMPORTED_MODULE_9__["SweetAlert2Module"].forRoot(),
            ngx_spinner__WEBPACK_IMPORTED_MODULE_11__["NgxSpinnerModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_12__["ReactiveFormsModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_15__["AppRoutingModule"],
            _angular_service_worker__WEBPACK_IMPORTED_MODULE_14__["ServiceWorkerModule"].register('ngsw-worker.js', {
                enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_21__["environment"].production,
                registrationStrategy: 'registerWhenStable:30000',
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"], _pages_login_login_component__WEBPACK_IMPORTED_MODULE_17__["LoginComponent"], _pages_notfound_notfound_component__WEBPACK_IMPORTED_MODULE_18__["NotfoundComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"],
        _angular_http__WEBPACK_IMPORTED_MODULE_4__["HttpModule"],
        _ngx_loading_bar_http__WEBPACK_IMPORTED_MODULE_6__["LoadingBarHttpModule"],
        _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_7__["LoadingBarRouterModule"],
        _ngx_loading_bar_http_client__WEBPACK_IMPORTED_MODULE_8__["LoadingBarHttpClientModule"], _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_10__["LoadingBarModule"], _toverux_ngx_sweetalert2__WEBPACK_IMPORTED_MODULE_9__["SweetAlert2Module"], ngx_spinner__WEBPACK_IMPORTED_MODULE_11__["NgxSpinnerModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_12__["ReactiveFormsModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_15__["AppRoutingModule"], _angular_service_worker__WEBPACK_IMPORTED_MODULE_14__["ServiceWorkerModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [_app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"], _pages_login_login_component__WEBPACK_IMPORTED_MODULE_17__["LoginComponent"], _pages_notfound_notfound_component__WEBPACK_IMPORTED_MODULE_18__["NotfoundComponent"]],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
                    ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrModule"].forRoot(),
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"],
                    _angular_http__WEBPACK_IMPORTED_MODULE_4__["HttpModule"],
                    _ngx_loading_bar_http__WEBPACK_IMPORTED_MODULE_6__["LoadingBarHttpModule"],
                    _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_7__["LoadingBarRouterModule"],
                    _ngx_loading_bar_http_client__WEBPACK_IMPORTED_MODULE_8__["LoadingBarHttpClientModule"],
                    _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_10__["LoadingBarModule"].forRoot(),
                    _toverux_ngx_sweetalert2__WEBPACK_IMPORTED_MODULE_9__["SweetAlert2Module"].forRoot(),
                    ngx_spinner__WEBPACK_IMPORTED_MODULE_11__["NgxSpinnerModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_12__["ReactiveFormsModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_15__["AppRoutingModule"],
                    _angular_service_worker__WEBPACK_IMPORTED_MODULE_14__["ServiceWorkerModule"].register('ngsw-worker.js', {
                        enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_21__["environment"].production,
                        registrationStrategy: 'registerWhenStable:30000',
                    }),
                ],
                providers: [
                    {
                        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HTTP_INTERCEPTORS"],
                        useClass: _services_http_error_interceptor__WEBPACK_IMPORTED_MODULE_20__["HttpErrorInterceptor"],
                        multi: true,
                    },
                    {
                        provide: _angular_http__WEBPACK_IMPORTED_MODULE_4__["RequestOptions"],
                        useClass: _services_setting_headers__WEBPACK_IMPORTED_MODULE_19__["RequestOptionsService"],
                    },
                    // AuthGuardService,
                    _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"],
                    { provide: _angular_common__WEBPACK_IMPORTED_MODULE_2__["LocationStrategy"], useClass: _angular_common__WEBPACK_IMPORTED_MODULE_2__["HashLocationStrategy"] },
                ],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "bPkx":
/*!******************************************************!*\
  !*** ./src/app/pages/notfound/notfound.component.ts ***!
  \******************************************************/
/*! exports provided: NotfoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotfoundComponent", function() { return NotfoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class NotfoundComponent {
    constructor() { }
    ngOnInit() { }
}
NotfoundComponent.ɵfac = function NotfoundComponent_Factory(t) { return new (t || NotfoundComponent)(); };
NotfoundComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NotfoundComponent, selectors: [["app-notfound"]], decls: 2, vars: 0, template: function NotfoundComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "notfound works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJub3Rmb3VuZC5jb21wb25lbnQuY3NzIn0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NotfoundComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-notfound',
                templateUrl: './notfound.component.html',
                styleUrls: ['./notfound.component.css'],
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "fxZ6":
/*!**********************************************!*\
  !*** ./src/app/pages/login/login.service.ts ***!
  \**********************************************/
/*! exports provided: LoginService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginService", function() { return LoginService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/setting */ "0dSB");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "qlzE");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-toastr */ "5eHb");






class LoginService {
    constructor(http, _router, _toastr) {
        this.http = http;
        this._router = _router;
        this._toastr = _toastr;
    }
    saveToken(token) {
        if (token) {
            localStorage.setItem('access_token', token);
            return true;
        }
        else {
            return false;
        }
    }
    saveDetail(user) {
        if (user) {
            localStorage.setItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID, JSON.stringify(user));
            return true;
        }
        else {
            return false;
        }
    }
    loadToken() {
        const token = localStorage.getItem('access_token');
        this.authToken = token;
    }
    loaddetail() {
        const getUser = localStorage.getItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
        this.user = JSON.parse(getUser);
        return this.user;
    }
    logout() {
        localStorage.removeItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
        localStorage.removeItem('access_token');
        window.location.assign(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].LoginAppPath + 'home/logout?application_ID=' + src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
        return true;
    }
    logged() {
        const getUser = localStorage.getItem(src_app_setting__WEBPACK_IMPORTED_MODULE_1__["setting"].application_ID);
        const _application_name_access_token_ = localStorage.getItem('access_token');
        if (getUser && _application_name_access_token_) {
            return true;
        }
        else {
            return false;
        }
    }
}
LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"])); };
LoginService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LoginService, factory: LoginService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LoginService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root',
            }]
    }], function () { return [{ type: _angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }, { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"] }]; }, null); })();


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");




const routes = [
    {
        path: 'home',
        loadChildren: () => __webpack_require__.e(/*! import() | modules-home-home-module */ "modules-home-home-module").then(__webpack_require__.bind(null, /*! ./modules/home/home.module */ "iydT")).then((m) => m.HomeModule),
    },
    {
        path: '',
        loadChildren: () => __webpack_require__.e(/*! import() | modules-default-default-module */ "modules-default-default-module").then(__webpack_require__.bind(null, /*! ./modules/default/default.module */ "Ig7n")).then((m) => m.DefaultModule),
    },
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "z6r1":
/*!**********************************************!*\
  !*** ./src/app/utilities/Shared_Funtions.ts ***!
  \**********************************************/
/*! exports provided: redirectByHref */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "redirectByHref", function() { return redirectByHref; });
function redirectByHref(url) {
    window.location.href = url;
}


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch((err) => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map