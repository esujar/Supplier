angular.module("app").controller("listadoTrasladosCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		//$scope.model.hoy = new Date().toISOString().substring(0, 10);
		$scope.model.hoy = new Date();
        $scope.model.aTraslados = [];
		
		$scope.model.showVerificarCostos = false;
		$scope.model.confirmarServicio = false;
		
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


        $scope.obtenerListadoTraslados = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			
			var idGestionTrasladosPeticion = null, idReservaServicio = null;

            proveedoresSvc.obtenerListadoTraslados(idGestionTrasladosPeticion, idReservaServicio).then(
                function (rsp) {
                    for(var i=0; i<rsp.data.traslados.length; i++){
						if (rsp.data.traslados[i].tipoGestionTrf === "F" && rsp.data.traslados[i].trasladosVuelos.length){
							rsp.data.traslados[i].idReserva = rsp.data.traslados[i].trasladosVuelos[0].idReserva;
							rsp.data.traslados[i].infoVuelo = rsp.data.traslados[i].trasladosVuelos[0].vuelo;
						}else{rsp.data.traslados[i].idReserva = "";}
					}
					
					
                    $scope.tablaTraslados.datos = rsp.data.traslados;
                    $scope.model.aTraslados = rsp.data.traslados;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

		$scope.exportarPDF = function ($event) {
            
			//if ($scope.model.aTraslados.length==0) return;
			if ($scope.tablaTraslados.filtradas.length==0) return;
			$scope.model.aTraslados = $scope.tablaTraslados.filtradas;
            docSvc.exportarListaTraslados($scope);
            
        };

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		 $scope.openDetalleTraslado = function () {
			if (!$scope.tablaTraslados.seleccionadas.length){window.alert('Select one row.');return;}

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalDetalleTraslado.html',
                controller: 'modalDetalleTrasladoCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.tablaTraslados.seleccionadas[0],
                            usuario : $scope.model.usuario

                        }
                    }
                }
            });

            pup.result.then(function (refresh) {
				if (refresh)//Refresh data
				{
					var idGestionTrasladosPeticion = $scope.tablaTraslados.seleccionadas[0].tipoGestionTrf == "G"? $scope.tablaTraslados.seleccionadas[0].codTrf : null;
					var idReservaServicio = $scope.tablaTraslados.seleccionadas[0].tipoGestionTrf == "F"? $scope.tablaTraslados.seleccionadas[0].codTrf : null;
		
					proveedoresSvc.obtenerDetalleTraslado(idGestionTrasladosPeticion, idReservaServicio).then(
						function (rsp) {
							
							if (rsp.data.traslados[0].tipoGestionTrf === "F" && rsp.data.traslados[0].trasladosVuelos.length){
							rsp.data.traslados[0].idReserva = rsp.data.traslados[0].trasladosVuelos[0].idReserva;
							rsp.data.traslados[0].infoVuelo = rsp.data.traslados[0].trasladosVuelos[0].vuelo;
							}else{rsp.data.traslados[0].idReserva = "";}
						
							$scope.updateItemFromArray($scope.tablaTraslados.datos, $scope.tablaTraslados.seleccionadas[0].uid, rsp.data.traslados[0]);
						},
						 function (msg) {
							//window.alert(msg);
						}	
					);
				}

            });



        };
		
		
		 $scope.confirmarServicio = function () {
			if (!$scope.tablaTraslados.seleccionadas.length){window.alert('Select one row'); return;}
			var clicada = $scope.tablaTraslados.seleccionadas[0];
			var usuario = $scope.model.usuario; //???
			var idGestionTrasladosPeticion = clicada.tipoGestionTrf == "G"? clicada.codTrf : null;
			var idReservaServicio = clicada.tipoGestionTrf == "F"? clicada.codTrf : null;
			var status = "CF"; //???
			
			//Check transfer to be confirmed
			var fechaTrf = $filter('date')(clicada.fecha, 'yyyy-MM-dd');
			//if (!(["0", "PC", "RQ", "FV"].indexOf(clicada.statusServicio) != -1 && fechaTrf >= $scope.model.hoy)){window.alert('This transfer can´t be confirmed'); return;} ;
					 
            proveedoresSvc.editarTraslado(idGestionTrasladosPeticion, idReservaServicio, usuario, status, null, null).then(
                function (rsp) {
					if (!rsp.data.traslados){
						 //refresh row change status
						 var item = _.clone($scope.tablaTraslados.seleccionadas[0]);
						item.statusServicio = "CF";
						 
						$scope.updateItemFromArray($scope.tablaTraslados.datos, $scope.tablaTraslados.seleccionadas[0].uid, item);
					}else{
						$scope.updateItemFromArray($scope.tablaTraslados.datos, $scope.tablaTraslados.seleccionadas[0].uid, rsp.data.traslados);
					}
                   
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		
		$scope.verificarCostos = function () {
			if (!$scope.tablaTraslados.seleccionadas.length){window.alert('Select one row'); return;}
			var clicada = $scope.tablaTraslados.seleccionadas[0];
			var usuario = $scope.model.usuario; //???
			var idGestionTrasladosPeticion = clicada.tipoGestionTrf == "G"? clicada.codTrf : null;
			var idReservaServicio = clicada.tipoGestionTrf == "F"? clicada.codTrf : null;
			
			//if (!(clicada.costeTrf) && (clicada.costePresupuesto)){window.alert('This transfer cost can´t be validated'); return;}
			
			//if(!(clicada.costeTrf != 0 && (clicada.costePresupuesto === 0 || clicada.costePresupuesto ===null))){window.alert('This transfer cost can´t be validated'); return;}
			
			var costeProveedor = null;
			var usuario = $scope.model.usuario; 
			var observacionesCambio = null;
			var moneda	=null;
			
            proveedoresSvc.verificarCoste(idGestionTrasladosPeticion,  idReservaServicio, costeProveedor, usuario, observacionesCambio, moneda).then(
                function (rsp) {
                    
                    //refresh
					// proveedoresSvc.obtenerListadoTraslados($scope.model.idProveedor, idGestionTrasladosPeticion, idReservaServicio).then(
						// function (rsp) {
							// $scope.updateItemFromArray($scope.tablaTraslados.datos, $scope.tablaTraslados.seleccionadas[0].uid, rsp.data.traslados[0]);
						// },
						 // function (msg) {
							// //window.alert(msg);
						// }	
					// );
					
					$scope.removeItemFromArray($scope.tablaTraslados.datos, $scope.tablaTraslados.seleccionadas[0].uid);
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		function checkButtons(){
			var clicada = $scope.tablaTraslados.seleccionadas[0];
			var fechaTrf = $filter('date')(clicada.fecha, 'yyyy-MM-dd');
			var hoy = $filter('date')($scope.model.hoy, 'yyyy-MM-dd');
			
			if (clicada){
				$scope.model.showVerificarCostos = ((clicada.coste != 0 && clicada.coste != null) && (clicada.costePresupuesto==0 || clicada.costePresupuesto ===null)) ? true : false;
				$scope.model.showConfirmarServicio = (["0", "PC", "RQ", "FV"].indexOf(clicada.statusServicio) != -1 && fechaTrf >= hoy) ? true : false;
			}else{
				$scope.model.showVerificarCostos= false;
				$scope.model.showConfirmarServicio= false;
			}
			
		}
		
        $scope.tablaTraslados = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single", onSelect: checkButtons,
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                columns: [
                    { field: "idReserva", type: "number", title: "SpT id.", width: 35,},// && "#=proveedorTrasladosVuelos.length#" != 0 ? "#=proveedortraslados[0].idReserva#" : ""
                    { field: "idTrfKendo", type: "string", title: "trf id.", width: 35  },//, template: "#=tipoGestionTrf + codTrf#"
					{ field: "statusServicio", type: "string", title: "status", width: 30 },
					{ field: "fecha", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudad", type: "string", title: "city", width: 40 },
					{ field: "tipo", type: "string", title: "type", width: 30 },
					{ field: "totalPax", type: "string", title: "ttl pax", width: 30,  attributes: { "class": "text-right" } },
					{ field: "timeRangeKendo", type: "string", title: "time range", width: 45, },//template: "#=horaDesde#" + ("#=horaDesde#" != "#=horaHasta#" ? "" : " - " + "#=horaHasta#") //template: "#=horaDesde#" + ("#=horaDesde#" == "#=horaHasta#" || ("#=horaDesde#" != "00:00" && "#=horaHasta#" == "00:00") ? "" : " - " + "#=horaHasta#")
					{ field: "coste", type: "number", title: "est. cost", width: 40, attributes: { "class": "text-right" }, format: '{0:n2}' },//
					{ field: "costePresupuesto", type: "number", title: "prop. cost", width: 40, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "moneda", type: "string", title: "curr.", width: 30 },
					{ field: "observaciones", type: "string", title: "rmks", width: 40 },
					{ field: "modificado", type: "string", title: "mod", width: 30},
					{ field: "infoVuelo", type: "string", title: "flight info", width: 80  },
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }

      
        //Main
       
        $scope.obtenerListadoTraslados();
        
      
    }
]);

