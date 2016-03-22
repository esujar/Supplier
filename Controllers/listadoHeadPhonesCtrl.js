﻿angular.module("app").controller("listadoHeadPhonesCtrl", [
"$scope", "$route", "$modal", "$window", "$http", "$location", "$filter", "$compile","proveedoresSvc", "base64", "token",
    function ($scope, $route, $modal,$window, $http, $location, $filter, $compile, proveedoresSvc, base64, token) {

        $scope.model = {};
       
		$scope.model.idProveedor = token.getDecodedPayload().id;
		$scope.model.usuario = token.getDecodedPayload().name;
		$scope.model.idGestionHdph = null;
		
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
		
        $scope.obtenerListadoHeadPhones = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			
            proveedoresSvc.obtenerListadoHeadPhones().then(
                function (rsp) {
                   
                    $scope.tablaHeadPhones.datos = rsp.data.headphones;
                    
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		$scope.openConfirmarHeadPhone = function () {
			if (!$scope.tablaHeadPhones.seleccionadas.length){window.alert('Select one row or more'); return;}
			
			var listIdGestionHdph = $.map($scope.tablaHeadPhones.seleccionadas || [], function (o, i) { return o.idGestionHdph; }).join(",");
		
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalConfirmarHeadPhones.html',
                controller: 'modalConfirmarHeadPhonesCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            listIdGestionHdph : listIdGestionHdph,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					$scope.updateItemFromArray($scope.tablaHeadPhones.datos, $scope.tablaHeadPhones.seleccionadas[0].uid, rsp.data.headphones[0]);
					
				}

            });



        };
		
		$scope.validarPrecioHeadPhones = function ($event) {
			if ($scope.tablaHeadPhones.seleccionadas.length!=1){window.alert('Select only one row.'); return;}
            var idProveedor = $scope.model.idProveedor;
			var idGestionHdph = $scope.tablaHeadPhones.seleccionadas[0].idGestionHdph;
			
            proveedoresSvc.validarPrecioHeadPhone(idGestionHdph).then(
                function (rsp) {
                   
                    //refresh table
					$scope.updateItemFromArray($scope.tablaHeadPhones.datos, $scope.tablaHeadPhones.seleccionadas[0].uid, rsp.data.headphones[0]);
                    
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		$scope.openEditarCosteHeadPhone = function () {
			if ($scope.tablaHeadPhones.seleccionadas.length!=1){window.alert('Select only one row.'); return;}
			
		
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalEditarCosteHeadPhones.html',
                controller: 'modalEditarCosteHeadPhonesCtrl',
                size: 'md',
                resolve: {
                    parent: function () {
                        return {
                            idProveedor: $scope.model.idProveedor,
                            idGestionHdph : $scope.tablaHeadPhones.seleccionadas[0].idGestionHdph,

                        }
                    }
                }
            });

            pup.result.then(function (rsp) {
				if (rsp)//Refresh data
				{
					
				//refresh table
					$scope.updateItemFromArray($scope.tablaHeadPhones.datos, $scope.tablaHeadPhones.seleccionadas[0].uid, rsp.data.headphones[0]);
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
				detailInit: function(e){
                    var detailRow = e.detailRow;
                    detailRow.find(".tabstrip").kendoTabStrip({
                        animation: {
                            open: { effects: "fadeIn" }
                        }
                    });
				},
				// detailTemplate: function (parentRow) {
                    // var idHeadPhonesServicios = "tablaHeadPhonesServicios" + parentRow.idGestionHdph;
                    // $scope[idHeadPhonesServicios] = _.cloneDeep($scope.tablaHeadPhonesServicios);
                    // $scope[idHeadPhonesServicios].datos = parentRow.hdphservicios.toJSON();
                    

					// var detalleHdph = '<div >' +
										// //"<label>Start Hotel:</label>&nbsp;" + (parentRow.hotelInicio? parentRow.hotelInicio : "")+
										// "<br/><label>Start Hotel Address:</label>&nbsp;" + (parentRow.hotelInicioDireccion? parentRow.hotelInicioDireccion : "")+
										// //"<br/><label>End Hotel:</label>&nbsp;" + (parentRow.hotelFin? parentRow.hotelFin : "") + 
									    // "<br/><label>End Hotel Address:</label>&nbsp;" + (parentRow.hotelFinDireccion? parentRow.hotelFinDireccion : "") + 
										// "<br/><label>Guide Name:</label>&nbsp;" + (parentRow.nombreGuia? parentRow.nombreGuia : "") + 
										// "<br/><label>Guide Email:</label>&nbsp;" + (parentRow.emailGuia? parentRow.emailGuia : "") + 
										// "<br/><label>Guide Phone:</label>&nbsp;" + (parentRow.telefonoGuia? parentRow.telefonoGuia : "") + 
										// "<br/><label>Cost Remarks:</label>&nbsp;" + (parentRow.observacionesCosteProveedor? parentRow.observacionesCosteProveedor : "") + 
										// "<br/><label>Mod Remarks:</label>&nbsp;" + (parentRow.observacionesCambio? parentRow.observacionesCambio : "") + 
										// '</div>';
										
					// var tablaServicios =  "<div  style='width:45%'>" +
												// (parentRow.hdphservicios.length > 0 ? "   <div spt-k-grid='$parent.$parent." + idHeadPhonesServicios + "'></div>" : "") +
										 // "</div>";
					
					
                    // return '<div class="tabstrip">' + 
						  // '<ul>' +
							// '<li id="tabMasInfo" class="k-state-active"> More Info </li>' +
							// '<li id="tabServicios">Services</li>' +
						  // '</ul>' +
						  // detalleHdph + 
						  // tablaServicios + 
						  // '</div>';
				
                // },
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
				detailInit: function (kev) {
                    var scope = $scope.$new(true);
                    _.assign(scope, { tablaHeadPhonesServicios: _.cloneDeep($scope.tablaHeadPhonesServicios) });

                    scope.tablaHeadPhonesServicios.datos = kev.data.serviciosHeadphones.toJSON();

                    kev.detailCell.html($compile(kev.detailCell.html())(scope));
					kev.detailCell.find(".tabstrip").kendoTabStrip({ animation: false });

                },
                detailExpand: function (kev) {
                    kev.sender.collapseRow($(".k-master-row", kev.sender.tbody).not(kev.masterRow)); //kev.sender.collapseRow(".k-master-row:not([data-uid=" + kev.masterRow.data("uid") + "])");
                },
                columns: [
                    { field: "referenciaExpediente", type: "string", title: "ref", width: 55,},
					//{ field: "nombreExpedienteExtra", type: "string", title: "exp", width: 35,},
                    { field: "fechaInicio", type: "date", title: "start date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadInicio", type: "string", title: "city", width: 45},
					{ field: "hotelInicio", type: "string", title: "hotel", width: 50},
					//{ field: "hotelInicioDireccion", type: "string", title: "address", width: 55},
					{ field: "fechaFin", type: "date", title: "end date", width: 40, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadFin", type: "string", title: "city", width: 45},
					{ field: "hotelFin", type: "string", title: "hotel", width: 50},
					//{ field: "hotelFinDireccion", type: "string", title: "address", width: 55},
					//{ field: "nombreGuia", type: "string", title: "guide name", width: 40},
					//{ field: "emailGuia", type: "string", title: "guide email", width: 40},
					//{ field: "telefonoGuia", type: "string", title: "guide Phone", width: 40},
					{ field: "totalPax", type: "number", title: "tot pax", width: 30, attributes: { "class": "text-right" }},
					{ field: "costeProveedor", type: "number", title: "cost", width: 30, attributes: { "class": "text-right" }, format: '{0:n2}' },
                    { field: "costePrevisto", type: "number", title: "est. cost", width: 35, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "codigoStatusServicio", type: "string", title: "srv status", width: 35 },
					{ field: "codigoStatusProveedor", type: "string", title: "prov status", width: 35 },
					{ field: "estadoServicio", type: "string", title: "mod", width: 25, template: "<div class='col-xs-12 sts-#=estadoServicio#'>#:estadoServicio#</div>" },
					//{ field: "observacionesCosteProveedor", type: "string", title: "rmks", width: 200 },
					
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
                scrollable: false, 
                toolbar: false,
                columns: [
                    { field: "nombreExpediente", type: "string", title: "exp", width: 40 },
                    { field: "fechaInicio", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
                    { field: "nombreCiudad", type: "string", title: "city", width: 50},
                ]
            },
            menu: [],
            contextual: [
              
            ]
        };
		
		
		 $scope.obtenerListadoHeadPhones();
		
		
		
	}
        
]);

