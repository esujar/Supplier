angular.module("app", [
     'ngRoute',
    'spt.util.postQ',
    'ui.bootstrap',
    'spt.componentes.kendoGrid',
    'spt.componentes',
	'ab-base64',
    'ngCookies'
])
.run([function () {
    kendo.culture("es-ES");

}])
.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
        //.when('/loginDirecto/:empresa/:usuario/:clave', {
        //    templateUrl: 'Views/blank.html',
        //    controller: 'loginDirectoCtrl'
        //})
		// .when('/login/:empresa/:usuario/:clave', {
            // templateUrl: 'Views/login.html',
            // controller: 'loginCtrl'
        // })
        .when('/listadoReservas', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoReservas.html',
            controller: 'listadoReservasCtrl'
        })
		.when('/roomingList/:tipoInforme/:id/:idPrestatario?/:fecha?/:tipoServicio?', {
            templateUrl: '/js/angularApps/proveedores/Views/roomingList.html',
            controller: 'roomingListCtrl'
        })
		.when('/listadoTraslados', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoTraslados.html',
            controller: 'listadoTrasladosCtrl'
        })
		.when('/listadoHoteles', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoHoteles.html',
            controller: 'listadoHotelesCtrl'
        })
		.when('/listadoServiciosExpediente', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoServiciosExpediente.html',
            controller: 'listadoServiciosExpedienteCtrl'
        })
		
		.when('/listadoBusesFacturar', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoBusesFacturar.html',
            controller: 'listadoBusesFacturarCtrl'
        })
		.when('/listadoBusesFacturados', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoBusesFacturados.html',
            controller: 'listadoBusesFacturadosCtrl'
        })
		.when('/listadoServiciosFacturar', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoServiciosFacturar.html',
            controller: 'listadoServiciosFacturarCtrl'
        })
		.when('/listadoServiciosFacturados', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoServiciosFacturados.html',
            controller: 'listadoServiciosFacturadosCtrl'
        })
		.when('/listadoDocumentos', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoDocumentos.html',
            controller: 'listadoDocumentosCtrl'
        })
		.when('/listadoHeadPhones', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoHeadPhones.html',
            controller: 'listadoHeadPhonesCtrl'
        })
		.when('/listadoHeadPhonesFacturar', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoHeadPhonesFacturar.html',
            controller: 'listadoHeadPhonesFacturarCtrl'
        })
		.when('/listadoHeadPhonesFacturados', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoHeadPhonesFacturados.html',
            controller: 'listadoHeadPhonesFacturadosCtrl'
        })
		.when('/listadoSeguros', {
            templateUrl: '/js/angularApps/proveedores/Views/listadoSeguros.html',
            controller: 'listadoSegurosCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
])
// .config(function($httpProvider){
    // var interceptor = ['$window', '$q', function ($window, $q) {
        // return {
            // 'responseError': function (rejection) {
                // if(rejection.status === 401){
                    // $window.location.href = window.spt.loginUrl;
                // }else{
                    // return $q.reject(rejection);
                // }
            // }
        // };
    // }];
    // $httpProvider.interceptors.push(interceptor);
// })
.run(['$rootScope','$cookies','token', function($rootScope,$cookies,token) {
    var tk  = window.tk =  $cookies.sptProveedor;
    if(tk){
        token.setToken(tk);
    }else{
        window.location.href = window.spt.loginUrl;
    }
}]);
