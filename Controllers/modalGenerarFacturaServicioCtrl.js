
angular.module("app").controller("modalGenerarFacturaServicioCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.generarFacturaServicios($scope.model.listaServicios, $scope.model.listaServiciosExtra, $scope.model.numeroFactura, $filter('date')($scope.model.fechaFactura, "yyyy-MM-dd")).then(
                    function (rsp) {

                        $modalInstance.close($scope.model);
                    },
                    function (msg) {
                        //window.alert(msg);
                    }
                );
            
        };
		
		$scope.obtieneImporteFacturaServicios = function () {
          
                proveedoresSvc.obtieneImporteFacturaServicios($scope.model.listaServicios, $scope.model.listaServiciosExtra).then(
                    function (rsp) {

                        $scope.model.costeFactura = rsp.data.importeServicios[0].importeTotal + " " + rsp.data.importeServicios[0].codigoMoneda;
                    },
                    function (msg) {
                        //window.alert(msg);
                    }
                );
            
        };
       
        
        //Init model vars
        $scope.model = {};
		$scope.model.listaServicios = parent.listaServicios;
		$scope.model.listaServiciosExtra = parent.listaServiciosExtra;
		$scope.model.idProveedor = parent.idProveedor;
		$scope.model.numeroFactura = null;
		$scope.model.costeFactura = null;
		$scope.model.fechaFactura = new Date().toISOString().substring(0, 10);
		
		
		
		
		
		$scope.obtieneImporteFacturaServicios();
		
        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);