
angular.module("app").controller("modalDetalleBusCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
		
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
				if (!$scope.model.dataBus){
					proveedoresSvc.crearBus($scope.model.dataBus.matricula, $scope.model.dataBus.plazas).then(
						function (rsp) {

							$modalInstance.close(rsp);
						},
						function (msg) {
							//window.alert(msg);
						}
					);
				}else{
					proveedoresSvc.editarBus($scope.model.dataBus.idGestionCircuitosBuses, $scope.model.dataBus.matricula, $scope.model.dataBus.plazas).then(
						function (rsp) {

							$modalInstance.close($scope.model);
						},
						function (msg) {
							//window.alert(msg);
						}
					);
				
				}
        };

       
        
        //Init model vars
        $scope.model = {};
		$scope.model.dataBus = parent.data
		
		$scope.model.aProveedores = parent.aProveedores;
		$scope.obtenerListadoProveedores();
		
		
		
        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);