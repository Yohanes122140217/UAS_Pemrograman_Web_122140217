# backend/ecommerce/schemas/product.py
from marshmallow import Schema, fields

class ProductSchema(Schema):
    id             = fields.Int(dump_only=True)
    name           = fields.Str(required=True)
    seller         = fields.Str(dump_only=True)
    description    = fields.Str(allow_none=True)
    price          = fields.Float(required=True)
    original_price = fields.Float(allow_none=True)
    image_url      = fields.Str(allow_none=True)
    rating         = fields.Float(allow_none=True)
    sold           = fields.Int(allow_none=True)
    stock          = fields.Int(allow_none=True)
