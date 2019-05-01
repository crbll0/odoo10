# -*- coding: utf-8 -*-
{
    'name': "POS Report for Commision",

    'summary': """
    """,

    'description': """
    """,

    'author': "GrowIT",
    'website': "",

    'category': 'Uncategorized',
    'version': '0.1',

    'depends': ['base', 'point_of_sale', 'report_xlsx', 'report_xlsx_helper'],

    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'report/report_comision.xml',
        'wizard/wizard.xml',

    ],
    'qweb': ['static/src/xml/*.xml'],
}