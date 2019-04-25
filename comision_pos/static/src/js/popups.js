odoo.define('comision_pos.popups', function (require) {
"use strict";

    var PopupWidget = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');

    var popup_orderline_comision = PopupWidget.extend({
        template: 'popup_orderline_comision',
        show: function (options) {
            var self = this;
            options = options || {};
            
            this._super(options);                      
            this.renderElement();            
           
            $('.confirm').click(function () {
                self.click_confirm();
            });
            /*$('.cancel').click(function () {
                self.gui.close_popup();
            });*/            
        },        
        click_confirm: function () {
            var infos = {
                'acs_lavador' : this.$('input[name=acs_lavador]').val(),
                'acs_ticket' : this.$('input[name=acs_ticket]').val(),
                'acs_supervisor' : this.$('select[name=acs_supervisor]').val(),
            }; 

            var valid = true;
            if(this.options.validate_info){
                valid = this.options.validate_info.call(this, infos);
            }

            if(!valid) return;

            this.gui.close_popup();
            if (this.options.confirm) {
                this.options.confirm.call(this, infos);
            }
        }
    });
    gui.define_popup({name: 'popup_orderline_comision', widget: popup_orderline_comision});

return PopupWidget;
});