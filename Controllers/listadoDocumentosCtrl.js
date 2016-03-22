angular.module("app").controller("listadoDocumentosCtrl", [
"$scope", "$route", "$window", "$http", "$location", "$filter", "proveedoresSvc", "base64", "fileManager", "token",
    function ($scope, $route, $window, $http, $location, $filter, proveedoresSvc, base64, fileManager, token) {

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
		
		

       
        $scope.obtenerListadoDocumentos = function ($event) {
            var idProveedor = $scope.model.idProveedor;
			
            proveedoresSvc.obtenerListadoDocumentos().then(
                function (rsp) {
                   
					
					
                    $scope.tablaDocumentos.datos = rsp.data.documentacion;
                    
                },
                function (msg) {
                    //window.alert(msg);
                }
            );
        };
		
		$scope.descargarDocumento = function () {
            var url = window.spt.apiUrl + 'v1/proveedor/ficheros';
            var path = $scope.tablaDocumentos.seleccionadas[0].idProveedoresOnlineDocumentacion + "-" + $scope.tablaDocumentos.seleccionadas[0].nombreFichero;

            return fileManager.download(url, path, token.getToken());
        };
		
		
		
		$scope.tablaDocumentos = {
            configuracion: {
                pageable: { pageSize: 200, buttonCount: 10 },
                sortable: true,
                filterable: { mode: "menu", extra:true },
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false,
                selectable: "single",
                scrollable: true, height: $window.innerHeight-200,
                toolbar: false,
                columns: [
                    { field: "tipo", type: "string", title: "doc type", width: 35,},
                    { field: "descripcion", type: "string", title: "description", width: 120  },
					{ field: "nombreFichero", type: "string", title: "Fichero", width: 60  },//template: "<a href='http://sigo.specialtours.com/proveedores/documentosProveedores/#=idProveedor#/#=idProveedoresOnlineDocumentacion#-#=nombreFichero#' target='_blank'>#=nombreFichero#</a>"
					
                ]
            },
             contextual: [
               
                    
                   
            ]




        }
		
		
		 $scope.obtenerListadoDocumentos();
		
		
		
	}
        
]);

