angular.module("app").directive("pageTitle", [
    function () {
        return {
            restrict: "A",
            scope: {
                title: "@ptTitle",
                liquidacion: "=ptLiquidacion"
            },
            link: function (scope, element, attrs) {
                var _paint = function (withData) {
                    var expediente = "expediente: ", guia = "guía: ";
                    if (withData) {
                        expediente += scope.liquidacion.Expediente.NroExpediente + " (" + scope.liquidacion.Expediente.Titulo + ")";
                        guia += scope.liquidacion.Expediente.Guia.Nombre;
                    }
                    var $title = $("<h3>").append($("<span>", {class: "label label-default"}).text(scope.title)),
                        $subtitle = $("<h4>").html(expediente + "<br/>" + guia);
                    element.empty().append($title).append($subtitle);
                };
                var _paintStep = 0; // 0: sin pintado, 1: pintado vacío, 2: pintado con datos
                scope.$watch("liquidacion", function () {
                    if (!scope.liquidacion && _paintStep == 0) { _paintStep = 1; _paint(false); }
                    else if (scope.liquidacion && _paintStep == 1) { _paintStep = 2; _paint(true); }
                });
            }
        };
    }
]).directive('sptNumber', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            options: "&sptNumber"
        },
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            scope.options = _.extend({ decimalPlaces: 0, negative: false }, scope.options());
            var re = new RegExp("[0-9]" + (scope.options.decimalPlaces > 0 ? "|\\." : "") + (scope.options.negative ? "|-" : ""));
            element.css({ textAlign: "right" }).on('keypress', function (ev) {
                if (!re.test(String.fromCharCode(ev.charCode))) {
                    ev.preventDefault();
                    return false;
                }
            });
        }
    };
}).directive('sptHour', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            
            element.on('keypress', function (ev) {
                var kc = ev.keyCode || ev.which;
                if ((kc >= 48 && kc <= 57)) {
                    if ((ev.target.value.length) == 2) ev.target.value += ':';
                } else if ((kc == 8 || kc == 9 || kc == 46 || (kc >= 37 && kc <= 40))) {
                } else { ev.preventDefault(); return false; }
            });

            element.on('blur', function (ev) {
                var v = "";
                if (/\d{2}:\d{2}/.test(ev.target.value)) {
                    var hm = ev.target.value.split(":"), h = parseInt(hm[0], 10), m = parseInt(hm[1], 10);
                    if (h < 0 || h > 23 || m < 0 || m > 59) v = "";
                    else v = hm[0] + ":" + hm[1];
                }
                ev.target.value = v;
            });

        }
    };

}).directive('sptDate', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;

            element.on('keypress', function (ev) {
                var kc = ev.keyCode || ev.which;
                if ((kc >= 48 && kc <= 57)) {
                    if (((ev.target.value.length) == 2) || ((ev.target.value.length) == 5)) ev.target.value += '/';
                } else if ((kc == 8 || kc == 9 || kc == 46 || (kc >= 37 && kc <= 40))) {
                } else { ev.preventDefault(); return false; }
            });

            element.on('blur', function (ev) {
                var v = "";
                if (/\d{2}\/\d{2}\/\d{2,4}/.test(ev.target.value)) {
                    var dmy = ev.target.value.split("/"), y = parseInt((dmy[2].length == 2 ? "20" + dmy[2] : dmy[2]), 10);
                    if (isNaN(Date.parse(y + "-" + dmy[1] + "-" + dmy[0]))) v = "";
                    else v = dmy[0] + "/" + dmy[1] + "/" + y;
                }
                ev.target.value = v;
            });

        }
    };

}).directive('parentDraggable', function ($document) {
    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            options: "&parentDraggable"
        },
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            //scope.options = _.extend({ parent: 'modal-dialog'}, scope.options());
            console.log(scope.options() );

            var $parent = element.closest("." + scope.options.parent);
            var startX = 0,
              startY = 0,
              x = 0,
              y = 0;
            $parent.css({
                position: 'fixed',
                cursor: 'move'
            });
            $parent.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                $parent.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    };

});