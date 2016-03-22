angular.module("app").controller("listadoBusesFacturadosCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		
		$scope.model.aFacturasDetalle = [];
		
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
        $scope.obtenerListadoFacturasBuses = function ($event) {
            proveedoresSvc.obtenerListadoFacturasBuses().then(
                function (rsp) {
                    $scope.tablaBuses.datos = rsp.data.busesAlquileresFacturas;
					$scope.model.aFacturasDetalle = rsp.data.busesAlquileresDetalle;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		 $scope.mostrarDetalleFactura = function () {
			if (!$scope.tablaBuses.seleccionadas.length){window.alert('Select one row '); return;}
			
			//var idx = _.findIndex($scope.model.aDatos || [], { idGestionBusesFacturasProveedores: $scope.tablaBuses.seleccionadas[0].idGestionBusesFacturasProveedores });
			
			//var aDatosDetalles = _.first($scope.model.aFacturasDetalle,{idGestionBusesFacturasProveedores:$scope.tablaBuses.seleccionadas[0].idGestionBusesFacturasProveedores}) || [];
			
			var aDatosDetalles = $scope.tablaBuses.seleccionadas[0].busesAlquileresDetalle;
			
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalDetalleBusFactura.html',
                controller: 'modalDetalleBusFacturaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            data: aDatosDetalles,
                            

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				

            });



        };
		
		 $scope.eliminarFactura = function () {
			if (!$scope.tablaBuses.seleccionadas.length){window.alert('Select one row '); return;}
			if(!window.confirm('¿Are you sure to delete the invoice?')){return;}
			proveedoresSvc.eliminarFacturaBus($scope.tablaBuses.seleccionadas[0].idGestionBusesFacturasProveedores).then(
                function (rsp) {
					$scope.removeItemFromArray($scope.tablaBuses.datos, $scope.tablaBuses.seleccionadas[0].uid);
                },
                function (msg) {
                    //window.alert(msg);
                }
            );



        };
		
        $scope.tablaBuses = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single", 
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                columns: [
                    { field: "numero", type: "string", title: "invoice", width: 35},
					{ field: "importe", type: "number", title: "cost", width: 30, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "fecha", type: "date", title: "invoice date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "estado", type: "string", title: "status", width: 40 },
					{ field: "aprobadaFecha", type: "date", title: "confirm date", width: 40, format: "{0:dd/MMM/yyyy}" },
					
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
       $scope.obtenerListadoFacturasBuses();
        
      
    }
]);

