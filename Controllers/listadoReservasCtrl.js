angular.module("app").controller("listadoReservasCtrl", [
    "$scope", "$route", "$window", "$http", "$location", "$filter", "$modal", "proveedoresSvc", "token",
    function ($scope, $route, $window, $http, $location, $filter, $modal, proveedoresSvc, token) {

        $scope.model = {};
        $scope.model.idProveedor = token.getDecodedPayload().id;
        $scope.model.startingDateFilter = new Date().getTime();
        console.log($filter('date')($scope.model.startingDateFilter, 'yyyy-MM-dd'));
		$scope.model.bookStatusFilter = "";
		$scope.model.servicesStatusFilter = 1;
		$scope.model.aTiposCalendario = [];
		
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

        $scope.obtenerListadoReservas = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			var fInicio = $filter('date')($scope.model.startingDateFilter, 'yyyy-MM-dd');
			var status = $scope.model.bookStatusFilter == "" ? null : $scope.model.bookStatusFilter;
			var srvPte = $scope.model.servicesStatusFilter;

            proveedoresSvc.obtenerListadoReservas(fInicio, status, srvPte).then(
                function (rsp) {
                    
                    $scope.tablaReservas.datos = rsp.data.reservas;
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		
		 $scope.obtenerTiposCalendario = function ($event) {
			var idGrupo = 8;

            proveedoresSvc.obtenerTiposCalendario(idGrupo).then(
                function (rsp) {
                    
                    $scope.model.aTiposCalendario = rsp.data.tiposCalendario;
                   
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };

       

        $scope.setFilterEmpty = function (tabla) {
            tabla.widget.dataSource.filter({});
        };
         
		
		
		openDetalleReserva = function () {
			if (!$scope.tablaReservas.seleccionadas.length){return;}
            var pup = $modal.open({
                templateUrl: '/js/angularApps/proveedores/Views/modalDetalleReserva.html',
                controller: 'modalDetalleReservaCtrl',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return {
                            data: $scope.tablaReservas.seleccionadas[0],
                            idProveedor: $scope.model.idProveedor,
							aTiposCalendario : $scope.model.aTiposCalendario
                        }
                    }
                }
            });

            pup.result.then(function (rsp) {

            });

        };

        $scope.tablaReservas = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single", onSelect: openDetalleReserva,
                scrollable: true, height: $window.innerHeight-310,
                toolbar: false,
                columns: [
                    { field: "idReserva", type: "number", title: "Spt id", width: 30 },
					{ field: "status", type: "string", title: "book status", width: 40 },
                    { field: "fechaInicio", type: "date", format: "{0:dd/MM/yyyy}", title: "date", width: 49 },
					{ field: "nombrePax", type: "string", title: "pax name", width: 70 },
					{ field: "tipo", type: "string", title: "type", width: 40 },
					{ field: "datosPendiente", type: "string", title: "rq services", width: 40, template: "#=totalPendiente ==0? '' : totalPendiente#" + "#=datosPendiente#"  },
					//{ field: "totalPte", type: "number", title: "srv pdtes", width: 40  },
					//{ field: "totalPdte", type: "number", title: "Total Pdte", width: 60 },
                    //{ field: "contactoEmailProv", type: "string", title: "Email Prov", width: 40 },
					{ field: "contactoSpt", type: "string", title: "booking contact", width: 60 },
					{ field: "localizadores", type: "string", title: "supp. ref.", width: 60 },
					{ field: "contactoProveedor", type: "string", title: "supp. contact", width: 60 },
					
                ]
            },
            // contextual: [
                // {
                   // texto: " Details",
                   // icono: "icon-search",
                   // accion: function () {

					   // $scope.openDetalleReserva($scope.tablaReservas.clicada);

                   // },
               // },
               
                    
                   
            //]




        }

      
        //Main
       
        $scope.obtenerListadoReservas();
        $scope.obtenerTiposCalendario();
        
        
      
    }
]);

