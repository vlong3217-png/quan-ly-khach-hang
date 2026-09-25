from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str


class LoginResponse(BaseModel):
    success: bool
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
