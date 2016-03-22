angular.module("app").controller("listadoFacturasPendientesCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

         $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		
		
        $scope.removeItemFromArray = function (array, uid) {
            var idx = _.findIndex(array || [], { uid: uid });
            array.splice(idx, 1);
            return idx;
        }

        
        $scope.updateItemFromArray = function (array, uid, item) {
            var idx = $scope.removeItemFromArray(array, uid);
            array.splice(idx, 0, item);
        }

		//SVC Call 
        $scope.obtenerListadoServiciosPendienteFacturar = function ($event) {
            proveedoresSvc.obtenerListadoServiciosPendienteFacturar().then(
                function (rsp) {
                    $scope.tablaServicios.datos = rsp.data.busesAlquileres;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		 $scope.openGenerarFactura = function () {
			if (!$scope.tablaServicios.seleccionadas.length){window.alert('Select one row or more'); return;}
			
			var listServicios = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.idReservaServicio; }).join(",");
			var listaServiciosExtra = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.idReservaServicio; }).join(",");

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalGenerarFacturaServicio.html',
                controller: 'modalGenerarFacturaServicioCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            listServicios: listServicios,
							listaServiciosExtra: listaServiciosExtra,
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					
					// //Remove from datatable
					_.forEach($scope.tablaBuses.seleccionadas, function (value, index) {
						$scope.removeItemFromArray($scope.tablaBuses.datos, value['uid']);
					});
				}

            });



        };
		
		 
		
		
		
		
		
        $scope.tablaServicios = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "multiple", 
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                columns: [
                    { field: "matricula", type: "string", title: "plate", width: 35},
                    { field: "nombreCiudadInicio", type: "string", title: "city start", width: 35  },
					{ field: "nombreCiudadFin", type: "string", title: "city end", width: 30 },
					{ field: "nombreExpediente", type: "string", title: "exp", width: 30 },
					{ field: "fechaInicio", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "totalDias", type: "number", title: "tot days", width: 40, attributes: { "class": "text-right" } },
					{ field: "totalPasajeros", type: "number", title: "tot pax", width: 40, attributes: { "class": "text-right" } },
					{ field: "destinoSerie", type: "string", title: "destiny", width: 30 },
					{ field: "totalKilometros", type: "number", title: "tot km", width: 40, attributes: { "class": "text-right" } },
					{ field: "netoTotalKilometros", type: "number", title: "net km", width: 40, attributes: { "class": "text-right" } },
					{ field: "netoPeajes", type: "number", title: "net toll", width: 40, attributes: { "class": "text-right" } },
					{ field: "netoSuplementosExtras", type: "number", title: "net ext", width: 40, attributes: { "class": "text-right" } },
					{ field: "netoTotalDetalle", type: "number", title: "net tot", width: 40, attributes: { "class": "text-right" } },
					
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
       $scope.obtenerListadoServiciosPendienteFacturar();
        
      
    }
]);

