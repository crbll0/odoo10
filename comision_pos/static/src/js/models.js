odoo.define('comision_pos.models', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var exports = models.exports;

    //load new fields
    //models.load_fields("pos.config", ['comision_id']);

    models.load_models([
        {
            model: 'res.users',
            fields: ['name', 'supervisor_pos'],
            domain: function (self) {
                return [['supervisor_pos', '=', true]];
            },
            loaded: function (self, supervisors) {
                self.supervisor_ids = [];
                
                _.map(supervisors, function (supervisor) {
                    supervisor.items = [];
                    self.supervisor_ids.push(supervisor['id']);
                });
                self.supervisors = supervisors;
            }
        },
        {
            model: 'comision.config_line',
            fields: ['config_id', 'product_id', 'tasa_lavador', 'tasa_supervisor'],
            domain: function(self,tmp){ 
                if (self.config.comision_id[0]){
                    return [['config_id','=',self.config.comision_id[0]]];
                } else {
                    return [['config_id','=',false]];
                }
                 
            },
            loaded: function (self, comision_lines) {
                self.comision_line_ids = [];
                self.comision_product_ids = [];
                _.map(comision_lines, function (comision_line) {
                    comision_line.items = [];
                    self.comision_line_ids.push(comision_line['id']);
                    self.comision_product_ids.push(comision_line['product_id'][0]);
                });
                self.comision_lines = comision_lines;
            }
        },
        
    ]);

    var _super_Orderline = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function (attributes, options) {
            var res = _super_Orderline.initialize.apply(this, arguments);
            this.num_lavador = this.num_lavador || "";
            this.num_ticket = this.num_ticket || "";
            this.supervisor = this.supervisor || "";
            return res;
        },
        init_from_JSON: function (json) {
            var res = _super_Orderline.init_from_JSON.apply(this, arguments);
            if (json.num_lavador) {
               this.num_lavador = this.set_line_comision_lavador(json.num_lavador);
            }
            if (json.num_ticket) {
               this.num_ticket = this.set_line_comision_ticket(json.num_ticket);
            }
            if (json.supervisor) {
               this.supervisor = this.set_line_comision_supervisor(json.supervisor);
            }
        },
        export_as_JSON: function () {
            var json = _super_Orderline.export_as_JSON.apply(this, arguments);
            if (this.num_lavador) {
                json.num_lavador = this.get_line_comision_lavador();
            }
            if (this.num_ticket) {
                json.num_ticket = this.get_line_comision_ticket();
            }
            if (this.supervisor) {
                json.supervisor = this.get_line_comision_supervisor();
            }
            return json;
        },
        clone: function () {
            var orderline = _super_Orderline.clone.call(this);
            orderline.num_lavador = this.num_lavador;
            orderline.num_ticket = this.num_ticket;
            orderline.supervisor = this.supervisor;
            return orderline;
        },
        export_for_printing: function () {
            var receipt_line = _super_Orderline.export_for_printing.apply(this, arguments);
            receipt_line['num_lavador'] = this.num_lavador || '';
            receipt_line['num_ticket'] = this.num_ticket || '';
            receipt_line['supervisor'] = this.supervisor || '';
            return receipt_line;
        },  

        set_line_comision_lavador: function (num_lavador) {
            this.num_lavador = num_lavador;
            this.trigger('change', this);
        },
        get_line_comision_lavador: function () {            
            return this.num_lavador;
        },

        set_line_comision_ticket: function (num_ticket) {
            this.num_ticket = num_ticket;
            this.trigger('change', this);
        },
        get_line_comision_ticket: function () {            
            return this.num_ticket;
        },

        set_line_comision_supervisor: function (supervisor) {
            this.supervisor = supervisor;
            this.trigger('change', this);
        },
        get_line_comision_supervisor: function () {            
            return this.supervisor;
        },
        get_line_comision_supervisor_name: function () {
            var self = this;
            self.name = '';
            _.each(this.pos.supervisors, function (supervisor) {
                if (supervisor.id==self.supervisor){
                    self.name = supervisor['name'];
                }
            });
            return self.name;
        },

    });

return models;
});