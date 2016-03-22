
angular.module('app').factory("proveedoresSvc", [
    "$http", "$q", "$filter","token",
function ($http, $q, $filter, token) {

        var _api = window.spt.apiUrl + 'v1/';

        return {
           
            // ===============vv SPCALL  vv=================================================
			
			'loginProveedor': function (empresa, usuario, password) {
                return $http.get(_api + 'loginProveedor',
                         {
						     "empresa": empresa,
							 "usuario": usuario,
							 "password": password,
                         },
						 {ignoreLoadingBar:true}
				);
            },
			
            //****Reservas
            'obtenerListadoReservas': function ( fInicio, status, srvPte) {
                return $http.get(_api + 'listadoReservas?fechaInicio='+fInicio+"&status="+status+"&serviciosPendientes="+srvPte,
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
				);
            },
			
            'obtenerListadoServiciosReserva': function ( idReserva, tipoSrv, tipoStatus) {
				var pIdReserva = idReserva? idReserva : ''; 
                return $http.get(_api + 'listadoServiciosReserva/'+pIdReserva+"?tipoServicio="+tipoSrv+"&status="+tipoStatus,
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerListadoObservacionesReserva': function ( idReserva) {
                return $http.get(_api + 'listadoObservacionesReserva/'+idReserva,
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			'editarObservacionReserva': function (idCalendario, usuario,  leido) {
                return $http.post(_api + 'observacionReserva',
                         {
							 "idCalendario": idCalendario,
							 "usuario": usuario,
							 "leido": leido,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'crearContacto': function ( idReserva, nombre, email, localizador) {
                return $http.put(_api + 'contacto',
                         {
							
							 "idReserva": idReserva,
							 "nombre": nombre,
							 "email": email,
							 "localizador": localizador,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			'editarEstadoServicio': function (idReserva, actStatus, textoCalendario,  idReservaServicio, tipoCalendario, listIden) {
                return $http.post(_api + 'estadoServicio',
                         {
							 "idReserva": idReserva,
							 "actStatus": actStatus,
							 "textoCalendario": textoCalendario,
							
							 "idReservaServicio": idReservaServicio,
							 "tipoCalendario": tipoCalendario,
							 "listIden": listIden,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			'obtenerTiposCalendario': function (idGrupo) {
                return $http.get(_api + 'tiposCalendario/'+idGrupo,
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			
		'obtenerInfoVuelo': function (idCiaAerea, numeroVuelo) {
             return $http.get(_api + 'infoVuelo',
                         {
							 "idCiaAerea": idCiaAerea,
							 "numeroVuelo": numeroVuelo
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
        },
		'crearTrasladoPredeterminado': function ( idCiaAerea, numeroVuelo, fechaSalida, idCiudadSalida, idAeropuertoSalida, horaSalida, idCiudadLlegada, idAeropuertoLlegada, horaLlegada, horaRecogida, inOut, notas) {
             return $http.put(_api + 'trasladoPredeterminado',
                         {
							
							 "idCiaAerea": idCiaAerea,
							 "numeroVuelo": numeroVuelo,
							 "fechaSalida": fechaSalida,
							 "idCiudadSalida": idCiudadSalida,
							 "idAeropuertoSalida": idAeropuertoSalida,
							 "horaSalida": horaSalida,
							 "idCiudadLlegada": idCiudadLlegada,
							 "idAeropuertoLlegada": idAeropuertoLlegada,
							 "horaLlegada": horaLlegada,
							 "horaRecogida": horaRecogida,
							 "inOut": inOut,
							 "notas": notas,
							 
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
        },
		
	
	       //****Hoteles
		   

		    'obtenerListadoHotelesAlternativos': function ( idReserva, idReservaServicio) {
                return $http.get(_api + 'listadoHotelesAlternativos?idReserva='+idReserva+"&idReservaServicio="+idReservaServicio,
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			 'editarHotelAlternativo': function (idReservaServicio, idHotel, idPrestatario) {
                return $http.post(_api + 'hotelAlternativo',
                         {
							 "idReservaServicio": idReservaServicio,
							 "idHotel": idHotel,
							 "idPrestatario": idPrestatario,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
             'obtenerListadoVuelosPredeterminados': function () {
                return $http.get(_api + 'listadoVuelosPredeterminados',
                         {
							
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			 'editarVueloPredeterminado': function (idReservaServicio, Traslados, fechaTkt, fechaEmision) {
                return $http.post(_api + 'VueloPredeterminado',
                         {
							"idReservaServicio": idReservaServicio,
							"Traslados": Traslados,
							"fechaTkt": fechaTkt,
							"fechaEmision": fechaEmision,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			//************************Traslados********************************
			 'obtenerListadoTraslados': function () {
			
                return $http.get(_api + 'listadoTraslados',
                         
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerDetalleTraslado': function (idTraslado, idReservaServicio) {
				var pIdTraslado = idTraslado? idTraslado : '';
                return $http.get(_api + 'traslado/'+pIdTraslado+"?idReservaServicio="+idReservaServicio,
                         
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			 'editarTraslado': function (idGestionTrasladosPeticion, idReservaServicio,  usuario, statusServicio, horaTrasladoDesde, horaTrasladoHasta) {
                return $http.post(_api + 'traslado',
                         {
							"idGestionTrasladosPeticion": idGestionTrasladosPeticion,
							"idReservaServicio": idReservaServicio,
							"usuario": usuario,
							"statusServicio": statusServicio,
							"horaTrasladoDesde": horaTrasladoDesde,
							"horaTrasladoHasta": horaTrasladoHasta,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			 'verificarCoste': function (idGestionTrasladosPeticion,  idReservaServicio, costeProveedor, usuario, observacionesCambio, moneda) {
                return $http.post(_api + 'verificarCoste',
                         {
							"idGestionTrasladosPeticion": idGestionTrasladosPeticion,
							"idReservaServicio": idReservaServicio,
							"costeProveedor": costeProveedor,
							"usuario": usuario,
							"observacionesCambio": observacionesCambio,
							"moneda": moneda,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'editarCoste': function (idGestionTrasladosPeticion,  idReservaServicio, costeProveedor, usuario, observaciones, moneda) {
                return $http.post(_api + 'coste',
                         {
							"idGestionTrasladosPeticion": idGestionTrasladosPeticion,
							"idReservaServicio": idReservaServicio,
							"costeProveedor": costeProveedor,
							"usuario": usuario,
							"observaciones": observaciones,
							"moneda": moneda,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'editarTrasladoPickUp': function (idReserva, idReservaServicio, nuevaHora, usuario) {
                return $http.post(_api + 'trasladoPickUp',
                         {
							"idReserva": idReserva,
							"idReservaServicio": idReservaServicio,
							"nuevaHora": nuevaHora,
							"usuario": usuario,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'validarEnviosProveedor': function (codigoValidacion) {
                return $http.post(_api + 'validarEnviosProveedor',
                         {
							"codigoValidacion": codigoValidacion,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'editarServiciosNoShow': function (listServicio) {
                return $http.put(_api + 'serviciosNoShow',
                         {
							"listServicio": listServicio,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			//**********Servicios Expediente
            'obtenerListadoServiciosExpediente': function ( fechaDesde, fechaHasta) {
                return $http.get(_api + 'listadoServiciosExpediente?fechaDesde='+fechaDesde+"&fechaHasta="+fechaHasta,
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'confirmarServiciosExpediente': function (listIdentificadoresPlanilla, listIdentificadoresServicios,  usuario) {
                return $http.post(_api + 'confirmarServiciosExpediente',
                         {
                             
							 "listIdentificadoresPlanilla": listIdentificadoresPlanilla,
							 "listIdentificadoresServicios": listIdentificadoresServicios,
							 "usuario": usuario,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'cambiarPrestatarioServiciosExpediente': function (listIdentificadoresPlanilla, listIdentificadoresServicios, idPrestatario,  usuario) {
                return $http.post(_api + 'cambiarPrestatarioServiciosExpediente',
                         {
                             
							 "listIdentificadoresPlanilla": listIdentificadoresPlanilla,
							 "listIdentificadoresServicios": listIdentificadoresServicios,
							 "idPrestatario": idPrestatario,
							 "usuario": usuario,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerCabeceraExpediente': function (idExpediente) {
                return $http.get(_api + 'cabeceraExpediente',
                         {
							 "idExpediente": idExpediente,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerRoomingListCabecera': function (idExpediente) {
                return $http.get(_api + 'roomingListCabecera',
                         {
                             
							 "idExpediente": idExpediente,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerRoomingListExpediente': function (idExpediente, idPrestatario, fechaInicio, tipoServicio) {
                return $http.get(_api + 'roomingListExpediente?idExpediente='+idExpediente+"&idPrestatario="+idPrestatario+"&fechaInicio="+fechaInicio+"&tipoServicio="+tipoServicio,
                       
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			
			//*****Buses****
			'obtenerListadoBusesPendientesFacturar': function () {
                return $http.get(_api + 'listadoBusesPendientesFacturar',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtieneImporteFacturaBus': function ( listIdentificadoresDetalle) {
                return $http.get(_api + 'importeFacturaBus',
                         {
							
							 "listIdentificadoresDetalle": listIdentificadoresDetalle,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'generarFacturaBuses': function ( listIdentificadoresDetalle, numeroFactura, fechaFactura) {
                return $http.post(_api + 'generarFacturaBuses',
                         {
							
							 "listIdentificadoresDetalle": listIdentificadoresDetalle,
							 "numeroFactura": numeroFactura,
							 "fechaFactura": fechaFactura,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerListadoFacturasBuses': function () {
                return $http.get(_api + 'listadoFacturasBuses',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'eliminarFacturaBus': function ( idGestionBusesFacturasProveedores) {
                return $http.delete(_api + 'facturaBus',
                         {
							
							 "idGestionBusesFacturasProveedores": idGestionBusesFacturasProveedores,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			//facturas
			'obtenerListadoServiciosPendienteFacturar': function () {
                return $http.get(_api + 'listadoServiciosPendienteFacturar',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerRoomingListServicio': function (idReservaServicio) {
                return $http.get(_api + 'roomingListServicio',
                         {
                             "idReservaServicio": idReservaServicio,
							 
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			'obtieneImporteFacturaServicios': function ( listaServicios, listaServiciosExtra) {
                return $http.post(_api + 'obtieneImporteFacturaServicios',
                         {
							 "listaServicios": listaServicios,
							 "listaServiciosExtra": listaServiciosExtra,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'generarFacturaServicios': function ( listaServicios, listaServiciosExtra, numeroFactura, fechaFactura) {
                return $http.post(_api + 'generarFacturaServicios',
                         {
							 "listaServicios": listaServicios,
							 "listaServiciosExtra": listaServiciosExtra,
							  "numeroFactura": numeroFactura,
							 "fechaFactura": fechaFactura,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerListadoFacturasServicios': function () {
                return $http.get(_api + 'listadoFacturasServicios',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'eliminarFacturaServicios': function ( idGestionTrasladoFacturaProveedor) {
                return $http.post(_api + 'eliminarFacturaServicios',
                         {
							 "idGestionTrasladoFacturaProveedor": idGestionTrasladoFacturaProveedor,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			//**************documents****
			'obtenerListadoDocumentos': function () {
                return $http.get(_api + 'listadoDocumentos',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			//**************head phones****
			'obtenerListadoHeadPhones': function () {
                return $http.get(_api + 'listadoHeadPhones',
                       
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'confirmarHeadPhone': function ( idGestionHdph, observacionesProveedor) {
                return $http.post(_api + 'confirmarHeadPhone',
                         {
							 "idGestionHdph": idGestionHdph,
							 "observacionesProveedor": observacionesProveedor,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'confirmarHeadPhoneMulti': function (listIdGestionHdph, observacionesProveedor) {
                return $http.post(_api + 'confirmarHeadPhoneMulti',
                         {
							 "listIdGestionHdph": listIdGestionHdph,
							 "observacionesProveedor": observacionesProveedor,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'validarPrecioHeadPhone': function (idGestionHdph) {
                return $http.post(_api + 'validarPrecioHeadPhone',
                         {
							 "idGestionHdph": idGestionHdph,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'modificarPrecioHeadPhone': function (idGestionHdph, importePropuesto, observacionesProveedor) {
                return $http.post(_api + 'precioHeadPhone',
                         {
							 "idGestionHdph": idGestionHdph,
							 "importePropuesto": importePropuesto,
							 "observacionesProveedor": observacionesProveedor,
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerListadoPendienteFacturarHeadPhones': function () {
                return $http.get(_api + 'listadoPendienteFacturarHeadPhones',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'facturarHeadPhones': function (listIdentificadores, numeroFactura, fechaFactura) {
                return $http.post(_api + 'facturarHeadPhones',
                         {
							 "listIdentificadores": listIdentificadores,
							 "numeroFactura": numeroFactura,
							 "fechaFactura": fechaFactura,
							
                         },
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerListadoFacturasHeadPhones': function () {
                return $http.get(_api + 'listadoFacturasHeadPhones',
                         
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			
			 //****Seguros
            'obtenerListadoSeguros': function () {
                return $http.get(_api + 'listadoSeguros',
                        
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
				);
            },
			//*****Maestros********************
			'obtenerMaestroProveedores': function () {
                return $http.get(_api + 'maestroProveedores',
                  
						 {"cache": true}
						 //{"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerMaestroCiasAereas': function () {
                return $http.get(_api + 'maestroCiasAereas',
                 
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerMaestroCiudades': function () {
                return $http.get(_api + 'maestroCiudades',
                 
						 {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            },
			'obtenerMaestroTerminalesTraslados': function () {
                return $http.get(_api + 'maestroTerminalesTraslados',
                 
					   {"headers": {"Authorization" : "Bearer "+token.getToken()}}
                );
            }
        };
    }
])
.factory('token', function(base64) {
    var token;
    return{
        getToken: function(){
            return token;
        },
        getDecodedPayload:function(){
            return token === undefined ? {} : JSON.parse(base64.urldecode(token.split('.')[1])) ;
        },
        setToken:function(tk){
            token = tk;
        }
    };
});

