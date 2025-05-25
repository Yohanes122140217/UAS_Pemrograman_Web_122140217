from marshmallow import Schema, fields, validate

class UserSignupSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=6))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))

class UserLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)