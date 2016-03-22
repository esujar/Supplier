
angular.module("app").controller("modalCrearContactoReservaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
		
        $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
                proveedoresSvc.crearContacto($scope.model.idReserva, $scope.model.nombre, $scope.model.email, $scope.model.localizador).then(
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
		$scope.model.idReserva = parent.idReserva;
        
        
        

        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);