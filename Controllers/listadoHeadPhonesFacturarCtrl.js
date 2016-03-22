angular.module("app").controller("listadoHeadPhonesFacturarCtrl", [
"$scope", "$route", "$modal", "$window", "$http", "$location", "$filter", "$compile","proveedoresSvc", "base64", "token",
    function ($scope, $route, $modal, $window, $http, $location, $filter, $compile, proveedoresSvc, base64, token) {

        $scope.model = {};
       
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		
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
		
		

       
        $scope.obtenerListadoHeadPhonesPendienteFacturar = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			
            proveedoresSvc.obtenerListadoPendienteFacturarHeadPhones().then(
                function (rsp) {
                   
                    $scope.tablaHeadPhones.datos = rsp.data.headphones;
                    
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		
		 $scope.openGenerarFactura = function () {
			if (!$scope.tablaHeadPhones.seleccionadas.length){window.alert('Select one row or more'); return;}
			
			$scope.model.listIdentificadoresDetalle = $.map($scope.tablaHeadPhones.seleccionadas || [], function (o, i) { return o.idGestionHdph; }).join(",");
			
			var costeFactura = $scope.tablaHeadPhones.seleccionadas[0].costeFinal;
			
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalGenerarFacturaHeadPhones.html',
                controller: 'modalGenerarFacturaHeadPhonesCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            listIdentificadoresDetalle: $scope.model.listIdentificadoresDetalle,
							costeFactura: costeFactura,
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					
					// //Remove from datatable
					_.forEach($scope.tablaHeadPhones.seleccionadas, function (value, index) {
						$scope.removeItemFromArray($scope.tablaHeadPhones.datos, value['uid']);
					});
				}

            });



        };
		
		$scope.tablaHeadPhones = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "multiple",
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                	detailInit: function (kev) {
                    var scope = $scope.$new(true);
                    _.assign(scope, { tablaHeadPhonesServicios: _.cloneDeep($scope.tablaHeadPhonesServicios) });

                    scope.tablaHeadPhonesServicios.datos = kev.data.serviciosHeadphones.toJSON();

                    kev.detailCell.html($compile(kev.detailCell.html())(scope));
					kev.detailCell.find(".tabstrip").kendoTabStrip({ animation: false });

                },
				
				detailTemplate: function (parentRow) {
                
                
					var detalleHdph = '<div >' +
										//"<label>Start Hotel:</label>&nbsp;" + (parentRow.hotelInicio? parentRow.hotelInicio : "")+
										"<br/><label>Start Hotel Address:</label>&nbsp;" + (parentRow.hotelInicioDireccion? parentRow.hotelInicioDireccion : "")+
										//"<br/><label>End Hotel:</label>&nbsp;" + (parentRow.hotelFin? parentRow.hotelFin : "") + 
									    "<br/><label>End Hotel Address:</label>&nbsp;" + (parentRow.hotelFinDireccion? parentRow.hotelFinDireccion : "") + 
										"<br/><label>Guide Name:</label>&nbsp;" + (parentRow.nombreGuia? parentRow.nombreGuia : "") + 
										"<br/><label>Guide Email:</label>&nbsp;" + (parentRow.emailGuia? parentRow.emailGuia : "") + 
										"<br/><label>Guide Phone:</label>&nbsp;" + (parentRow.telefonoGuia? parentRow.telefonoGuia : "") + 
										"<br/><label>Cost Remarks:</label>&nbsp;" + (parentRow.observacionesCosteProveedor? parentRow.observacionesCosteProveedor : "") + 
										"<br/><label>Mod Remarks:</label>&nbsp;" + (parentRow.observacionesCambio? parentRow.observacionesCambio : "") + 
										'</div>';
										
					var tablaServicios =  "<div  style='width:45%'>" +
												(parentRow.serviciosHeadphones.length > 0 ? "   <div spt-k-grid='tablaHeadPhonesServicios'></div>" : "") +
										 "</div>";
					
					
                    return '<div class="tabstrip">' + 
						  '<ul>' +
							'<li id="tabMasInfo" class="k-state-active"> More Info </li>' +
							'<li id="tabServicios">Services</li>' +
						  '</ul>' +
						  detalleHdph + 
						  tablaServicios + 
						  '</div>';
				
                },
			
                detailExpand: function (kev) {
                    kev.sender.collapseRow($(".k-master-row", kev.sender.tbody).not(kev.masterRow)); //kev.sender.collapseRow(".k-master-row:not([data-uid=" + kev.masterRow.data("uid") + "])");
                },
                columns: [
                    { field: "referenciaExpediente", type: "string", title: "ref", width: 65,},
					//{ field: "nombreExpedienteExtra", type: "string", title: "exp", width: 35,},
                    { field: "fechaInicio", type: "date", title: "start date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadInicio", type: "string", title: "city", width: 50},
					//{ field: "hotelInicio", type: "string", title: "Hotel", width: 40},
					//{ field: "hotelInicioDireccion", type: "string", title: "Address", width: 60},
					{ field: "fechaFin", type: "date", title: "end date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadFin", type: "string", title: "city", width: 50},
					//{ field: "hotelFin", type: "string", title: "Hotel", width: 40},
					//{ field: "hotelFinDireccion", type: "string", title: "Address", width: 40},
					//{ field: "nombreGuia", type: "string", title: "Guide Name", width: 40},
					//{ field: "emailGuia", type: "string", title: "Guide Email", width: 40},
					//{ field: "telefonoGuia", type: "string", title: "Guide Phone", width: 40},
					{ field: "totalPax", type: "number", title: "tot pax", width: 35, attributes: { "class": "text-right" }},
					{ field: "costeFinal", type: "number", title: "cost", width: 35, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "observacionesCosteProveedor", type: "string", title: "rmks", width: 160 },
					
                ]
            },
             contextual: [
               
                    
                   
            ]

        }
		
		
		$scope.tablaHeadPhonesServicios = {
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
                    { field: "nombreExpediente", type: "string", title: "expedient", width: 40 },
                    { field: "fechaInicio", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
                    { field: "nombreCiudad", type: "string", title: "city", width: 50},
                ]
            },
            menu: [],
            contextual: [
              
            ]
        };
		
		
		
		 $scope.obtenerListadoHeadPhonesPendienteFacturar();
		
		
		
	}
        
]);

