
angular.module("app").controller("modalGenerarFacturaHeadPhonesCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.facturarHeadPhones($scope.model.listIdentificadoresDetalle, $scope.model.numeroFactura, $filter('date')($scope.model.fechaFactura, "yyyy-MM-dd")).then(
                    function (rsp) {

                        $modalInstance.close($scope.model);
                    },
                    function (msg) {
                        //window.alert(msg);
                    }
                );
            
        };
		
		
       
        
        //Init model vars
        $scope.model = {};
		$scope.model.listIdentificadoresDetalle = parent.listIdentificadoresDetalle;
		$scope.model.idProveedor = parent.idProveedor;
		//$scope.model.costeFactura = parent.costeFactura;
		$scope.model.numeroFactura = null;
		$scope.model.fechaFactura = new Date().toISOString().substring(0, 10);
		
		
        $scope.model.submit = false;
        
		
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);