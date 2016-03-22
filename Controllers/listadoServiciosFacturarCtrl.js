angular.module("app").controller("listadoServiciosFacturarCtrl", [
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
                    $scope.tablaServicios.datos = rsp.data.listaServicioPteFacturar;
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
			
			
			var aMonedas = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.inicialesMoneda; });
			
			if (_.uniq(aMonedas, true).length> 1){window.alert('You can´t generate invoice for services with different currencies.'); return;}
			
			var listaServicios = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.listaServicios; }).join(",");
			var listaServiciosExtra = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.listaServiciosExtra; }).join(",");
			
			if (listaServicios.length > 8000 || listaServiciosExtra.length > 8000) {window.alert('You can´t generate invoice for all these services. Please, select less services.'); return;}

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalGenerarFacturaServicio.html',
                controller: 'modalGenerarFacturaServicioCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            listaServicios: listaServicios,
							listaServiciosExtra: listaServiciosExtra,
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					
					// //Remove from datatable
					_.forEach($scope.tablaServicios.seleccionadas, function (value, index) {
						$scope.removeItemFromArray($scope.tablaServicios.datos, value['uid']);
					});
				}

            });



        };
		
		 
		
		
		
		
		
        $scope.tablaServicios = {
            configuracion: {
                pageable: { pageSize: 400, buttonCount: 10 },
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
				    { field: "idTraslado", type: "string", title: "trf id", width: 35  },
					{ field: "tipoTraslado", type: "string", title: "type", width: 25 },
                    { field: "importeServicio", type: "number", title: "cost", width: 35, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "inicialesMoneda", type: "string", title: "currency", width: 30},
                    { field: "nombreCiudad", type: "string", title: "city", width: 45  },
					{ field: "fechaServicio", type: "date", title: "date", width: 45, format: "{0:dd/MMM/yyyy}" },
					{ field: "rangoHorasTraslado", type: "string", title: "time range", width: 35 },
					{ field: "totalPasajeros", type: "number", title: "tot pax", width: 30, attributes: { "class": "text-right" } },
					//{ field: "listServicios", type: "string", title: "services", width: 50  },
					{ field: "observaciones", type: "string", title: "rmks", width: 75  },
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
       $scope.obtenerListadoServiciosPendienteFacturar();
        
      
    }
]);

