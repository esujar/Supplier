angular.module("app").controller("listadoServiciosExpedienteCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        $scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;

        $scope.model.startingDateFilter = new Date().getTime(); // fix para directiva datepicker rota
		$scope.model.endingDateFilter = new Date().setDate(new Date().getDate()+60);
		
		$scope.model.aServiciosExpediente = [];
		
        $scope.removeItemFromArray = function (array, uid) {
            var idx = _.findIndex(array || [], { uid: uid });
            array.splice(idx, 1);
            return idx;
        }

        //SVC Call 
        //Listado De Emision
        $scope.updateItemFromArray = function (array, uid, item) {
            var idx = $scope.removeItemFromArray(array, uid);
            array.splice(idx, 0, item);
        }

       


        $scope.obtenerListadoServiciosExpediente = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			var fInicio = $filter('date')($scope.model.startingDateFilter, 'yyyy-MM-dd');
			var fFin = $filter('date')($scope.model.endingDateFilter, 'yyyy-MM-dd');
			

            proveedoresSvc.obtenerListadoServiciosExpediente(fInicio, fFin).then(
                function (rsp) {
                    
                    $scope.tablaServiciosExpediente.datos = rsp.data.servicios;
                    $scope.model.aServiciosExpediente = rsp.data.servicios;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		
		
		
        $scope.confirmarServiciosExpediente = function ($event) {
			if (!$scope.tablaServiciosExpediente.seleccionadas.length){window.alert('Select one row'); return;}
			
			var listIdentificadoresPlanilla= $.map($scope.tablaServiciosExpediente.seleccionadas || [], function (o, i) { return o.idServicioExpediente; }).join(","); 
			var listIdentificadoresServicios = $.map($scope.tablaServiciosExpediente.seleccionadas || [], function (o, i) { return o.idServicioExpediente; }).join(",");
			var idProveedor=$scope.model.idProveedor;
			var usuario=$scope.model.usuario;
			
            proveedoresSvc.confirmarServiciosExpediente(listIdentificadoresPlanilla, listIdentificadoresServicios, usuario).then(
                function (rsp) {
                     $scope.obtenerListadoServiciosExpediente();
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		
		$scope.openCambiarProveedor = function () {
			if (!$scope.tablaServiciosExpediente.seleccionadas.length){window.alert('Select one ore more row'); return;}
			var listCiudades= $.map($scope.tablaServiciosExpediente.seleccionadas || [], function (o, i) { return o.idCiudad; })
			
			if (_.uniq(listCiudades,function(element) { return {a:element.idCiudad, b:element.idCiudad} }).length > 1)
				{window.alert('You Can´t select different cities.'); return;}
			
			var listIdentificadoresPlanilla= $.map($scope.tablaServiciosExpediente.seleccionadas || [], function (o, i) { return o.idServicioExpediente; }).join(","); 
			var listIdentificadoresServicios = $.map($scope.tablaServiciosExpediente.seleccionadas || [], function (o, i) { return o.idServicioExpediente; }).join(",");
			var idProveedor=$scope.model.idProveedor;
			var usuario=$scope.model.usuario;
			
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalCambiarPrestatarioExpediente.html',
                controller: 'modalCambiarPrestatarioExpedienteCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            listIdentificadoresPlanilla: listIdentificadoresPlanilla,
							listIdentificadoresServicios : listIdentificadoresServicios,
							idProveedor: $scope.model.idProveedor,
							usuario: $scope.model.usuario,
							idCiudad: listCiudades[0],
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.modelTrf.costePresupuesto = rsp.costeProveedor;
				$scope.model.refreshTrf = true;

            });

        };
		
		$scope.gotoRoomingList = function () {
			if ($scope.tablaServiciosExpediente.seleccionadas.length!=1){window.alert('Select only one row'); return;}
			
			var seleccionada = $scope.tablaServiciosExpediente.seleccionadas[0];
			
			
			if (seleccionada.idReservaServicio == 0){
				 $location.path("/roomingList/exp/"+seleccionada.idExpediente+"/" + seleccionada.idPrestatario + "/" + 
				 $filter('date')(seleccionada.fechaInicio, 'yyyy-MM-dd') + "/" + seleccionada.tipo);
			
				
			}else{
				 $location.path("/roomingList/srv/"+seleccionada.idReservaServicio);
				
			}
			

        };
		
		
		

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		$scope.exportarPDF = function ($event) {
		if ($scope.tablaServiciosExpediente.filtradas.length==0) return;
		
		var arrayExport = new kendo.data.Query($scope.tablaServiciosExpediente.filtradas).sort($scope.tablaServiciosExpediente.widget.dataSource.sort() || {}).data;
		
		
		$scope.model.aServiciosExpediente = arrayExport;
		docSvc.exportarListaServiciosExpediente($scope);
            
        };
		
		$scope.exportarExcel = function($event){
			$scope.tablaServiciosExpediente.widget.saveAsExcel();
		
		}
		

        $scope.tablaServiciosExpediente = {
			uid: "tablaServiciosExpediente",
			mantenerEstado: true,
            configuracion: {
                pageable: { pageSize: 100, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "multiple",//"single", onSelect: openDetalleReserva,
                scrollable: true, height: $window.innerHeight-235,
                toolbar: false,
				excel: { fileName: "exp_list.xlsx", allPages: true },
                columns: [
                    { field: "servicioNombre", type: "string", title: "service", width: 60 },
					// { field: "proveedorNombre", type: "string", title: "supplier", width: 60 },
                    { field: "fechaInicio", type: "date", format: "{0:dd/MMM/yyyy}", title: "date from", width: 49 },
					{ field: "fechaFin", type: "date", format: "{0:dd/MMM/yyyy}", title: "date to", width: 49 },
					{ field: "tipo", type: "string", title: "type", width: 35 },
					{ field: "ciudadNombre", type: "string", title: "city", width: 50 },
					{ field: "codigoStatus", type: "string", title: "status srv", width: 35 },
					{ field: "pasajerosSgl", type: "number", title: "sgl", width: 35, template: "#=pasajerosSgl == 0 || pasajerosSgl == null? '' : pasajerosSgl#", attributes: { "class": "text-right" }  },
					{ field: "pasajerosDbl", type: "number", title: "dbl", width: 35, template: "#=pasajerosDbl == 0 || pasajerosDbl == null? '' : pasajerosDbl#", attributes: { "class": "text-right" } },
					{ field: "pasajerosTpl", type: "number", title: "tpl", width: 35, template: "#=pasajerosTpl == 0 || pasajerosTpl == null? '' : pasajerosTpl#", attributes: { "class": "text-right" } },
					{ field: "pasajerosTotal", type: "string", title: "ttl pax", width: 40, template: "#=pasajerosTotal==null ? '' : pasajerosTotal   +  (choferGuia != 0 ? '&nbsp;+&nbsp;' + choferGuia : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') #", attributes: { "class": "text-right" } },
					{ field: "expedienteNombre", type: "string", title: "exp", width: 40, attributes: { "class": "text-right" } },
					{ field: "modificacionPax", type: "string", title: "Mod Pax", width: 40 },
					{ field: "nocheExtraShow", type: "string", title: "Ext Night", width: 40 },
					{ field: "prestatario", type: "string", title: "Supplier", width: 70 },
					{ field: "inicialesControlEnvio", type: "string", title: "status man", width: 40, template: "#= modificacionPax == 'S' ? '<div class=\\'col-xs-12 ctrlEnvio-0\\'>' + inicialesControlEnvio +'</div>' : '<div class=\\'col-xs-12 ctrlEnvio-' + controlEnvio +' \\'>' + inicialesControlEnvio +'</div>'#" }, //<div class=\'col-xs-12 ctrlEnvio-controlEnvio\'>inicialesControlEnvio</div>
                ]
            },
           




        }

      
        //Main
       
        $scope.obtenerListadoServiciosExpediente();
        
        
        
      
    }
]);

