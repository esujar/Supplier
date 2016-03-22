
angular.module("app").controller("modalEditarHoraTrasladoCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
			if ($scope.model.horaDesde) if ($scope.model.horaDesde.length == 5) $scope.model.horaDesde += ":00";
			if ($scope.model.horaHasta) if ($scope.model.horaHasta.length == 5) $scope.model.horaHasta += ":00";
			
			if ($scope.model.horaDesde > $scope.model.horaHasta ){window.alert('time To to must be older than time From')};
			
			var statusServicio = null;
			
			
			proveedoresSvc.editarTraslado($scope.model.idGestionTrasladosPeticion, $scope.model.idReservaServicio, $scope.model.usuario, statusServicio, $scope.model.horaDesde, $scope.model.horaHasta).then(
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
		$scope.model.dataTrf = parent.data
		$scope.model.usuario = parent.usuario;
		$scope.model.idProveedor = parent.idProveedor;
		
		
		$scope.model.idGestionTrasladosPeticion = $scope.model.dataTrf.tipoGestionTrf == "G"? $scope.model.dataTrf.codTrf : null;
		$scope.model.idReservaServicio = $scope.model.dataTrf.tipoGestionTrf == "F"? $scope.model.dataTrf.codTrf : null;
		$scope.model.horaDesde = $scope.model.dataTrf.horaDesde;
		$scope.model.horaHasta = $scope.model.dataTrf.horaHasta;
		
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);