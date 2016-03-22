
angular.module("app").controller("modalEditarCosteHeadPhonesCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.modificarPrecioHeadPhone($scope.model.idGestionHdph, $scope.model.costeProveedor, $scope.model.observacionesProveedor).then(
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
		$scope.model.idProveedor = parent.idProveedor;
		$scope.model.idGestionHdph = parent.idGestionHdph;
		
		$scope.model.aMonedas = [{codigo:"EUR",titulo:"euro"}, {codigo:"USD",titulo:"dolar estadounidense"}, {codigo:"GBP",titulo:"libra esterlina"}, {codigo:"CHF",titulo:"franco suizo"}, {codigo:"DKK",titulo:"corona danesa"}, {codigo:"NOK",titulo:"corona noruega"}, {codigo:"SEK",titulo:"corona sueca"}, {codigo:"CZK",titulo:"corona checa"}, {codigo:"PLN",titulo:"zloty polaco"}, {codigo:"HUF",titulo:"florín húngaro"}, {codigo:"HRK",titulo:"kuna croata"}, {codigo:"RUB",titulo:"rublo ruso"}];
		
        $scope.model.submit = false;
        

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);