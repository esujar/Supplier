angular.module("app").controller("listadoHeadPhonesFacturadosCtrl", [
"$scope", "$route", "$window", "$http", "$location", "$filter", "$compile", "proveedoresSvc",  "excel", "token",
    function ($scope, $route, $window, $http, $location, $filter, $compile, proveedoresSvc,  excel, token) {

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
		
		

       
        $scope.obtenerListadoHeadPhonesFacturados = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			
            proveedoresSvc.obtenerListadoFacturasHeadPhones().then(
                function (rsp) {
                   
                    $scope.tablaHeadPhonesFacturas.datos = rsp.data.facturasHeadphones;
                    
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		$scope.tablaHeadPhonesFacturas = {
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
				
				detailTemplate: function (parentRow) {

                    return "" +
                        "<div style='width: 96%;'>" +
                        "   <div spt-k-grid='tablaHeadPhonesFacturasDetalles'></div>" +
                        "</div>";
                },
				 detailInit: function (kev) {
                    var scope = $scope.$new(true);
                    _.assign(scope, { tablaHeadPhonesFacturasDetalles: _.cloneDeep($scope.tablaHeadPhonesFacturasDetalles) });

                    scope.tablaHeadPhonesFacturasDetalles.datos = kev.data.facturasHeadphonesDetalles.toJSON();

                    kev.detailCell.html($compile(kev.detailCell.html())(scope));

                },
                detailExpand: function (kev) {
                    kev.sender.collapseRow($(".k-master-row", kev.sender.tbody).not(kev.masterRow)); //kev.sender.collapseRow(".k-master-row:not([data-uid=" + kev.masterRow.data("uid") + "])");
                },
                columns: [
                    { field: "numero", type: "string", title: "invoice number", width: 80  },
					{ field: "importe", type: "number", title: "cost", width: 50, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "fecha", type: "date", title: "invoice date", width: 60, format: "{0:dd/MMM/yyyy}" },
					//{ field: "aprobada", type: "number", title: "invoice validated", width: 60, template: "<div class='col-xs-12' style='display:#=aprobada == 1 ? 'block': 'none' #'><span class='icon-checkmark'></span></div>" },
					{ field: "aprobada", type: "string", title: "invoice validated", width: 60},
					{ field: "fechaPagoPrevisto", type: "date", title: "pay date", width: 60, format: "{0:dd/MMM/yyyy}" },
					{ field: "aprobadaFecha", type: "date", title: "confirm date", width: 60, format: "{0:dd/MMM/yyyy}" },
                    
					
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }
		
		
		
		$scope.tablaHeadPhonesFacturasDetalles = {
            configuracion: {
                pageable: false,
                sortable: false,
                filterable: false, //{ mode: "menu" },
                groupable: false,
                resizable: true,
                reorderable: false,
                columnMenu: false,
                selectable: false,
                scrollable: false,
                toolbar: false,
                columns: [
                    { field: "referenciaExpediente", type: "string", title: "ref", width: 40,},
                    { field: "fechaInicio", type: "date", title: "start date", width: 35, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadInicio", type: "string", title: "start city", width: 40},
					{ field: "hotelInicio", type: "string", title: "start hotel", width: 60},
					{ field: "fechaFin", type: "date", title: "end date", width: 35, format: "{0:dd/MMM/yyyy}" },
					{ field: "ciudadFin", type: "string", title: "end city", width: 40},
					{ field: "hotelFin", type: "string", title: "end hotel", width: 60},
					{ field: "totalPax", type: "number", title: "tot pax", width: 25, attributes: { "class": "text-right" }},
					{ field: "costeFinal", type: "number", title: "cost", width: 25, attributes: { "class": "text-right" }, format: '{0:n2}' },
					{ field: "observacionesCosteProveedor", type: "string", title: "rmks", width: 60 },
                ]
            },
            menu: [],
            contextual: [
              
            ]
        };
		
		
		$scope.generarDatosExcel = function(){
		     _.forEach($scope.tablaHeadPhonesFacturas.seleccionadas[0].facturasHeadphonesDetalles, function (value, index) {
					
					var item = {
						referenciaExpediente: "",
						fechaInicio: "",
						ciudadInicio: "",
						hotelInicio: "",
						fechaFin:"",
						ciudadFin: "",
						hotelFin: "",
						totalPax: "",
						costeFinal: "",
						observacionesCosteProveedor: "",
					};
					
					item.referenciaExpediente = value['referenciaExpediente'];
					item.fechaInicio= $filter('date')(value['fechaInicio'], 'dd/MM/yyyy');
					item.ciudadInicio= value['ciudadInicio'];
					item.hotelInicio= value['hotelInicio'];
					item.fechaFin= $filter('date')(value['fechaFin'], 'dd/MM/yyyy');
					item.ciudadFin= value['ciudadFin'];
					item.hotelFin= value['hotelFin'];
					item.totalPax= value['totalPax'];
					item.costeFinal= value['costeFinal'];
					item.observacionesCosteProveedor= value['observacionesCosteProveedor'];
					
					
					$scope.model.aDatosExcel.push(item);
			
			});
		
		
		}
		
		$scope.exportarExcel = function(){
		   if (!$scope.tablaHeadPhonesFacturas.seleccionadas.length){window.alert('Select one row or more'); return;}
			var aCabecera = ["ref ", "start date ", "start city ", "start hotel ", "end date ", "end city ", "end hotel ","total Pax ", "cost ", "rmks "];
			$scope.model.aDatosExcel = [];
			$scope.generarDatosExcel();
			excel.generar(aCabecera, $scope.model.aDatosExcel, "invoice_" + $scope.tablaHeadPhonesFacturas.seleccionadas[0].numero+ "_headphone", token.getToken());
		
		}
		
	
		
		$scope.model.aDatosExcel = [];
		
		 $scope.obtenerListadoHeadPhonesFacturados();
		
		
		
	}
        
]);

