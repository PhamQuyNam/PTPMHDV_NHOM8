from transformers import pipeline
from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet
# # Sử dụng mô hình nhẹ: DistilGPT-2
# # model = pipeline("text-generation", model="distilgpt2") # Tiếng anh   
# # model = pipeline("text-generation", model="EleutherAI/gpt-neo-125M") #Rất ổn tiếng anhanh
# model = pipeline("text-generation", model="bigscience/bloom-560m") #OK biết tiếng việt tốc độ tbinh
# # model = pipeline("text2text-generation", model="google/flan-t5-small")# nhanh ngắn nhưng 0 đầy đủ tiếng anhanh

# def chat():
#     # Lấy câu hỏi từ yêu cầu người dùng
#     user_input = request.json.get("message")
#     if not user_input:
#         return jsonify({"reply": "Vui lòng nhập câu hỏi!"})
    
#     # Trả lời bằng mô hình
#     response = model(user_input, max_length=200, do_sample=True, temperature=0.7)
#     return jsonify({"reply": response[0]['generated_text']})

def du_bao_7ngay():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'so_hoa_don': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet() # model timequeries
    model.fit(du_lieu) #model học trên cái data mình traintrain

    # Dự báo cho 7 ngày tiếp theo
    du_bao_tuong_lai_7ngay = model.make_future_dataframe(periods=7)  # Dự báo 7 ngày
    du_bao_7ngay = model.predict(du_bao_tuong_lai_7ngay)

    # Đổi tên các cột và làm tròn dữ liệu
    def rename_and_round(df):
        return df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'Ngày', 
            'yhat': 'Dự đoán', 
            'yhat_lower': 'Dự báo thấp nhất', 
            'yhat_upper': 'Dự đoán cao nhất'
        }).round(0)

    # Lấy chỉ 7 ngày dự báo
    du_bao_7ngay_rename = rename_and_round(du_bao_7ngay.tail(7))

    # Tính tổng số hóa đơn trong 7 ngày dự báo
    tong_hoa_don_7ngay = du_bao_7ngay_rename['Dự đoán'].sum()

    # Thêm tổng số hóa đơn vào kết quả trả về
    du_bao_7ngay_rename['Tổng số hóa đơn'] = tong_hoa_don_7ngay

    return jsonify(du_bao_7ngay_rename.to_dict(orient='records'))

def du_bao_3thang():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'so_hoa_don': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 3 tháng tới (90 ngày)
    du_bao_tuong_lai_3thang = model.make_future_dataframe(periods=90)  # Dự báo 3 tháng (90 ngày)
    du_bao_3thang = model.predict(du_bao_tuong_lai_3thang)

    # Đổi tên các cột và làm tròn dữ liệu
    def rename_and_round(df):
        return df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'Ngày', 
            'yhat': 'Dự đoán', 
            'yhat_lower': 'Dự báo thấp nhất', 
            'yhat_upper': 'Dự đoán cao nhất'
        }).round(0)

    # Lấy chỉ 3 tháng dự báo
    du_bao_3thang_rename = rename_and_round(du_bao_3thang.tail(90))

    # Tính tổng số hóa đơn trong 3 tháng dự báo
    tong_hoa_don_3thang = du_bao_3thang_rename['Dự đoán'].sum()

    # Thêm tổng số hóa đơn vào kết quả trả về
    du_bao_3thang_rename['Tổng số hóa đơn'] = tong_hoa_don_3thang

    return jsonify(du_bao_3thang_rename.to_dict(orient='records'))

def du_bao_1nam():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'so_hoa_don': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 1 năm tới (365 ngày)
    du_bao_tuong_lai_1nam = model.make_future_dataframe(periods=365)  # Dự báo 1 năm (365 ngày)
    du_bao_1nam = model.predict(du_bao_tuong_lai_1nam)

    # Đổi tên các cột và làm tròn dữ liệu
    def rename_and_round(df):
        return df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'Ngày', 
            'yhat': 'Dự đoán', 
            'yhat_lower': 'Dự báo thấp nhất', 
            'yhat_upper': 'Dự đoán cao nhất'
        }).round(0)

    # Lấy chỉ 1 năm dự báo
    du_bao_1nam_rename = rename_and_round(du_bao_1nam.tail(365))

    # Tính tổng số hóa đơn trong 1 năm dự báo
    tong_hoa_don_1nam = du_bao_1nam_rename['Dự đoán'].sum()

    # Thêm tổng số hóa đơn vào kết quả trả về
    du_bao_1nam_rename['Tổng số hóa đơn'] = tong_hoa_don_1nam

    return jsonify(du_bao_1nam_rename.to_dict(orient='records'))

def du_bao_1nam_theo_thang():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'so_hoa_don': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 1 năm tới (365 ngày)
    du_bao_tuong_lai_1nam = model.make_future_dataframe(periods=365)  # Dự báo 1 năm (365 ngày)
    du_bao_1nam = model.predict(du_bao_tuong_lai_1nam)

    # Thêm cột tháng
    du_bao_1nam['month'] = du_bao_1nam['ds'].dt.to_period('M')

    # Tổng hợp theo tháng
    du_bao_theo_thang = du_bao_1nam.groupby('month').agg({
        'yhat': 'sum',
        'yhat_lower': 'sum',
        'yhat_upper': 'sum'
    }).reset_index()

    # Đổi tên các cột
    du_bao_theo_thang = du_bao_theo_thang.rename(columns={
        'month': 'Tháng',
        'yhat': 'Dự đoán',
        'yhat_lower': 'Dự báo thấp nhất',
        'yhat_upper': 'Dự đoán cao nhất'
    }).round(0)

    # Lọc ra 12 tháng mới nhất
    du_bao_theo_thang = du_bao_theo_thang.tail(12)

    # Tính tổng số hóa đơn trong 1 năm dự báo
    tong_hoa_don_1nam = du_bao_theo_thang['Dự đoán'].sum()

    # Thêm tổng số hóa đơn vào kết quả trả về
    du_bao_theo_thang['Tổng số hóa đơn (1 năm)'] = tong_hoa_don_1nam

    # Chuyển đổi cột 'Tháng' thành chuỗi để tuần tự hóa JSON
    du_bao_theo_thang['Tháng'] = du_bao_theo_thang['Tháng'].astype(str)

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(du_bao_theo_thang.to_dict(orient='records'))

