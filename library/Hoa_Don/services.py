from datetime import datetime
from library.extension import db
from library.library_ma import BookSchema, AuthorSchema
from library.model import Author, Books, Category, Hoa_Don, User, Cart
from flask import request, jsonify
from sqlalchemy.sql import func
import json

def add_hoa_don_service():
    user_id = request.json.get('user_id')

    if user_id:
        # Lấy thông tin người dùng từ bảng User
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Người dùng không tồn tại!"}), 404
        
        # Lấy tất cả sản phẩm trong giỏ hàng của người dùng này
        cart_items = Cart.query.filter_by(user_id=user_id).all()
        if not cart_items:
            return jsonify({"message": "Giỏ hàng trống!"}), 400

        # Tính tổng giá trị hàng trong giỏ
        total_price = sum(item.price * item.quantity for item in cart_items)

        # Tạo hóa đơn mới với ngày hiện tại
        new_invoice = Hoa_Don(
            user_id=user_id,
            address=user.address,
            phone_number=user.phone_numbers,
            Sum_Price=total_price,
            date=datetime.utcnow()  # Gán ngày hiện tại cho trường `date`
        )
        
        try:
            db.session.add(new_invoice)
            db.session.commit()
            return jsonify({"message": "Hóa đơn đã được thêm thành công!", "id_hoaDon": new_invoice.id_hoaDon}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Không thể thêm hóa đơn!", "error": str(e)}), 400
    else:
        return jsonify({"message": "Lỗi yêu cầu, cần user_id."}), 400

def get_all_hoa_don_service():
    invoices = Hoa_Don.query.all()
    if invoices:
        invoice_list = [{
            "id_hoaDon": invoice.id_hoaDon,
            "user_id": invoice.user_id,
            "address": invoice.address,
            "phone_number": invoice.phone_number,
            "Sum_Price": invoice.Sum_Price,
            "date": invoice.date.strftime("%Y-%m-%d %H:%M:%S")
        } for invoice in invoices]
        return jsonify(invoice_list), 200
    else:
        return jsonify({"message": "Không tìm thấy hóa đơn nào!"}), 404

def get_hoa_don_by_id_service(invoice_id):
    invoice = Hoa_Don.query.get(invoice_id)
    if invoice:
        invoice_details = {
            "id_hoaDon": invoice.id_hoaDon,
            "user_id": invoice.user_id,
            "address": invoice.address,
            "phone_number": invoice.phone_number,
            "Sum_Price": invoice.Sum_Price,
            "date": invoice.date.strftime("%Y-%m-%d %H:%M:%S") 
        }
        return jsonify(invoice_details), 200
    else:
        return jsonify({"message": "Hóa đơn không tìm thấy!"}), 404

def update_hoa_don_service(invoice_id):
    data = request.json
    invoice = Hoa_Don.query.get(invoice_id)

    if invoice:
        if 'user_id' in data:
            invoice.user_id = data['user_id']
        if 'address' in data:
            invoice.address = data['address']
        if 'phone_number' in data:
            invoice.phone_number = data['phone_number']
        if 'Sum_Price' in data:
            invoice.Sum_Price = data['Sum_Price']
        if 'date' in data:
            invoice.date = datetime.strptime(data['date'], "%Y-%m-%d %H:%M:%S")

        try:
            db.session.commit()
            return jsonify({"message": "Hóa đơn đã được cập nhật thành công!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Không thể cập nhật hóa đơn!", "error": str(e)}), 400
    else:
        return jsonify({"message": "Hóa đơn không tìm thấy!"}), 404

def delete_hoa_don_service(invoice_id):
    invoice = Hoa_Don.query.get(invoice_id)
    if invoice:
        try:
            db.session.delete(invoice)
            db.session.commit()
            return jsonify({"message": "Hóa đơn đã được xóa thành công!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Không thể xóa hóa đơn!", "error": str(e)}), 400
    else:
        return jsonify({"message": "Hóa đơn không tìm thấy!"}), 404


# Lấy tất cả hóa đơn của một người dùng theo user_id
def get_invoices_by_user_service(user_id):
    # Lấy danh sách hóa đơn của người dùng dựa trên user_id
    invoices = Hoa_Don.query.filter_by(user_id=user_id).all()
    
    if invoices:
        # Tạo danh sách các hóa đơn với thông tin chi tiết
        invoice_list = [{
            "id_hoaDon": invoice.id_hoaDon,
            "user_id": invoice.user_id,
            "address": invoice.address,
            "phone_number": invoice.phone_number,
            "Sum_Price": invoice.Sum_Price,
            "date": invoice.date.strftime("%Y-%m-%d %H:%M:%S")
        } for invoice in invoices]
        
        return jsonify(invoice_list), 200
    else:
        return jsonify({"message": "Không tìm thấy hóa đơn nào cho người dùng này!"}), 404
        
def count_invoices_for_specific_day(user_id, date_str):
    # Chuyển đổi chuỗi ngày thành đối tượng datetime
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"message": "Ngày không hợp lệ!"}), 400

    # Truy vấn số lượng hóa đơn cho ngày cụ thể
    invoice_count = db.session.query(func.count(Hoa_Don.id_hoaDon)) \
        .filter(func.date(Hoa_Don.date) == date_obj.date()).scalar()

    if invoice_count is not None and invoice_count > 0:
        return jsonify({"date": date_str, "total_invoices": invoice_count}), 200
    else:
        return jsonify({"message": "Không có hóa đơn nào cho ngày này!"}), 404
    
def count_invoices_for_specific_month(user_id, month_str):
    # Chuyển đổi chuỗi tháng thành đối tượng datetime
    try:
        month_obj = datetime.strptime(month_str, "%Y-%m")
    except ValueError:
        return jsonify({"message": "Tháng không hợp lệ!"}), 400

    # Truy vấn số lượng hóa đơn cho tháng cụ thể
    invoice_count = db.session.query(func.count(Hoa_Don.id_hoaDon)) \
        .filter(func.extract('year', Hoa_Don.date) == month_obj.year) \
        .filter(func.extract('month', Hoa_Don.date) == month_obj.month) \
        .scalar()

    if invoice_count is not None and invoice_count > 0:
        return jsonify({"month": month_str, "total_invoices": invoice_count}), 200
    else:
        return jsonify({"message": "Không có hóa đơn nào cho tháng này!"}), 404

def count_invoices_for_specific_year(user_id, year_str):
    # Chuyển đổi chuỗi năm thành số nguyên
    try:
        year = int(year_str)
    except ValueError:
        return jsonify({"message": "Năm không hợp lệ!"}), 400

    # Truy vấn số lượng hóa đơn cho năm cụ thể
    invoice_count = db.session.query(func.count(Hoa_Don.id_hoaDon)) \
        .filter(func.extract('year', Hoa_Don.date) == year) \
        .scalar()

    if invoice_count is not None and invoice_count > 0:
        return jsonify({"year": year_str, "total_invoices": invoice_count}), 200
    else:
        return jsonify({"message": "Không có hóa đơn nào cho năm này!"}), 404
