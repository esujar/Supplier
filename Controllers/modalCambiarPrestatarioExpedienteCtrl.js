
angular.module("app").controller("modalCambiarPrestatarioExpedienteCtrl", [
    "$scope",  "$rootScope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $rootScope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
        $scope.ok = function () {
            if (!$scope.tablaProveedores.seleccionadas.length){window.alert('Select one row'); return;}
           
			proveedoresSvc.cambiarPrestatarioServiciosExpediente($scope.model.listIdentificadoresPlanilla, $scope.model.listIdentificadoresServicios, $scope.model.idPrestatario, $scope.model.usuario).then(
				function (rsp) {
					
					$modalInstance.close($scope.model);
				},
				function (msg) {
					//window.alert(msg);
				}
			);
            
        };

       
		 // $scope.obtenerListadoProveedores = function ($event) {
			

            // proveedoresSvc.obtenerMaestroProveedores().then(
                // function (rsp) {
                    
                    // $scope.tablaProveedores.datos = rsp.data.proveedores;

                // },
                // function (msg) {
                    // //window.alert(msg);
                // }
            // );
        // };
		
		

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
		
		$scope.tablaProveedores = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single",
                scrollable: true, height: 200,
                toolbar: false,
                columns: [
                    { field: "nombreProveedor", type: "string", title: "supplier", width: 100 }
					
                ]
            },
           
        }
		
		 //Init model vars
		$scope.model = {};
		$scope.model.listIdentificadoresPlanilla = parent.listIdentificadoresPlanilla;
		$scope.model.listIdentificadoresServicios = parent.listIdentificadoresServicios;
		$scope.model.idProveedor = parent.idProveedor;
		$scope.model.idCiudad = parent.idCiudad;
		$scope.model.idPrestatario = "";
		$scope.model.usuario = parent.usuario;
		
		//$scope.obtenerListadoProveedores();
		if (!$rootScope.proveedores){
			proveedoresSvc.obtenerMaestroProveedores().then(function (rsp){$rootScope.proveedores = rsp.data.proveedores});
		}
		$scope.tablaProveedores.datos = _.filter($rootScope.proveedores, function(element){ element.idCiudad = $scope.model.idCiudad}); 
    }
]);