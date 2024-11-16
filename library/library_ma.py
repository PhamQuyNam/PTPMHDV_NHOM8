from .extension import ma


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'address', 'phone_numbers')


class CatSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')


class AuthorSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')

class ImgSchema(ma.Schema):
    class Meta:
        fields = ( 'book_id','image_data')

# class BorrowSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'book_id', 'student_id', 'borrow_date', 'return_date')


class BookSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'page_count', 'author_id', 'category_id')

# class ImageSchema(ma.Schema):
#     class Meta:
#         fields = ('id')

class CartSchema(ma.Schema):
    class Meta:
        fields = ('id', 'book_id','user_id','price', 'quantity')
class Hoa_DonSchema(ma.Schema):
    class Meta:
        fields = ('id_HoaDon','user_id','address','phone_number','Sum_price' )

