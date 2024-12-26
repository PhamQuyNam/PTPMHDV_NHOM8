from flask import Blueprint
from .services import (du_bao_7ngay,du_bao_doanh_thu_1nam,du_bao__doanh_thu_1nam_theo_thang,du_bao_doanh_thu_7ngay,du_bao_3thang,du_bao_1nam,du_bao_1nam_theo_thang)
from flask_jwt_extended import jwt_required

chat_bot = Blueprint("chat_bot", __name__)

# @chat_bot.route('/chat', methods=['POST'])
# def chat_bot_message():
#     # return chat()
#     return 0

@chat_bot.route('/du_bao_hoa_don/7ngay', methods=['GET'])
@jwt_required()
def du_bao_7():
    return du_bao_7ngay()

@chat_bot.route('/du_bao_hoa_don/3thang', methods=['GET'])
@jwt_required()
def du_bao_3th():
    return du_bao_3thang()

@chat_bot.route('/du_bao_hoa_don/1nam', methods=['GET'])
@jwt_required()
def du_bao_1_nam():
    return du_bao_1nam()
@chat_bot.route('/du_bao_hoa_don/theothang', methods=['GET'])
@jwt_required()
def du_bao_theo_thang():
    return du_bao_1nam_theo_thang()

@chat_bot.route('/du_bao_doanh_thu/7ngay', methods=['GET'])
@jwt_required()
def du_bao_dt_7():
    return du_bao_doanh_thu_7ngay()

@chat_bot.route('/du_bao_doanh_thu/theothang', methods=['GET'])
@jwt_required()
def du_bao_dt_thang():
    return du_bao__doanh_thu_1nam_theo_thang()

@chat_bot.route('/du_bao_doanh_thu/1nam', methods=['GET'])
@jwt_required()
def du_bao_dt_nam():
    return du_bao_doanh_thu_1nam()