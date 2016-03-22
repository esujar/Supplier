angular.module("app").controller("roomingListCtrl", [
    "$q","$scope", "$route", "$routeParams", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc", "docSvc",
    function ($q, $scope, $route, $routeParams, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc) {

        $scope.m = {
            tipoInforme: $routeParams.tipoInforme,
            cabecera: null,
            informe: null
        };

        var prms = [proveedoresSvc.obtenerCabeceraExpediente($routeParams.id)];
        switch ($scope.m.tipoInforme) {
            case "exp":
                prms.push(proveedoresSvc.obtenerRoomingListExpediente($routeParams.id, $routeParams.idPrestatario || null, $routeParams.fecha ? $routeParams.fecha : null, $routeParams.tipoServicio || null));
                break;
            case "srv":
                prms.push(proveedoresSvc.obtenerRoomingListServicio($routeParams.id));
                break;
         
        }

        $q.all(prms).then(function (rsps) {
            $scope.m.cabecera = rsps[0].data.expedientes[0];
            $scope.m.informe = rsps[1].data.prestatarios;
        });

        $scope.volver = function () {
            $window.history.back();
        };
		
		$scope.exportarPDF = function ($event) {
            docSvc.exportarRoomingListExpediente($scope);
            
        };
       
    }
]);