#Doanh thu
def du_bao_doanh_thu_7ngay():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'doanh_thu': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 7 ngày tiếp theo
    du_bao_tuong_lai_7ngay = model.make_future_dataframe(periods=7)  # Dự báo 7 ngày
    du_bao_7ngay = model.predict(du_bao_tuong_lai_7ngay)

    # Đổi tên các cột và làm tròn dữ liệu
    def rename_and_round(df):
        return df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'Ngày', 
            'yhat': 'Dự đoán', 
            'yhat_lower': 'Dự báo thấp nhất', 
            'yhat_upper': 'Dự đoán cao nhất'
        }).round(0)

    # Lấy chỉ 7 ngày dự báo
    du_bao_7ngay_rename = rename_and_round(du_bao_7ngay.tail(7))

    # Tính tổng doanh thu trong 7 ngày dự báo
    tong_doanh_thu_7ngay = du_bao_7ngay_rename['Dự đoán'].sum()

    # Thêm tổng doanh thu vào kết quả trả về
    du_bao_7ngay_rename['Tổng doanh thu'] = tong_doanh_thu_7ngay

    return jsonify(du_bao_7ngay_rename.to_dict(orient='records'))

def du_bao__doanh_thu_1nam_theo_thang():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'doanh_thu': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 1 năm tới (365 ngày)
    du_bao_tuong_lai_1nam = model.make_future_dataframe(periods=365)  # Dự báo 1 năm (365 ngày)
    du_bao_1nam = model.predict(du_bao_tuong_lai_1nam)

    # Thêm cột tháng
    du_bao_1nam['month'] = du_bao_1nam['ds'].dt.to_period('M')

    # Tổng hợp theo tháng
    du_bao_theo_thang = du_bao_1nam.groupby('month').agg({
        'yhat': 'sum',
        'yhat_lower': 'sum',
        'yhat_upper': 'sum'
    }).reset_index()

    # Đổi tên các cột
    du_bao_theo_thang = du_bao_theo_thang.rename(columns={
        'month': 'Tháng',
        'yhat': 'Dự đoán doanh thu',
        'yhat_lower': 'Dự báo thấp nhất',
        'yhat_upper': 'Dự đoán cao nhất'
    }).round(0)

    # Lọc ra 12 tháng mới nhất
    du_bao_theo_thang = du_bao_theo_thang.tail(12)

    # Tính tổng doanh thu trong 1 năm dự báo
    tong_doanh_thu_1nam = du_bao_theo_thang['Dự đoán doanh thu'].sum()

    # Thêm tổng doanh thu vào kết quả trả về
    du_bao_theo_thang['Tổng doanh thu (1 năm)'] = tong_doanh_thu_1nam

    # Chuyển đổi cột 'Tháng' thành chuỗi để tuần tự hóa JSON
    du_bao_theo_thang['Tháng'] = du_bao_theo_thang['Tháng'].astype(str)

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(du_bao_theo_thang.to_dict(orient='records'))


def du_bao_doanh_thu_1nam():
    # Đọc file CSV
    duong_dan_file = r"C:\Users\QUANGHONEY\Desktop\Code\Data\du_lieu_hoa_don.csv"  # Đường dẫn file dữ liệu
    du_lieu = pd.read_csv(duong_dan_file)

    # Tiền xử lý dữ liệu
    du_lieu['ngay_ban'] = pd.to_datetime(du_lieu['ngay_ban'])  # Định dạng cột ngày bán
    du_lieu = du_lieu.rename(columns={'ngay_ban': 'ds', 'doanh_thu': 'y'})  # Đổi tên các cột

    # Tạo và huấn luyện mô hình Prophet
    model = Prophet()
    model.fit(du_lieu)

    # Dự báo cho 1 năm tới (365 ngày)
    du_bao_tuong_lai_1nam = model.make_future_dataframe(periods=365)  # Dự báo 1 năm (365 ngày)
    du_bao_1nam = model.predict(du_bao_tuong_lai_1nam)

    # Đổi tên các cột và làm tròn dữ liệu
    def rename_and_round(df):
        return df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'Ngày', 
            'yhat': 'Dự đoán', 
            'yhat_lower': 'Dự báo thấp nhất', 
            'yhat_upper': 'Dự đoán cao nhất'
        }).round(0)

    # Lấy chỉ 1 năm dự báo
    du_bao_1nam_rename = rename_and_round(du_bao_1nam.tail(365))

    # Tính tổng số hóa đơn trong 1 năm dự báo
    tong_hoa_don_1nam = du_bao_1nam_rename['Dự đoán'].sum()

    # Thêm tổng số hóa đơn vào kết quả trả về
    du_bao_1nam_rename['Tổng số hóa đơn'] = tong_hoa_don_1nam

    return jsonify(du_bao_1nam_rename.to_dict(orient='records'))