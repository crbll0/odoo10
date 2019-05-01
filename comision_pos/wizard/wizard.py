# -*- coding: utf-8 -*-

import logging
from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class WizardCommisionReport(models.Model):
    _name = 'wizard.comision.report'
    _description = 'Wizard POS Commision Report'

    date_from = fields.Datetime(string='Desde', required=1)
    date_to= fields.Datetime(string='Hasta', required=1, default=fields.Datetime.now())

    @api.multi
    def generate_report(self):

        order_lines = self.env['pos.order.line'].search(
            [('order_id.date_order', '>=', self.date_from),
             ('order_id.date_order', '<=', self.date_to)]
        ).filtered('num_lavador')

        data = []
        for l in order_lines:
            comision_obj = l.order_id.session_id.config_id.comision_id
            if comision_obj:
                tasas = comision_obj.line_ids.search(
                    [('product_id', '=', l.product_id.id)]
                )

                total = l.price_subtotal * l.qty

                data.append({
                    'product_code': l.product_id.default_code,
                    'product_name': l.product_id.name,
                    'product_price': l.price_subtotal,
                    'product_qty': l.qty,
                    'total': total,
                    'tasa_lavador': tasas.tasa_lavador,
                    'tasa_supervisor': tasas.tasa_supervisor,
                    'ticket': l.num_ticket,
                    'lavador': l.num_lavador,
                    'supervisor': l.supervisor,
                    'com_sup': tasas.tasa_supervisor * (total),
                    'com_lav': tasas.tasa_lavador * (total),
                    'order_date': l.order_id.date_order,
                    'order_ncf': '',  # l.order_id.ncf_invoice_related,
                    'order_name': l.order_id.name,
                })

        datas = {
            'ids': self._context.get('active_ids', []),
            'model': 'wizard.comision.report',
            'data': data,
            'form': self.read()[0],
        }

        for field in datas['form'].keys():
            if isinstance(datas['form'][field], tuple):
                datas['form'][field] = datas['form'][field][0]

        return {
            'type': 'ir.actions.report.xml',
            'report_name': 'comision_pos.report_xlsx',
            'datas': datas,
            'name': 'Comision'
        }
