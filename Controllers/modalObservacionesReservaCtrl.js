
angular.module("app").controller("modalObservacionesReservaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, parent, token) {
        
       
        
        //Init model vars
        $scope.model = {};
        $scope.model.idProveedor = parent.idProveedor;
		$scope.model.idReserva = parent.idReserva;
		$scope.model.submit = false;
		$scope.model.aTiposCalendario = parent.aTiposCalendario;
		$scope.model.aObservaciones = parent.aObservaciones;
		
		 $scope.removeItemFromArray = function (array, property) {
            var idx = _.findIndex(array || [], property);
            if (idx != -1) { array.splice(idx, 1); return true;}
            else return false;
        }
		
	     $scope.updateItemFromArray = function (array, property, item) {
            var idx = $scope.removeItemFromArray(array, property);
            array.splice(idx, 0, item);
        }
				
		
         $scope.obtenerListadoObservaciones = function ($event) {
            var idProveedor = parent.idProveedor;
			var idReserva = parent.idReserva;
			

            proveedoresSvc.obtenerListadoObservacionesReserva(idReserva).then(
                function (rsp) {
                    
                    $scope.tablaObservaciones.datos = rsp.data.observacionesReserva;
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
        
		$scope.tablaObservaciones = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: false,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single",
                scrollable: true, height: 175,
                toolbar: false,
				detailTemplate: function (parentRow) {
                    
                      return "" +
                          "<div style='width: 96%;'>" +
                          parentRow.descripcion +
                          "</div>";
                  },
                  detailExpand: function (kev) {
                      kev.sender.collapseRow($(".k-master-row", kev.sender.tbody).not(kev.masterRow)); //kev.sender.collapserow(".k-master-row:not([data-uid=" + kev.masterrow.data("uid") + "])");
                  },
                columns: [
					{ field: "fecha", type: "date", title: "date", width: 40, format: "{0:dd/MM/yyyy HH:mm}" },
                    { field: "ubicacion", type: "string", title: "type", width: 60, values: [{ value: 0, text: "Supplier" }, { value: 1, text: "Spt" }] },
					//{ field: "descripcionReservaCalendario", type: "string", title: "message", width: 100 },
                    { field: "codigoEstado", type: "string", title: "status", width: 40 },
					{ field: "validado", type: "number", title: "validated", width: 40, template: "<div class='col-xs-12' style='display:#=validado == 1 ? 'block': 'none' #'><span class='icon-checkmark'></span></div>" },
					{ field: "leido", type: "number", title: "is read", width: 40, template: "<div class='col-xs-12' style='display:#=leido == 1 ? 'block': 'none' #'><span class='icon-checkmark'></span></div>" },
					{ field: "mail", type: "number", title: "inf. mail", width: 40, template: "<div class='col-xs-12' style='display:#=mail == 1 ? 'block': 'none' #'><span class='icon-checkmark'></span></div>" },
                ]
            },
            contextual: [
            ]
        }
        
		$scope.ok = function (isInvalid) {
			$scope.model.submit = true;
			if (isInvalid) return;
			var newStatus = "NOTA";
			var idReservaServicio = null;
			var listaidSrv = null; 
			var textoCalendario = !$scope.model.textoCalendario ? "SIN NOTA" : token.getDecodedPayload().data.nombreProveedor + ":" + $scope.model.textoCalendario;
			
			proveedoresSvc.editarEstadoServicio($scope.model.idReserva, newStatus, textoCalendario, idReservaServicio, $scope.model.tipoCalendario, listaidSrv).then(
				function (rsp) {

					$scope.obtenerListadoObservaciones();
					
					$scope.resetForm();
				},
				function (msg) {
					//window.alert(msg);
				}
			);
            
        };
		
		
		
		$scope.editarObservacion = function (leido) {
			if (!$scope.tablaObservaciones.seleccionadas.length){window.alert('select one row'); return;}
			var idCalendario = $scope.tablaObservaciones.seleccionadas[0].idReservaCalendario;
			var usuario = token.getDecodedPayload().name;
			var idProveedor = token.getDecodedPayload().id;
			
			if (leido == 0 ){ if ($scope.tablaObservaciones.seleccionadas[0].validado == 1){ window.alert('This remark has been validated yet.'); return}}
			else{ if ($scope.tablaObservaciones.seleccionadas[0].leido == 1){ window.alert('This remark has been marked as read yet.'); return;}}
			
			
			proveedoresSvc.editarObservacionReserva(idCalendario, usuario, leido).then(
				function (rsp) {
					 var item = _.clone($scope.tablaObservaciones.seleccionadas[0]);
					 if (leido == 0 ){ item.validado = 1;}
					 else{ item.leido = 1}
					 
					$scope.updateItemFromArray($scope.tablaObservaciones.datos, {uid: $scope.tablaObservaciones.seleccionadas[0].uid}, item);
					
				},
				function (msg) {
					//window.alert(msg);
				}
			);
            
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
		
		$scope.resetForm = function (){
			$scope.model.tipoCalendario = null;			
			$scope.model.textoCalendario = null;
			$scope.model.submit = false;
		};
		
		//Main
		//$scope.obtenerListadoObservaciones();
		$scope.tablaObservaciones.datos = $scope.model.aObservaciones;
    }
]);