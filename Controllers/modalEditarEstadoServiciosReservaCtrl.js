angular.module("app").controller("modalEditarEstadoServiciosReservaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$modal", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $modal, $filter, proveedoresSvc, parent, token) {

        $scope.model = {};
		$scope.modelRsv = {};
        $scope.modelSrv = {};
        
		$scope.model.idReserva = parent.idReserva;
		$scope.model.mode = parent.mode;
		$scope.model.idProveedor = token.getDecodedPayload().id;
        $scope.model.actStatus = $scope.model.mode == "CNF" ? "RQ" : "CLX-RQ";
		$scope.model.tipoCalendario = null;
		$scope.model.textoCalendario = null;
		$scope.model.opc = $scope.model.mode == "CNF" ? "Confirm" : "Cancel";
		
		$scope.model.aTiposCalendario = parent.aTiposCalendario;
		
		
		 $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //SVC Call 
        

         $scope.ok = function () {
		    if (!$scope.tablaServicios.seleccionadas.length){window.alert('select at least one row'); return;}
			 if (!window.confirm("selected services will pass to '" + ($scope.model.mode == "CNF" ? "confirmed" : "cancelled") + "' status, are you sure?")) return;
			
            var aIdSrv = $.map($scope.tablaServicios.seleccionadas || [], function (o, i) { return o.idReservaServicio; })
			var idReservaServicio = null;
			
			proveedoresSvc.editarEstadoServicio($scope.model.idReserva, $scope.model.actStatus, $scope.model.textoCalendario, idReservaServicio,  $scope.model.tipoCalendario, aIdSrv.join(",")).then(
				function (rsp) {

					$modalInstance.close(rsp);
				},
				function (msg) {
					//window.alert(msg);
				}
			);
            
        };
		

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    
         
		 
		

          $scope.tablaServicios = {
            configuracion: {
                pageable: { pageSize: 50, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "multiple",
                scrollable: true, height: 200,
                toolbar: false,
                columns: [
                    { field: "tipoReserva", type: "string", title: "service", width: 50 },
                    { field: "codigoStatus", type: "string", title: "status", width: 35 },//values: [{ value: '', text: "" }, { value: 'OK', text: "confirmed" }, { value: 'RQ', text: "pending confirmation" }, { value: 'CLX', text: "cancelled" }]
                    { field: "ciudadInicio", type: "string", title: "city in", width: 50 },
				    { field: "fechaInicio", type: "date", format: "{0:dd/MM/yyyy}", title: "date in", width: 49 },
					{ field: "ciudadFin", type: "string", title: "city out", width: 80 },
					{ field: "fechaFin", type: "date", format: "{0:dd/MM/yyyy}", title: "date out", width: 49 },
					{ field: "prestatario", type: "string", title: "supplier", width: 80 },
					{ field: "sgl", type: "string", title: "sgl", width: 35 },
					{ field: "dbl", type: "string", title: "dbl", width: 35 },
					{ field: "tpl", type: "string", title: "tpl", width: 35 },
					{ field: "totalPax", type: "number", title: "pax", width: 35 },
					
                ]
            },
            contextual: [
                // {
                    // texto: "details",
                    // icono: "icon-search",
                    // accion: function () {
						// $scope.modelSrv = $scope.tablaServicios.clicada;
						// $scope.modelSrv.fechaVueloView = $filter('date')($scope.modelSrv.fechaVuelo, "dd/MM/yyyy");
                        // $scope.tablaPax.datos = $scope.obtenerListadoPax($scope.tablaServicios.clicada);
                    // },

                // },
				
               
                    
                   
            ]




        }
		var aServicios = _.cloneDeep(parent.data);
		
		_.remove(aServicios, function (currentObject) {
			return currentObject.codigoStatus != $scope.model.actStatus;
        });
		
		$scope.tablaServicios.datos = aServicios;
		

      
        //Main
       

        
        
        
      
    }
]);

