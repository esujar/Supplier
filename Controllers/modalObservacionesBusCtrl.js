
angular.module("app").controller("modalObservacionesBusCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
       
        
        //Init model vars
        $scope.model = {};
       
		$scope.model.aObservaciones = parent.aObservaciones;
		
		
				
		
		$scope.tablaObservaciones = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: false,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: false,
                scrollable: true, height: 175,
                toolbar: false,
                columns: [
					{ field: "observaciones", type: "string", title: "remarks", width: 200 },
                    
                ]
            },
            contextual: [
            ]
        }
        
	

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
		
		//Main
		//$scope.obtenerListadoObservaciones();
		$scope.tablaObservaciones.datos = $scope.model.aObservaciones;
    }
]);