from flask import Blueprint
from .services import (add_hoa_don_service,count_invoices_for_specific_year,count_invoices_for_specific_month,count_invoices_for_specific_day, get_invoices_by_user_service,get_all_hoa_don_service, get_hoa_don_by_id_service, update_hoa_don_service, delete_hoa_don_service)

hoa_don_bp = Blueprint("HoaDon", __name__)

@hoa_don_bp.route("/add_hoa_don", methods=['POST'])
def add_hoa_don():
    return add_hoa_don_service()

@hoa_don_bp.route("/hoa_don", methods=['GET'])
def get_all_hoa_don():
    return get_all_hoa_don_service()

@hoa_don_bp.route("/hoa_don/<int:invoice_id>", methods=['GET'])
def get_hoa_don_by_id(invoice_id):
    return get_hoa_don_by_id_service(invoice_id)

@hoa_don_bp.route("/hoa_don/<int:invoice_id>", methods=['PUT'])
def update_hoa_don(invoice_id):
    return update_hoa_don_service(invoice_id)

@hoa_don_bp.route("/hoa_don/<int:invoice_id>", methods=['DELETE'])
def delete_hoa_don(invoice_id):
    return delete_hoa_don_service(invoice_id)

@hoa_don_bp.route("/hoa_don_user_id/<int:user_id>", methods=['GET'])
def get_hoa_don_user(user_id):
    return get_invoices_by_user_service(user_id)

@hoa_don_bp.route("/hoa_don_date/<int:user_id>/<string:date_str>", methods=['GET'])
def count_hoa_don_by_date(user_id, date_str):
    return count_invoices_for_specific_day(user_id, date_str)

@hoa_don_bp.route("/hoa_don_month/<int:user_id>/<string:date_str>", methods=['GET'])
def count_hoa_don_by_month(user_id, date_str):
    return count_invoices_for_specific_month(user_id, date_str)

@hoa_don_bp.route("/hoa_don_year/<int:user_id>/<string:date_str>", methods=['GET'])
def count_hoa_don_by_year(user_id, date_str):
    return count_invoices_for_specific_year(user_id, date_str)
