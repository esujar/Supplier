angular.module("app").controller("modalHotelesAlternativosCtrl", [
    "$scope", "$window", "$q", "$modalInstance", "$modal", "$filter", "proveedoresSvc", "parent",
    function ($scope, $window, $q, $modalInstance, $modal, $filter, proveedoresSvc, parent) {

        $scope.model = {};
		$scope.modelRsv = {};
        $scope.modelSrv = {};
        
		$scope.model.idReservaServicio = parent.idReservaServicio;
		
		
		
		 $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //SVC Call 
        

         $scope.ok = function () {
			if(!$scope.tablaHoteles.seleccionadas){window.alert("please select one alternative hotel"); return;}
            var idHotel=$scope.tablaHoteles.seleccionadas[0].idHotel;
			var idProveedor=$scope.tablaHoteles.seleccionadas[0].idProveedorHotel;
            proveedoresSvc.editarHotelAlternativo($scope.model.idReservaServicio, idHotel).then(
                function (rsp) {
                    $modalInstance.close($scope.tablaHoteles.seleccionadas[0].nombreProveedor);

                },
                function (msg) {
                    //window.alert(msg);
                }
            );



        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    
         
		 
		

        $scope.tablaHoteles = {
            configuracion: {
			
                pageable: false,
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: false,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single",
                scrollable: true, height: 200,
                toolbar: false,
                columns: [
					{ field: "nombreProveedor", type: "string", title: "hotel", width: 120 },
					
                ]
            },
            contextual: [
                
				

               
                    
                   
            ]




        }
		
		
		$scope.tablaHoteles.datos = parent.data;
		

      
        //Main
       

        
        
        
      
    }
]);

