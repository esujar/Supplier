
angular.module("app").controller("modalDocumentosReservaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
       
        
        //Init model vars
        $scope.model = {};
        $scope.model.idProveedor = parent.idProveedor;
		$scope.model.idReserva = parent.idReserva;
        
         $scope.obtenerListadoDocumentos = function ($event) {
            var idProveedor = parent.idProveedor;
			var idReserva = parent.idReserva;
			var tipoSrv = '';
			var tipoStatus = 'total';

            proveedoresSvc.obtenerListadoServiciosReserva(idReserva, tipoSrv, tipoStatus).then(
                function (rsp) {
                    
                    $scope.tablaDocumentos.datos = rsp.data.proveedoresServiciosReserva;
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
        
		$scope.tablaDocumentos = {
            configuracion: {
                pageable: { pageSize: 50, buttonCount: 10 },
                sortable: true,
                filterable: false,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: false,
                scrollable: true, height: 150,
                toolbar: false,
                columns: [
                    { field: "esPrincipal", type: "string", title: "document", width: 60 },
                    { field: "trato", type: "string", title: "owner", width: 40 },
                    { field: "nombreCompleto", type: "string", title: "type", width: 60 },
					{ field: "distribucion", type: "string", title: "date", width: 60 },
					
					
                ]
            },
            contextual: [
            ]
        }
        
       $scope.obtenerListadoDocumentos();
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);