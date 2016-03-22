
angular.module("app").controller("modalDetalleServicioFacturaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "excel","parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, excel, parent, token) {
        
		
		$scope.generarDatosExcel = function(){
		     _.forEach($scope.model.aDatos, function (value, index) {
					var item = {
						importeDetalle: "",
						inicialesMoneda: "",
						nombreCiudad: "",
						tipo: "",
						fechaTraslado:"",
						horaTraslado:"",
						totalPax:"",
						observaciones:"",
						
					};
					
					item.importeDetalle = value['importeDetalle'];
					item.inicialesMoneda= value['inicialesMoneda'];
					item.nombreCiudad= value['nombreCiudad'];
					item.tipo= value['tipo'];
					item.fechaTraslado= $filter('date')(value['fechaTraslado'], 'dd/MM/yyyy');
					item.horaTraslado= $filter('date')(value['horaTraslado'], 'HH:mm');
					item.totalPax= value['totalPax'];
					item.observaciones= value['observaciones'];
			 	
					$scope.model.aDatosExcel.push(item);
			});
		
		
		}
		
		$scope.tablaServicios = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: true,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: false,
                scrollable: true, height: 150,
                toolbar: false,
                columns: [
                     { field: "importeDetalle", type: "number", title: "cost", width: 30, attributes: { "class": "text-right" }, format: "{0:#,##0.00}" },
					 { field: "inicialesMoneda", type: "string", title: "currency", width: 20 },
					 { field: "nombreCiudad", type: "string", title: "city", width: 60 },
					 { field: "tipo", type: "string", title: "type", width: 60 },
					 { field: "fechaTraslado", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
					 { field: "horaTraslado", type: "date", title: "hour", width: 30, format: "{0:HH:mm}" },
					 { field: "totalPax", type: "number", title: "pax", width: 30, },
					 { field: "observaciones", type: "string", title: "remarks", width: 80 },
					
                ]
            },
            contextual: [
               
                    
                   
            ]




        }
		
		
		
		$scope.exportarExcel = function(){
			var aCabecera = ["cost", "currency", "city", "type", "date", "hour", "pax", "remarks"];
			excel.generar(aCabecera, $scope.model.aDatosExcel, "details_" +  $scope.model.numeroFactura + "_services_invoiced", token.getToken());
		
		}
       
        
        //Init model vars
        $scope.model = {};
		$scope.model.aDatos = parent.data;
		$scope.model.numeroFactura = parent.numeroFactura;
		$scope.tablaServicios.datos = $scope.model.aDatos;
		
		$scope.model.aDatosExcel = [];
		$scope.generarDatosExcel();
		

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);