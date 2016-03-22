angular.module("app").controller("listadoBusesFacturarCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "$compile", "proveedoresSvc","docSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, $compile, proveedoresSvc, docSvc, token) {

        $scope.model = {};
        
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		$scope.model.showObservaciones = false;
		
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
        $scope.obtenerListadoBusesFacturacion = function ($event) {
            proveedoresSvc.obtenerListadoBusesPendientesFacturar().then(
                function (rsp) {
                    $scope.tablaBuses.datos = rsp.data.busesAlquileres;
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		 $scope.openGenerarFactura = function () {
			if (!$scope.tablaBuses.seleccionadas.length){window.alert('Select one row or more'); return;}
			
			$scope.model.listIdentificadoresDetalle = $.map($scope.tablaBuses.seleccionadas || [], function (o, i) { return o.idGestionBusesGrupoAlquilerDetalle; }).join(",");

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalGenerarFacturaBus.html',
                controller: 'modalGenerarFacturaBusCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            listIdentificadoresDetalle: $scope.model.listIdentificadoresDetalle,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					
					// //Remove from datatable
					_.forEach($scope.tablaBuses.seleccionadas, function (value, index) {
						$scope.removeItemFromArray($scope.tablaBuses.datos, value['uid']);
					});
				}

            });



        };
		
		 
		$scope.openObservacionesBus = function () {

            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalObservacionesBus.html',
                controller: 'modalObservacionesBusCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
							aObservaciones: $scope.tablaBuses.seleccionadas[0].busesAlquileresObservaciones,
							
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {



            });



        };
		
		
		function checkButtons(){
			$scope.model.showObservaciones= false;
			if ($scope.tablaBuses.seleccionadas.length!=1) return;
			if ($scope.tablaBuses.seleccionadas[0].GrupoAlquilerDetalleObservaciones.length>0) $scope.model.showObservaciones= true;
			
		}
		
        $scope.tablaBuses = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "multiple", onSelect: checkButtons,
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
				
				detailTemplate: function (parentRow) {
                    
					return "" +
                         "<div style='width: 96%;'>" +
                         "   <div spt-k-grid='tablaObservaciones'></div>" +
                         "</div>";
                },
				detailInit: function (kev) {
                    var scope = $scope.$new(true);
                    _.assign(scope, { tablaObservaciones: _.cloneDeep($scope.tablaObservaciones) });

                    scope.tablaObservaciones.datos = kev.data.busesAlquileresObservaciones.toJSON();

                    kev.detailCell.html($compile(kev.detailCell.html())(scope));

                },
                detailExpand: function (kev) {
                    kev.sender.collapseRow($(".k-master-row", kev.sender.tbody).not(kev.masterRow)); //kev.sender.collapseRow(".k-master-row:not([data-uid=" + kev.masterRow.data("uid") + "])");
                },
                columns: [
                    { field: "matricula", type: "string", title: "plate", width: 30},
                    { field: "nombreCiudadInicio", type: "string", title: "city start", width: 45  },
					{ field: "nombreCiudadFin", type: "string", title: "city end", width: 45 },
					{ field: "fechaInicio", type: "date", title: "date", width: 35, format: "{0:dd/MMM/yyyy}" },
					{ field: "totalDias", type: "number", title: "tot days", width: 25, attributes: { "class": "text-right" } },
					{ field: "nombreExpediente", type: "string", title: "exp", width: 25 },
					{ field: "totalKilometros", type: "number", title: "tot km", width: 30, attributes: { "class": "text-right" } },
					{ field: "netoTotalKilometros", type: "number", title: "net km", width: 30, attributes: { "class": "text-right" } },
					{ field: "netoPeajes", type: "number", title: "net ext exp", width: 35, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "netoSuplementosExtras", type: "number", title: "net driv sup", width: 35, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "totalPasajeros", type: "number", title: "tot pax", width: 30, attributes: { "class": "text-right" } },
					{ field: "nombreBus", type: "string", title: "destiny", width: 85 },
					{ field: "", type: "string", title: "rmks", width: 35, template: "<div class='col-xs-12' style='display:#=GrupoAlquilerDetalleObservaciones.length > 0 ? 'block': 'none' #'><span class='icon-checkmark'></span></div>" },
					{ field: "netoTotalDetalle", type: "number", title: "<b>net tot</b>", width: 40, attributes: { "class": "text-right" }, format: "{0:#,##0.00}", template: "<div><b>#=netoTotalDetalle#</b></div>" },
					
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }
		
		$scope.tablaObservaciones = {
            configuracion: {
                pageable: false,
                sortable: false,
                filterable: false, //{ mode: "menu" },
                groupable: false,
                resizable: false,
                reorderable: false,
                columnMenu: false,
                selectable: false,
                scrollable: true, height: 150,
                toolbar: false,
                columns: [
                    { field: "observaciones", type: "string", title: "expedient", width: 300 },
                ]
            },
            menu: [],
            contextual: [
              
            ]
        };

      
        //Main
       
       $scope.obtenerListadoBusesFacturacion();
        
      
    }
]);

