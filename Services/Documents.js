
angular.module('app')
.factory("docSvc", [
    "$q", "$http", "$templateCache", "$compile", "$timeout", "pdf",
    function ($q, $http, $templateCache, $compile, $timeout, pdf) {
        return {
            '_getTemplate': function (templateUrl) {
                var def = $q.defer();
                var template = $templateCache.get(templateUrl);
                if (typeof template === "undefined") {
                    $http.get(templateUrl).success(function (data) {
                        $templateCache.put(templateUrl, data);
                        def.resolve(data);
                    });
                } else {
                    def.resolve(template);
                }
                return def.promise;
            },
            
            'exportarListaTraslados': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/listaTraslados.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "transferList");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
			'exportarListaHoteles': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/listaHoteles.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "hotelList");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
			'exportarDetalleReserva': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/detalleReserva.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "booking_"+scope.modelRsv.idReserva+"_details");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
			'exportarListaServiciosExpediente': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/listaServiciosExpediente.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "exp_list");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
			'exportarRoomingListExpediente': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/roomingList.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "rooming_list");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
			
			'exportarListaServiciosFacturados': function (scope) {
                this._getTemplate("/js/angularApps/proveedores/Views/documentos/listaServiciosFacturados.html").then(function (template) {
                    var $html = $compile(template)(scope);
                    $timeout(function () {
                        pdf.generar($html.html(), "invoice_list");

                        //var w = window.open();
                        //$(w.document.body).html($html.html());
                    });
                });
            },
		
        };
    }
]);