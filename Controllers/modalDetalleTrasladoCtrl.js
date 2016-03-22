angular.module("app").controller("modalDetalleTrasladoCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$modal", "$filter", "proveedoresSvc", "docSvc", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $modal, $filter, proveedoresSvc, docSvc, parent, token) {

        $scope.model = {};
        $scope.modelTrf = {};
        
		
		$scope.modelTrf = parent.data;
		$scope.model.usuario = parent.usuario;
		
		$scope.model.hoy = new Date().toISOString().substring(0, 10);
		
		$scope.model.fechaTrfView = $filter('date')($scope.modelTrf.fecha, "dd/MM/yyyy");
		$scope.model.btnDesconfirmarShow = false;
		$scope.model.btnConfirmarShow = (["0", "PC", "RQ", "FV"].indexOf($scope.modelTrf.statusServicio) != -1 && $filter('date')($scope.modelTrf.fecha, 'yyyy-MM-dd') >= $scope.model.hoy);
		$scope.model.btnEditarHoraShow = (["0", "PC", "RQ", "FV"].indexOf($scope.modelTrf.statusServicio) != -1 && !$scope.modelTrf.idReserva);
		$scope.model.btnEditarCosteShow = ($scope.modelTrf.estadoVal < 3 && ["CF", "OK"].indexOf($scope.modelTrf.statusServicio != -1) && ($filter('date')($scope.modelTrf.fecha, 'yyyy-MM-dd') < $scope.model.hoy || ($filter('date')($scope.modelTrf.fecha, 'yyyy-MM-dd') >= $scope.model.hoy && $scope.modelTrf.coste!=0)));
		$scope.model.statusServicioView = ($scope.modelTrf.statusServicio ? ($scope.modelTrf.statusServicio == "CF" || $scope.modelTrf.statusServicio == "OK" ? "CONFIRMED" : "PENDING CONFIRMATION") : "N/A");
		$scope.model.statusCosteView = ($scope.modelTrf.estadoVal < 3? "PENDING SpT. VALIDATION" : "VALIDATED BY SpT." );
		
		$scope.model.refreshTrf = false;
		
		if (!$scope.modelTrf.guia) $scope.modelTrf.guia = "N/A";
		if (!$scope.modelTrf.chofer) $scope.modelTrf.chofer = "N/A";
		
		$scope.model.btnCambiarHoraPickUpShow = (["OUT", "IN/OUT"].indexOf($scope.modelTrf.tipo)>=0);
		
        $scope.removeItemFromArray = function (array, uid) {
            var idx = _.findIndex(array || [], { uid: uid });
            array.splice(idx, 1);
            return idx;
        }

        //SVC Call 
        //Listado De Emision
        $scope.updateItemFromArray = function (array, uid, item) {
            var idx = $scope.removeItemFromArray(array, uid);
            array.splice(idx, 0, item);
        }

       
         $scope.cancel = function () {
            $modalInstance.close($scope.model.refreshTrf);
        };

      

       
		
		$scope.openEditarCoste = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalEditarCosteTraslado.html',
                controller: 'modalEditarCosteTrasladoCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.modelTrf,
							usuario : $scope.model.usuario
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.modelTrf.costePresupuesto = rsp.costeProveedor;
				$scope.model.refreshTrf = true;

            });

        };
		
		
		$scope.openEditarHora = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalEditarHoraTraslado.html',
                controller: 'modalEditarHoraTrasladoCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.modelTrf,
							usuario : $scope.model.usuario,
							idProveedor: token.getDecodedPayload().id
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.modelTrf.horaDesde = rsp.horaDesde;
				$scope.modelTrf.horaHasta = rsp.horaHasta;
				$scope.model.refreshTrf = true;

            });

        };
		
		$scope.openEditarHoraPickUp = function () {
			if (!$scope.tablaVuelos.seleccionadas.length){window.alert('Select one row'); return;}
			//if (["OUT", "IN/OUT"].indexOf($scope.modelTrf.tipo)){window.alert('You can´t change the pick up hour of this service.'); return;}
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalEditarHoraPickUpTraslado.html',
                controller: 'modalEditarHoraPickUpTrasladoCtrl',
                size: 'sm',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.tablaVuelos.seleccionadas[0],
							usuario : $scope.model.usuario,
							
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.model.refreshTrf = true;


            });

        };
		
		$scope.editarServicioNoShow = function () {
            if ($scope.tablaVuelos.seleccionadas.length==0) {window.alert('Select one row'); return;}
			
			if (!window.confirm("selected flight will be passed to 'no show' , are you sure?")) {return;}
			
                var listSrv = $.map($scope.tablaVuelos.seleccionadas || [], function (o, i) { return o.idReservaServicio; }).join(",");
				//proveedoresSvc.editarServiciosNoShow($scope.tablaVuelos.seleccionadas[0].idReservaServicio).then(
				proveedoresSvc.editarServiciosNoShow(listSrv).then(
                    function (rsp) {
						$scope.model.refreshTrf = true;
						$modalInstance.close($scope.model.refreshTrf);
                        
                    },
                    function (msg) {
                        //window.alert(msg);
                    }
                );
            
        };
		
        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		 
		
        //Main
		$scope.tablaVuelos = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: true,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: {mode:"single"},
                scrollable: true, height: 300,
                toolbar: false,
                columns: [
                    { field: "", type: "string", title: "", width: 370, template: "<strong>#=vuelo#</strong>" + "<br/>" + "#=datosRecogida#" + "<br/>" +  "#=datosGenerales#"  + "<br/>" + "#=datosPasajeros#" + "<br/>" + "#=descripcion#"},
					{ field: "modificado", type: "string", title: "mod", width: 30},
                    
					
                ]
            },
            contextual: [
               
                
                    
                   
            ]




        }
        
        $scope.tablaVuelos.datos = parent.data.trasladosVuelos;
        
        
      
    }
]);

