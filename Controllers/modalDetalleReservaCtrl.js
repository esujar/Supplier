angular.module("app").controller("modalDetalleReservaCtrl", [
     "$scope", "$window", "$q", "$modalInstance", "$modal", "$filter", "proveedoresSvc", "docSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $modal, $filter, proveedoresSvc, docSvc, parent) {

        $scope.model = {};
		$scope.modelRsv = {};
        $scope.modelSrv = {};
        
		$scope.model.idProveedor = parent.idProveedor;
		$scope.model.aServicios = [];
		$scope.model.aPax = [];
		$scope.model.aRoomList = [];
		$scope.model.aObservaciones = [];
		$scope.modelRsv = parent.data;
		
		if (!$scope.modelRsv.contactoSpt) $scope.modelRsv.contactoSpt = "N/A";
		if (!$scope.modelRsv.nombreContactoProv) $scope.modelRsv.contactoProveedor = "N/A";
		
		$scope.model.aTiposCalendario = parent.aTiposCalendario;
		
		$scope.model.btnHotelesAlternativosShow = false;
		$scope.model.btnVuelosPredeterminadosShow = false;
		
		
        $scope.removeItemFromArray = function (array, uid) {
            var idx = _.findIndex(array || [], { uid: uid });
            array.splice(idx, 1);
            return idx;
        }
		
		 $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
		
		 $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
		
        //SVC Call 
        $scope.updateItemFromArray = function (array, uid, item) {
            var idx = $scope.removeItemFromArray(array, uid);
            array.splice(idx, 0, item);
        }

       
        $scope.exportarPDF = function ($event) {
            
            docSvc.exportarDetalleReserva($scope);
            
        };
		
		$scope.obtenerListadoPax = function (clicada){
			var aPax = [];
			var oResult = {};
			oResult.nombreRoomingList = clicada.nombreRoomingList;
			oResult.roomingList = [];
			aPax = clicada.pasajerosDatos.split("#");
			 for(var i=0;i<aPax.length;i++){
				aTemp = aPax[i].split("%");
				var pax = {};
				pax.esPrincipal = aTemp[0] ? "X" : "";
				pax.trato = aTemp[1];
				pax.nombreCompleto = aTemp[2];
				pax.distribucion = aTemp[3];
				pax.informacionAdicional = aTemp[4];
				pax.fechaNacimiento = aTemp[5];
				pax.nacionalidad = aTemp[6];
				pax.documento = aTemp[7];
				pax.residencia = aTemp[8];
				pax.fechaExpiracionDocumento = aTemp[9];
				
				oResult.roomingList.push(pax);
			 }
			 
			return oResult;
		}
		
        $scope.obtenerListadoServiciosReserva = function ($event) {
			var tipoSrv = '';
			var tipoStatus = 'total';

            proveedoresSvc.obtenerListadoServiciosReserva($scope.modelRsv.idReserva, tipoSrv, tipoStatus).then(
                function (rsp) {
                    
					
					
                    $scope.tablaServicios.datos = rsp.data.serviciosReserva;
					$scope.model.aServicios = rsp.data.serviciosReserva;
					var aTempNombreRoom = [];
					
					
					for(var i=0; i<$scope.model.aServicios.length; i++){
						if (_.findIndex(aTempNombreRoom,function(chr){return chr = $scope.model.aServicios[i].nombreRoomingList})==-1){
							$scope.model.aRoomList.push($scope.obtenerListadoPax($scope.model.aServicios[i]));
							aTempNombreRoom.push($scope.model.aServicios[i].nombreRoomingList);
						}
					}
					//Create a new array only with unique values for nombreRoomingList
					//_.uniq($scope.model.aRoomList, 'nombreRoomingList');
					
					//$scope.model.aPax = $scope.obtenerListadoPax($scope.model.aServicios[0]);
					 
					$scope.model.btnConfirmServiceShow = _.findIndex(rsp.data.serviciosReserva || [], { codigoStatus: "RQ" }) != -1 ? true : false;
                    $scope.model.btnCancelServiceShow = _.findIndex(rsp.data.serviciosReserva || [], { codigoStatus: "CLX-RQ" }) != -1 ? true : false;
					
					 $scope.obtenerListadoObservaciones();
					 
			
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
			
        };
		
		 $scope.obtenerListadoObservaciones = function ($event) {
            
            proveedoresSvc.obtenerListadoObservacionesReserva($scope.modelRsv.idReserva).then(
                function (rsp) {
                    
					$scope.model.aObservaciones = rsp.data.observacionesReserva;
					var idxPdte = _.findIndex($scope.model.aObservaciones, function(obs){ return obs.codigoEstado =='PTE' && obs.ubicacion ==1});
					
					if ($scope.model.aObservaciones.length!=0 &&  idxPdte !=-1)
						$scope.openObservacionesReserva();
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		$scope.openHotelesAlternativos = function (idReservaServicio, aDatos) {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalHotelesAlternativos.html',
                controller: 'modalHotelesAlternativosCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
							idReservaServicio: idReservaServicio,
                            data: aDatos,
                            

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				 var item = _.clone($scope.tablaServicios.seleccionadas[0]);
				 item.prestatario = rsp;	 
				 $scope.updateItemFromArray($scope.tablaServicios.datos, $scope.tablaServicios.seleccionadas[0].uid, item);
            });



        };
		
		 $scope.obtenerListadoHotelesAlternativos = function () {
			if (!$scope.tablaServicios.seleccionadas.length){window.alert('Select one row'); return;}
			var clicada = $scope.tablaServicios.seleccionadas[0];
			if (clicada.tipoReserva != "HTL") return;
            proveedoresSvc.obtenerListadoHotelesAlternativos(clicada.idReserva, clicada.idReservaServicio).then(
                function (rsp) {
                    if (rsp.data.hotelesAlternativos.length===0){window.alert('no alternative hotels available for the selected service'); return;}
                    else{$scope.openHotelesAlternativos(clicada.idReservaServicio, rsp.data.hotelesAlternativos)}
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		 $scope.openConfirmarServicios = function (mode) {
			 var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalEditarEstadoServiciosReserva.html',
                controller: 'modalEditarEstadoServiciosReservaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.tablaServicios.datos,
                            idReserva: $scope.modelRsv.idReserva,
							mode: mode,
							aTiposCalendario: $scope.model.aTiposCalendario
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.obtenerListadoServiciosReserva();
				$scope.modelSrv = {};
				$scope.tablaPax.datos = [];


            });
        };
		
		$scope.openVuelosPredeterminados = function (mode) {
			 var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalListadoVuelosPredeterminados.html',
                controller: 'modalListadoVuelosPredeterminadosCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
							idReservaServicio: $scope.tablaServicios.seleccionadas[0].idReservaServicio,
							fechaInicio: $scope.tablaServicios.seleccionadas[0].fechaInicio,
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.obtenerListadoServiciosReserva();
				$scope.modelSrv = {};
				$scope.tablaPax.datos = [];

            });
        };

        $scope.openCrearContacto = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalCrearContactoReserva.html',
                controller: 'modalCrearContactoReservaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            idReserva: $scope.modelRsv.idReserva,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				$scope.obtenerListadoServiciosReserva();
				$scope.modelSrv = {};
				$scope.tablaPax.datos = [];


            });



        };
		
		$scope.openDocumentosReserva = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalDocumentosReserva.html',
                controller: 'modalDocumentosReservaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            idReserva: $scope.modelRsv.idReserva,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {



            });



        };
		
		$scope.openObservacionesReserva = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalObservacionesReserva.html',
                controller: 'modalObservacionesReservaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            idReserva: $scope.modelRsv.idReserva,
							aObservaciones: $scope.model.aObservaciones,
							aTiposCalendario: $scope.model.aTiposCalendario
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {



            });



        };

       
         
		 
		
		
		mostrarDetalleServicio = function (){
			if (!$scope.tablaServicios.seleccionadas){ return;}
			$scope.modelSrv = $scope.tablaServicios.seleccionadas[0];
			$scope.modelSrv.fechaVueloView = $filter('date')($scope.modelSrv.fechaVuelo, "dd/MM/yyyy");
            $scope.tablaPax.datos = $scope.obtenerListadoPax($scope.modelSrv).roomingList;
			$scope.model.btnHotelesAlternativosShow = /HTL/i.test($scope.modelSrv.tipoReserva) ? true : false;
			$scope.model.btnVuelosPredeterminadosShow = /TKT/i.test($scope.modelSrv.tipoReserva) ? true : false;
		}

        $scope.tablaServicios = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single", onSelect: mostrarDetalleServicio,
                scrollable: true, height: 200,
                toolbar: false,
                columns: [
                    { field: "tipoReserva", type: "string", title: "service", width: 50 },
                    { field: "codigoStatus", type: "string", title: "status", width: 35, template: "<div class='col-xs-12 sts-#=codigoStatus#'>#:codigoStatus#</div>" },
                    { field: "ciudadInicio", type: "string", title: "city in", width: 50 },
				    { field: "fechaInicio", type: "date", format: "{0:dd/MMM/yyyy}", title: "date in", width: 49 },
					{ field: "ciudadFin", type: "string", title: "city out", width: 80 },
					{ field: "fechaFin", type: "date", format: "{0:dd/MMM/yyyy}", title: "date out", width: 49 },
					{ field: "prestatario", type: "string", title: "supplier", width: 80 },
					{ field: "sgl", type: "number", title: "sgl", width: 35, template: "#=sgl == 0 ? '' : sgl#", attributes: { "class": "text-right" }  },
					{ field: "dbl", type: "string", title: "dbl", width: 35, template: "#=dbl == 0 ? '' : dbl#", attributes: { "class": "text-right" } },
					{ field: "tpl", type: "string", title: "tpl", width: 35, template: "#=tpl == 0 ? '' : tpl#", attributes: { "class": "text-right" } },
					{ field: "totalPax", type: "number", title: "pax", width: 35, attributes: { "class": "text-right" } },
					
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
		
	
		$scope.tablaPax = {
            configuracion: {
                pageable: false,
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
                    { field: "esPrincipal", type: "string", title: "main", width: 60 },
                    { field: "trato", type: "string", title: "Mr/Miss", width: 40 },
                    { field: "nombreCompleto", type: "string", title: "name", width: 60 },
					{ field: "distribucion", type: "string", title: "room type", width: 60 },
					{ field: "informacionAdicional", type: "string", title: "add. inf.", width: 60 },
					{ field: "fechaNacimiento", type: "string", title: "d.o.b.", width: 60, format: "{0:dd/MMM/yyyy}" },
					{ field: "nacionalidad", type: "string", title: "nationality", width: 60 },
					{ field: "documento", type: "string", title: "passport", width: 60 },
					{ field: "fechaExpiracionDocumento", type: "string", title: "expires", width: 60,  format: "{0:dd/MMM/yyyy}" },
					{ field: "residencia", type: "string", title: "residence", width: 60 },
					
                ]
            },
            contextual: [
               
               
                    
                   
            ]




        }

      
        //Main
       
        $scope.obtenerListadoServiciosReserva();
       
      
    }
]);

