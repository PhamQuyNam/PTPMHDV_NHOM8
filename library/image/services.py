import base64
from flask import request, jsonify, send_file
from library.library_ma import ImgSchema
from library.extension import db  # Thay đổi với import thực tế của bạn
from library.model import Img ,Books # Thay đổi với import thực tế của bạn
import io

img_schema = ImgSchema()

# def add_image_service():
#     data = request.json
#     if data and ('book_id' in data) and ('image_data' in data):
#         book_id = data['book_id']
#         image_data = data['image_data']  # Giả sử bạn gửi ảnh dưới dạng chuỗi base64

#         try:
#             # Chuyển đổi dữ liệu hình ảnh từ chuỗi base64 thành nhị phân
#             if image_data.startswith('data:image/'):
#                 header, encoded = image_data.split(',', 1)
#                 binary_data = base64.b64decode(encoded)

#                 new_image = Img(book_id=book_id, image_data=binary_data)
#                 db.session.add(new_image)
#                 db.session.commit()
#                 return jsonify({"message": "Image added successfully!"}), 200
#             else:
#                 return jsonify({"message": "Invalid image data format."}), 400

#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"message": "Cannot add image!", "error": str(e)}), 400
#     else:
#         return jsonify({"message": "Request error"}), 400

def add_img_service():
    data = request.json
    if data and ('book_id' in data) and ('image_data' in data):
        book_id = data['book_id']
        image_data = data['image_data']

        try:
            new_img = Img(book_id=book_id, image_data=image_data)
            db.session.add(new_img)
            db.session.commit()
            return jsonify({"message": "Add success!"}), 200
        except Exception as e:
            db.session.rollback() 
            return jsonify({"message": "Cannot add image!", "error": str(e)}), 400
    else:
        return jsonify({"message": "Request error"}), 400


def get_all_images_service(book_id):
    try:
        # Lấy tất cả các ảnh từ cơ sở dữ liệu dựa trên book_id
        print(f"Fetching all images for book_id: {book_id}")
        images = Img.query.filter_by(book_id=book_id).all()
        
        if images:
            print(f"Found {len(images)} images, preparing to send.")
            # Mã hóa tất cả các ảnh thành base64
            encoded_images = []
            for image in images:
                # Vì image_data đã là base64 string, không cần băm lại, chỉ cần lấy trực tiếp từ DB
                encoded_image = image.image_data  # Trực tiếp lấy từ cơ sở dữ liệu
                encoded_images.append(encoded_image)
            
            return jsonify({"images": encoded_images}), 200
        else:
            print("No images found.")
            return jsonify({"message": "No images found for this book."}), 404
            
    except Exception as e:
        print(f"Error retrieving images: {str(e)}")
        return jsonify({"message": "Error retrieving images.", "error": str(e)}), 500

# def get_image_service(book_id):
#     try:
#         # Lấy ảnh từ cơ sở dữ liệu dựa trên book_id
#         image = Img.query.filter_by(book_id=book_id).first()
        
#         if image:
#             # Chuyển đổi dữ liệu nhị phân thành một đối tượng BytesIO để gửi
#             image_bytes = io.BytesIO(image.image_data)
#             return send_file(image_bytes, mimetype='image/jpeg')  # Thay đổi mimetype nếu cần
#         else:
#             return jsonify({"message": "Image not found for this book."}), 404
            
#     except Exception as e:
#         return jsonify({"message": "Error retrieving image.", "error": str(e)}), 500