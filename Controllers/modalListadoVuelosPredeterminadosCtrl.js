angular.module("app").controller("modalListadoVuelosPredeterminadosCtrl", [
    "$rootScope", "$scope",  "$window", "$q", "$modalInstance", "$modal", "$filter", "proveedoresSvc", "parent", "token",
    function ($rootScope, $scope, $window, $q, $modalInstance, $modal, $filter, proveedoresSvc, parent, token) {

       
		
		
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
            $modalInstance.close();
        };

      
        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
        
		
		$scope.obtenerListadoVuelos = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			

            proveedoresSvc.obtenerListadoVuelosPredeterminados(idProveedor).then(
                function (rsp) {
                    
                    $scope.tablaVuelos.datos = rsp.data.proveedoresVuelosPredeterminados;
                   
                },
                function (msg) {
                    //window.alert(msg);
					$scope.model.submitSearchFlight = true;
                }
            );
        };
		
		$scope.editarVueloPredeterminado = function($event) {
            
			if (!window.confirm("selected flight will be assigned to selected service, are you sure?")) {return;}
			var idProveedorTraslados = ($scope.tablaVuelos.seleccionadas.length == 1 ? $scope.tablaVuelos.seleccionadas[0].idProveedorTraslados : null);
			var fechaEmision = $scope.model.fechaEmision ? $filter('date')($scope.model.fechaEmision, 'yyyy-MM-dd') : null;
			
			var fechaServicio = $filter('date')($scope.model.fechaServicio, 'yyyy-MM-dd');
			
			if (fechaEmision > fechaServicio){ window.alert('The Flight Date date must be later than Issue Date'); return;}
			
			
            proveedoresSvc.editarVueloPredeterminado($scope.model.idReservaServicio, idProveedorTraslados, fechaServicio, fechaEmision).then(
                function (rsp) {
                   $modalInstance.close();
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		 $scope.obtenerVuelo = function ($event) {
           
            if ($scope.model.CIA && $scope.model.vuelo) {

            
                proveedoresSvc.obtenerInfoVuelo($scope.model.CIA, $scope.model.vuelo).then(
                    function (rsp) {
                        //console.log(rsp.data);
                        $scope.model.horaDes = rsp.data.Table[0].horaSalida.substr(0, 5);
                        $scope.model.horaHas = rsp.data.Table[0].horaLlegada.substr(0, 5);
                        $scope.model.aptoDes = rsp.data.Table[0].idAeropuertoSalida;
                        $scope.model.cityDes = rsp.data.Table[0].idCiudadSalida;
                        $scope.model.aptoHas = rsp.data.Table[0].idAeropuertoLlegada;
                        $scope.model.cityHas = rsp.data.Table[0].idCiudadLlegada;
						
						$scope.model.iniAptoDes = rsp.data.Table[0].nombreAeropuertoSalida;
						$scope.model.iniAptoHas = rsp.data.Table[0].nombreAeropuertoLlegada;
						
						$scope.model.flightFound = true;
                    },
                    function (msg) {
                       // window.alert(msg);
					   
					   $scope.model.flightFound = false;
                    }
                );
            }
        };
		 
		 $scope.resetVuelo = function (){
			$scope.model.inOut = null;
			$scope.model.fechaSalida = null;
			$scope.model.CIA = null;
			$scope.model.vuelo = null;
			$scope.model.horaDes = null;
			$scope.model.horaHas = null;
			$scope.model.aptoDes = null;
			$scope.model.cityDes = null;
			$scope.model.aptoHas = null;
			$scope.model.cityHas = null;
			$scope.model.horaRecogida = null;
			$scope.model.notas = null;
			$scope.model.submit = false;		
		 
		 }
		 
		 
		  $scope.ok = function (isInvalid) {
            $scope.model.submit = true;
            if (isInvalid) return;
			
			if (!$scope.model.flightFound){window.alert('Please search a flight first'); return;}

            var horaSalida, horaLlegada;

            horaSalida = ($scope.model.horaDes.length == 5 ? $scope.model.horaDes + ":00" : $scope.model.horaDes);
            horaLlegada = ($scope.model.horaHas.length == 5 ? $scope.model.horaHas + ":00" : $scope.model.horaHas);
            horaRecogida = ($scope.model.horaRecogida.length == 5 ? $scope.model.horaRecogida + ":00" : $scope.model.horaRecogida);


			proveedoresSvc.crearTrasladoPredeterminado($scope.model.CIA, $scope.model.vuelo, $filter('date')($scope.model.fechaSalida, 'yyyy-MM-dd'), $scope.model.cityDes, $scope.model.aptoDes, horaSalida, $scope.model.cityHas, $scope.model.aptoHas, horaLlegada, horaRecogida, $scope.model.inOut, $scope.model.notas).then(
				function (rsp) {

					
					$scope.tablaVuelos.datos.push(rsp.data.proveedoresVuelosPredeterminados[0]);
					$scope.resetVuelo();
				},
				function (msg) {
					//window.alert(msg);
				}
			);

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
                scrollable: true, height: 150,
                toolbar: false,
                columns: [
                     { field: "notas", type: "string", title: "flt. ref", width: 40 },
					 { field: "nombreCiaAerea", type: "string", title: "carr", width: 40 },
					 { field: "numeroVuelo", type: "string", title: "number", width: 40 },
					 { field: "horaSalida", type: "string", title: "dep. time", width: 40 },
					 { field: "ciudadSalida", type: "string", title: "dep. city", width: 40 },
					 { field: "aereopuertoSalida", type: "string", title: "dep. airport", width: 40 },
					 { field: "horaLlegada", type: "string", title: "arr. time", width: 40 },
					 { field: "ciudadLlegada", type: "string", title: "arr. city", width: 40 },
					 { field: "aereopuertoLlegada", type: "string", title: "arr. airport", width: 40 },
					 { field: "horaRecogida", type: "string", title: "pick up", width: 40 },
					 
                    
					
                ]
            },
            contextual: [
               
                    
                   
            ]




        }
        
		 $scope.model = {};
        $scope.model.idProveedor = token.getDecodedPayload().id;
		
		$scope.model.idReservaServicio = parent.idReservaServicio;
		$scope.model.fechaServicio = parent.fechaInicio;
		$scope.model.flightFound = false;
		$scope.model.submitSearchFlight = false;
        $scope.model.fechaEmision = null;
		
		$scope.obtenerListadoVuelos();
		
		//Maestros
		//$scope.model.cias = $rootScope.cias;
		//$scope.model.ciudades = $rootScope.ciudades;
		//$scope.model.nodos = $rootScope.nodos;
     
		//console.log($scope);
    }
]);

