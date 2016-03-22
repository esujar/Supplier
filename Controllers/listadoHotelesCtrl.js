angular.module("app").controller("listadoHotelesCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc", "docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.hoy = new Date().toISOString().substring(0, 10);
        $scope.model.aHoteles = [];
		$scope.model.hoy = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		
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


       $scope.obtenerListadoServiciosReserva = function ($event) {
			var idReserva = null;
			var tipoSrv = 'HTL';
			var tipoStatus = 'htllist';

            proveedoresSvc.obtenerListadoServiciosReserva( idReserva, tipoSrv, tipoStatus).then(
                function (rsp) {
                    
                    $scope.tablaServicios.datos = rsp.data.serviciosReserva;
                    $scope.model.aHoteles = rsp.data.serviciosReserva;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

       
	    $scope.obtenerListadoHotelesAlternativos = function () {
			if (!$scope.tablaServicios.seleccionadas.length){window.alert('Select one row'); return;}
			var clicada = $scope.tablaServicios.seleccionadas[0];
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
		openDetalleHotel = function (){
			if (!$scope.tablaServicios.seleccionadas.length){ return;}
			$scope.modelSrv = $scope.tablaServicios.seleccionadas[0];
			$scope.modelSrv.fechaVueloView = $filter('date')($scope.modelSrv.fechaVuelo, "dd/MM/yyyy");
			$scope.tablaPax.datos = $scope.obtenerListadoPax($scope.modelSrv.pasajerosDatos);
		
		}
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
		
		
		$scope.exportarPDF = function ($event) {
            
			//if ($scope.model.aHoteles.length==0) return;
			if ($scope.tablaServicios.filtradas.length==0) return;
			$scope.model.aHoteles = $scope.tablaServicios.filtradas;
            docSvc.exportarListaHoteles($scope);
            
        };
		
        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		$scope.obtenerListadoPax = function (pasajerosDatos){
			var aPax = [];
			var aResult = [];
			aPax = pasajerosDatos.split("#");
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
				
				aResult.push(pax);
			 }
			 
			return aResult;
		}
		
		
		
         $scope.tablaServicios = {
            configuracion: {
                pageable: { pageSize: 50, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single", onSelect: openDetalleHotel,
                scrollable: true, height: 250,
                toolbar: false,
                columns: [
					{ field: "idReserva", type: "string", title: "spt id", width: 50 },
                    { field: "tipoReserva", type: "string", title: "service", width: 50 },
                    { field: "codigoStatusMostrar", type: "string", title: "status", width: 40},//, { value: 'OK', text: "confirmed" }, { value: 'RQ', text: "pending confirmation" }, { value: 'CLX', text: "cancelled" }]
                    { field: "ciudadInicio", type: "string", title: "city in", width: 50 },
				    { field: "fechaInicio", type: "date", format: "{0:dd/MM/yyyy}", title: "date in", width: 49 },
					{ field: "ciudadFin", type: "string", title: "city out", width: 70 },
					{ field: "fechaFin", type: "date", format: "{0:dd/MMM/yyyy}", title: "date out", width: 49 },
					{ field: "prestatario", type: "string", title: "supplier", width: 70 },
					{ field: "sgl", type: "number", title: "sgl", width: 40, template: "#=sgl == 0 ? '' : sgl#", attributes: { "class": "text-right" } },
					{ field: "dbl", type: "number", title: "dbl", width: 40, template: "#=dbl == 0 ? '' : dbl#", attributes: { "class": "text-right" } },
					{ field: "tpl", type: "number", title: "tpl", width: 40, template: "#=tpl == 0 ? '' : tpl#", attributes: { "class": "text-right" } },
					{ field: "totalPax", type: "number", title: "pax", width: 40, attributes: { "class": "text-right" } },
					
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
				// {
                    // texto: "change hotel",
                    // icono: "icon-home",
                    // accion: function () {
						// $scope.obtenerListadoHotelesAlternativos($scope.tablaServicios.clicada);
						
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
                scrollable: true, height: 200,
                toolbar: false,
                columns: [
                    { field: "esPrincipal", type: "string", title: "main", width: 60 },
                    //{ field: "trato", type: "string", title: "Mr/Miss", width: 40 },
                    { field: "nombreCompleto", type: "string", title: "name", width: 60, template: "#=trato#" + " " + "#=nombreCompleto#" },
					{ field: "distribucion", type: "string", title: "room type", width: 60 },
					{ field: "informacionAdicional", type: "string", title: "add. inf.", width: 60 },
					{ field: "fechaNacimiento", type: "string", title: "d.o.b.", width: 60, format: "{0:dd/MMM/yyyy}" },
					{ field: "nacionalidad", type: "string", title: "nationality", width: 60 },
					{ field: "documento", type: "string", title: "passport", width: 60 },
					{ field: "fechaExpiracionDocumento", type: "string", title: "expires", width: 60,  format: "{0:dd/MM/yyyy}" },
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

