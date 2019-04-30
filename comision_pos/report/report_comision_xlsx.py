# -*- coding: utf-8 -*-

import logging

from odoo.report import report_sxw
from odoo.addons.report_xlsx_helper.report.abstract_report_xlsx import \
    AbstractReportXlsx

_logger = logging.getLogger(__name__)


class ComisionPosReportXlsx(AbstractReportXlsx):
    def _get_ws_params(self, wb, data, employee):
        template = {
            'date': {
                'header': {
                    'value': 'FECHA',
                },
                'data': {
                    'value': self._render("line['order_data']"),
                },
            },'ticket': {
                'header': {
                    'value': 'TICKET',
                },
                'data': {
                    'value': self._render("line['ticket']"),
                },
                'width': 35,
            },'code': {
                'header': {
                    'value': 'CODIGO',
                },
                'data': {
                    'value': self._render("line['product_code']"),
                },
                'width': 10,
            },'name': {
                'header': {
                    'value': 'DESCRIPCION',
                },
                'data': {
                    'value': self._render("line['product_name']"),
                },
                'width': 35,
            },'qty': {
                'header': {
                    'value': 'CANT',
                },
                'data': {
                    'value': self._render("line['product_qty']"),
                },
                'width': 5,
            },'price': {
                'header': {
                    'value': 'PVS/ITBIS',
                },
                'data': {
                    'value': self._render("line['product_price']"),
                },
                'width': 15,
            },'total': {
                'header': {
                    'value': 'TOTAL',
                },
                'data': {
                    'value': self._render("line['total']"),
                },
                'width': 15,
            },'lavador': {
                'header': {
                    'value': 'LAVADOR',
                },
                'data': {
                    'value': self._render("line['lavador']"),
                },
                'width': 15,
            },'tasa_lav': {
                'header': {
                    'value': '% LAVADOR',
                },
                'data': {
                    'value': self._render("line['tasa_lavador']"),
                },
                'width': 5,
            },'com_lav': {
                'header': {
                    'value': 'COMISION LAVADOR',
                },
                'data': {
                    'value': self._render("line['com_lavador']"),
                },
                'width': 5,
            },'supervisor': {
                'header': {
                    'value': 'SUPERVISOR',
                },
                'data': {
                    'value': self._render("line['supervisor']"),
                },
                'width': 15,
            },'tasa_sup': {
                'header': {
                    'value': '% SUPERVISOR',
                },
                'data': {
                    'value': self._render("line['tasa_sup']"),
                },
                'width': 5,
            },'com_sup': {
                'header': {
                    'value': 'COMISION SUPERVISOR',
                },
                'data': {
                    'value': self._render("line['com_lavador']"),
                },
                'width': 5,
            },
        }

        wanted_list = ['date', 'ticket', 'code', 'name', 'qty', 'total',
                       'lavador', 'tasa_lav', 'com_lav', 'supervisor',
                       'tasa_sup', 'com_sup'
                       ]

        ws_params = {
            'ws_name': 'Comision Punto de Ventas',
            'generate_ws_method': '_generate_comision',
            'title': 'Comision Punto de Ventas',
            'wanted_list': wanted_list,
            'col_specs': template,
        }

        return [ws_params]

    def _generate_comision(self, workbook, ws, ws_params, data, employee):
        ws.set_portrait()
        ws.fit_to_pages(1, 0)
        ws.set_header(self.xls_headers['standard'])
        ws.set_footer(self.xls_footers['standard'])

        self._set_column_width(ws, ws_params)

        row_pos = 0

        row_pos = self._write_ws_title(ws, row_pos, ws_params)

        row_pos = self._write_line(
            ws, row_pos, ws_params, col_specs_section='header',
            default_format=self.format_theader_yellow_left)

        for line in data['data']:

            row_pos = self._write_line(
                ws, row_pos, ws_params, col_specs_section='data',
                render_space={'line': line},
                default_format=self.format_tcell_left)


ComisionPosReportXlsx('report.comision_pos.report_xlsx',
                          'wizard.comision.report')
