
angular.module("app").controller("modalEditarCosteTrasladoCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.editarCoste($scope.model.idGestionTrasladosPeticion,  $scope.model.idReservaServicio, $scope.model.costeProveedor, $scope.model.usuario, $scope.model.observaciones, $scope.model.moneda).then(
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
		
		$scope.model.idGestionTrasladosPeticion = $scope.model.dataTrf.tipoGestionTrf == "G"? $scope.model.dataTrf.codTrf : null;
		$scope.model.idReservaServicio = $scope.model.dataTrf.tipoGestionTrf == "F"? $scope.model.dataTrf.codTrf : null;
		$scope.model.costeProveedor = $scope.model.dataTrf.costeTrf;
		$scope.model.moneda = $scope.model.dataTrf.moneda;
		
		$scope.model.aMonedas = [{codigo:"EUR",titulo:"euro"}, {codigo:"USD",titulo:"dolar estadounidense"}, {codigo:"GBP",titulo:"libra esterlina"}, {codigo:"CHF",titulo:"franco suizo"}, {codigo:"DKK",titulo:"corona danesa"}, {codigo:"NOK",titulo:"corona noruega"}, {codigo:"SEK",titulo:"corona sueca"}, {codigo:"CZK",titulo:"corona checa"}, {codigo:"PLN",titulo:"zloty polaco"}, {codigo:"HUF",titulo:"florín húngaro"}, {codigo:"HRK",titulo:"kuna croata"}, {codigo:"RUB",titulo:"rublo ruso"}];
		
		
		
        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);