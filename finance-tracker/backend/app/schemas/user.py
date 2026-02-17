from pydantic import BaseModel, EmailStr

# What user sends when registering
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

# What user sends when logging in
class UserLogin(BaseModel):
    email: str
    password: str

# What we send back (NO password)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# What we send back after login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse