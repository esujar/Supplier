angular.module("app").controller("listadoServiciosFacturadosCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

         $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		
		$scope.model.aFacturasDetalle = [];
		$scope.model.aServicios = [];
		
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
        $scope.obtenerListadoFacturasServicios = function ($event) {
            proveedoresSvc.obtenerListadoFacturasServicios().then(
                function (rsp) {
                    $scope.tablaServicios.datos = rsp.data.facturas; 
					$scope.model.aFacturasDetalle = rsp.data.facturasDetalle; 
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
        
		$scope.exportarPDF = function ($event) {
            
			//if ($scope.model.aTraslados.length==0) return;
			if ($scope.tablaServicios.filtradas.length==0) return;
			$scope.model.aServicios = $scope.tablaServicios.filtradas;
            docSvc.exportarListaServiciosFacturados($scope);
            
        };
		
		
		 $scope.mostrarDetalleFactura = function () {
			if (!$scope.tablaServicios.seleccionadas.length){window.alert('Select one row '); return;}
			
			//var aDatosDetalles = _.first($scope.model.aFacturasDetalle,{idGestionTrasladoFacturaProveedor:$scope.tablaServicios.seleccionadas[0].idGestionTrasladoFacturaProveedor}) || [];
			
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalDetalleServicioFactura.html',
                controller: 'modalDetalleServicioFacturaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.tablaServicios.seleccionadas[0].facturasDetalle,
                            numeroFactura: $scope.tablaServicios.seleccionadas[0].numero,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				

            });



        };
		
		
		 $scope.eliminarFactura = function ($event) {
			if (!window.confirm("selected invoice will be delete, are you sure?")) {return;}
			
			//if ($scope.tablaServicios.seleccionadas[0].count > 1) window.alert('You only can delete one invoice at once.');
			
            proveedoresSvc.eliminarFacturaServicios($scope.tablaServicios.seleccionadas[0].idGestionTrasladoFacturaProveedor).then(
                function (rsp) {
                    
					$scope.removeItemFromArray($scope.tablaServicios.datos, $scope.tablaServicios.seleccionadas[0].uid);
					 
					
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
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
                selectable: "single", 
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                columns: [
				     { field: "numero", type: "string", title: "invoice", width: 35},
					{ field: "importe", type: "number", title: "cost", width: 30, attributes: { "class": "text-right" }, format: "{0:#,##0.00}" },
					{ field: "moneda", type: "number", title: "currency", width: 30 },
					 { field: "fecha", type: "date", format: "{0:dd/MM/yyyy}", title: "invoice date", width: 49 },
					{ field: "aprobada", type: "string", title: "status", width: 40 },
					 { field: "aprobadaFecha", type: "date", format: "{0:dd/MM/yyyy}", title: "confirm date", width: 49 },
					  { field: "fechaPagoPrevisto", type: "date", format: "{0:dd/MM/yyyy}", title: "pay date", width: 49 },
                    
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
       $scope.obtenerListadoFacturasServicios();
        
      
    }
]);

