angular.module("app").controller("listadoSegurosCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		
		
        $scope.removeItemFromArray = function (array, uid) {
            var idx = _.findIndex(array || [], { uid: uid });
            array.splice(idx, 1);
            return idx;
        }

        
        $scope.updateItemFromArray = function (array, uid, item) {
            var idx = $scope.removeItemFromArray(array, uid);
            array.splice(idx, 0, item);
        }

		//SVC Call 
        $scope.obtenerListadoSeguros = function ($event) {
            proveedoresSvc.obtenerListadoSeguros().then(
                function (rsp) {
                    $scope.tablaSeguros.datos = rsp.data.seguros;
					
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

		$scope.exportarExcel = function($event){
			$scope.tablaSeguros.widget.saveAsExcel();
		
		}
        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		
		
        $scope.tablaSeguros = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: false, 
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
				excel: { fileName: "insuranceList.xlsx", allPages: true },
                columns: [
                    { field: "nombreSeguro", type: "string", title: "insurance", width: 90},
					{ field: "idReserva", type: "number", title: "id Spt", width: 30 },
					{ field: "fechaInicio", type: "date", title: "start date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "fechaFinal", type: "date", title: "end date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "apellidoPasajero", type: "string", title: "surname", width: 70 },
					{ field: "nombrePasajero", type: "string", title: "first name", width: 50 },
					
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
       $scope.obtenerListadoSeguros();
        
      
    }
]);

