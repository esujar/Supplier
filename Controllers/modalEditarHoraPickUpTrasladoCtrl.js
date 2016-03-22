
angular.module("app").controller("modalEditarHoraPickUpTrasladoCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
			if ($scope.model.horaRecogida) if ($scope.model.horaRecogida.length == 5) $scope.model.horaRecogida += ":00";
			
			proveedoresSvc.editarTrasladoPickUp($scope.model.idReserva,  $scope.model.idReservaServicio, $scope.model.horaRecogida, $scope.model.usuario).then(
				function (rsp) {

					$modalInstance.close(rsp);
				},
				function (msg) {
					//window.alert(msg);
				}
			);
            
        };

       
        
        //Init model vars
        $scope.model = {};
		
		
        
		$scope.model.horaRecogida = parent.data.horaHasta;
		$scope.model.idReserva = parent.data.idReserva;
		$scope.model.idReservaServicio = parent.data.idReservaServicio;
			
		$scope.model.usuario = parent.usuario;
        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);