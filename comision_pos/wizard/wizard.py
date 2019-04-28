# -*- coding: utf-8 -*-

import logging
from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class WizardCommisionReport(models.Model):
    _name = 'wizard.comision.report'
    _description = 'Wizard POS Commision Report'

    date_from = fields.Datetime(string='Desde', required=1)
    date_to= fields.Datetime(string='Hasta', required=1)

    @api.multi
    def generate_report(self):

        order_lines = self.env['pos.order.line'].search(
            [('order_id.date_order', '>=', self.date_from),
             ('order_id.date_order', '<=', self.date_to)]
        ).filtered(lambda l: len(l.num_lavador) > 1)

        _logger.info(order_lines)

        data = []

        for l in order_lines:
            comision_obj = l.order_id.session_id.config_id.commision_id
            if comision_obj:
                tasas = comision_obj.line_ids.search(
                    [('product_id', '=', l.product_id.id)]
                )

                data.append({
                    'product_code': l.product_id.default_code,
                    'product_name': l.product_id.name,
                    'product_price': l.price_subtotal,
                    'tasa_lavador': tasas.tasa_lavador,
                    'tasa_supervisor': tasas.tasa_supervisor,
                    'ticket': l.num_ticket,
                    'lavador': l.num_lavador,
                    'supervisor': l.supervisor,
                    'order_date': l.order_id.date_order,
                    'order_ncf': l.order_id.ncf_invoice_related,
                    'order_name': l.order_id.name,
                })
        _logger.info(data)