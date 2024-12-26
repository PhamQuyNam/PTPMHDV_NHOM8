from flask import Flask
from flask_cors import CORS
from .extension import db, ma
from .jwt.auth import auth_bp, init_jwt  # Import auth module
from .books.controller import books
from .Cart.controller import cart
from .image.controller import images
from library.User.controller import user_bp
from library.Hoa_Don.controller import hoa_don_bp
from library.Quantri.controller import quan_tri_bp
from library.Voucher.controller import voucher_bp
from library.chat_bot.controller import chat_bot
import os

def create_db(app):
    if not os.path.exists("library/library.db"):
        with app.app_context():
            db.create_all()
            print("Created DB!")

def create_app(config_file="config.py"):
    app = Flask(__name__)
    CORS(app)  # Khởi tạo CORS để máy ngoài server cũng có thể truy cập vào
    app.config.from_pyfile(config_file)
    
    # Khởi tạo JWT
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Thay đổi thành một khóa bí mật ngẫu nhiên
    init_jwt(app)

    db.init_app(app)
    ma.init_app(app)
    create_db(app)

    # Đăng ký các blueprint
    app.register_blueprint(cart)
    app.register_blueprint(books)
    app.register_blueprint(images)
    app.register_blueprint(user_bp)
    app.register_blueprint(hoa_don_bp)
    app.register_blueprint(quan_tri_bp)
    app.register_blueprint(voucher_bp)
    app.register_blueprint(chat_bot)
    app.register_blueprint(auth_bp)  # Đăng ký blueprint cho auth

    return app