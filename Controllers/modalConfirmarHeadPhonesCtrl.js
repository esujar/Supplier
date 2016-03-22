
angular.module("app").controller("modalConfirmarHeadPhonesCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.confirmarHeadPhoneMulti($scope.model.listIdGestionHdph, $scope.model.observacionesProveedor).then(
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
		$scope.model.listIdGestionHdph = parent.listIdGestionHdph;
		$scope.model.observacionesProveedor = null;
		
		
        $scope.model.submit = false;
        
		
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);