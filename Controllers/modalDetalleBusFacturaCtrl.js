
angular.module("app").controller("modalDetalleBusFacturaCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$filter", "proveedoresSvc", "excel", "parent", "token",
    function ($scope, $window, $q, $modalInstance, $filter, proveedoresSvc, excel, parent, token) {
        
		$scope.generarDatosExcel = function(){
		     _.forEach($scope.model.aDatos, function (value, index) {
					var item = {
						matricula: "",
						nombreCiudadInicio: "",
						nombreCiudadFin: "",
						nombreExpediente: "",
						fechaInicioGrupoAlquilerDetalle:"",
						totalDiasGrupoAlquilerDetalle:"",
						nombreBusDestinoPredeterminado: "",
						totalPasajeros: "",
						totalDeKilometros: "",
						netoTotalKilometros: "",
						netoPeajes: "",
						netoSuplementosExtras: "",
						netoTotalDetalle: ""
					};
					item.matricula = value['matricula'];
					item.nombreCiudadInicio = value['nombreCiudadInicio'];
					item.nombreCiudadFin= value['nombreCiudadFin'];
					item.nombreExpediente= value['nombreExpediente'];
					item.fechaInicioGrupoAlquilerDetalle= $filter('date')(value['fechaInicio'], 'dd/MM/yyyy');
					item.totalDiasGrupoAlquilerDetalle = value['totalDias'];
					item.nombreBusDestinoPredeterminado = value['nombreBus'];
					item.totalPasajeros= value['totalPasajeros'];
					item.totalDeKilometros= value['totalKilometros'];
					item.netoTotalKilometros= value['netoTotalKilometros'];
					item.netoPeajes= value['netoPeajes'];
					item.netoSuplementosExtras= value['netoSuplementosExtras'];
					item.netoTotalDetalle= value['netoTotalDetalle'];
					
					
					$scope.model.aDatosExcel.push(item);
			});
		
		
		}
		
		
		$scope.tablaBuses = {
            configuracion: {
                pageable: false,
                sortable: true,
                filterable: true,
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: false,
                scrollable: true, height: 150,
                toolbar: false,
                columns: [
					 { field: "matricula", type: "string", title: "plate", width: 30},
                     { field: "nombreCiudadInicio", type: "string", title: "city start", width: 40 },
					 { field: "nombreCiudadFin", type: "string", title: "city end", width: 40 },
					 { field: "nombreExpediente", type: "string", title: "exp", width: 35 },
					 { field: "fechaInicio", type: "date", title: "date", width: 40, format: "{0:dd/MMM/yyyy}" },
					 { field: "totalDias", type: "number", title: "tot days", width: 35 },
					 { field: "nombreBus", type: "string", title: "destiny", width: 60 },
					 { field: "totalPasajeros", type: "number", title: "tot pax", width: 35, attributes: { "class": "text-right" } },
					 { field: "totalKilometros", type: "number", title: "tot km", width: 35, attributes: { "class": "text-right" }},
					 { field: "netoTotalKilometros", type: "number", title: "tot net km", width: 35, attributes: { "class": "text-right" }},
					 { field: "netoPeajes", type: "number", title: "net toll", width: 35, attributes: { "class": "text-right" }, format: "{0:#,##0.00}" },
                     { field: "netoSuplementosExtras", type: "number", title: "ext sup net", width: 35, attributes: { "class": "text-right" }, format: "{0:#,##0.00}" },
					 { field: "netoTotalDetalle", type: "number", title: "<b>net tot</b>", width: 35, attributes: { "class": "text-right" }, format: "{0:#,##0.00}", template: "<div><b>#=netoTotalDetalle#</b></div>" },
					 //{ field: "", type: "number", title: "<b>neto tot</b>", width: 40, attributes: { "class": "text-right" }, format: "{0:#,##0.00}", template: #=netoTotalKilometros# + #=netoPeajes# + #=netoSuplementosExtras# },
                ]
            },
            contextual: [
               
                    
                   
            ]




        }
		
		
		$scope.exportarExcel = function(){
			var aCabecera = ["plate", "city start", "city end", "exp", "date", "tot days", "destiny", "tot pax", "tot km", "tot net km", "net toll", "ext sup net",  "net tot"];
			excel.generar(aCabecera, $scope.model.aDatosExcel, "details_invoice_bus_"+$scope.model.aDatos[0].matricula, token.getToken());
		
		}
		
       
        
        //Init model vars
        $scope.model = {};
		$scope.model.aDatos = parent.data
		$scope.tablaBuses.datos = $scope.model.aDatos;
		
		console.log($scope.model.aDatos);
		
		$scope.model.aDatosExcel = [];
		$scope.generarDatosExcel();
		
		
		
        
        $scope.model.submit = false;
        


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);