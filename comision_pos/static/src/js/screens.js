odoo.define('comision_pos.screens', function (require) {
"use strict";

    var screens = require('point_of_sale.screens');
    var custom_popups = require('comision_pos.popups');
    var core = require('web.core');
    
    var _t = core._t;    
    var QWeb = core.qweb;


    screens.ProductScreenWidget.include({

        click_product: function(product) {
            if(product.to_weight && this.pos.config.iface_electronic_scale){
                this.gui.show_screen('scale',{product: product});
            } else {
                this.pos.get_order().add_product(product);
            }

            if (_.contains(this.pos.comision_product_ids, product.id)){

                var line = this.pos.get_order().get_last_orderline();
                if (line) {
                    this.gui.show_popup('popup_orderline_comision', {
                        title: _t('Line Commission'),
                        lavador: line.get_line_comision_lavador(),
                        ticket: line.get_line_comision_ticket(),
                        supervisor: line.get_line_comision_supervisor(),
                        validate_info: function(infos){
                            this.$('input').removeClass('error');
                            if(!infos.acs_lavador) {
                                this.$('input[name=acs_lavador]').addClass('error');
                                this.$('input[name=acs_lavador]').focus();
                                return false;
                            }
                            if(!infos.acs_ticket) {
                                this.$('input[name=acs_ticket]').addClass('error');
                                this.$('input[name=acs_ticket]').focus();
                                return false;
                            }
                            return true;
                        },
                        confirm: function (infos) {
                            line.set_line_comision_lavador(infos['acs_lavador']);
                            line.set_line_comision_ticket(infos['acs_ticket']);
                            line.set_line_comision_supervisor(infos['acs_supervisor']);
                        }
                    });
                    
                }

            }
            
        },

    });

    var button_orderline_comision = screens.ActionButtonWidget.extend({
        template: 'button_orderline_comision',
        button_click: function () {
            var line = this.pos.get_order().get_selected_orderline();
            if (line) {
                if (_.contains(this.pos.comision_product_ids, line.product.id)){
                    this.gui.show_popup('popup_orderline_comision', {
                        title: _t('Line Commission'),
                        lavador: line.get_line_comision_lavador(),
                        ticket: line.get_line_comision_ticket(),
                        supervisor: line.get_line_comision_supervisor(),
                        validate_info: function(infos){
                            this.$('input').removeClass('error');
                            if(!infos.acs_lavador) {
                                this.$('input[name=acs_lavador]').addClass('error');
                                this.$('input[name=acs_lavador]').focus();
                                return false;
                            }
                            if(!infos.acs_ticket) {
                                this.$('input[name=acs_ticket]').addClass('error');
                                this.$('input[name=acs_ticket]').focus();
                                return false;
                            }
                            return true;
                        },
                        confirm: function (infos) {
                            line.set_line_comision_lavador(infos['acs_lavador']);
                            line.set_line_comision_ticket(infos['acs_ticket']);
                            line.set_line_comision_supervisor(infos['acs_supervisor']);
                        }
                    });
                } else {
                    this.pos.gui.show_popup('confirm', {
                        title: 'Warning',
                        body: 'This product is Supposed to have commission data.'
                    })
                }
                
            } else {
                this.pos.gui.show_popup('confirm', {
                    title: 'Warning',
                    body: 'Please select line first.'
                })
            }
        }
    });

    screens.define_action_button({
        'name': 'button_orderline_comision',
        'widget': button_orderline_comision,
        'condition': function () {
            return this.pos.config.comision_id;
        } 
    });

return screens;
});