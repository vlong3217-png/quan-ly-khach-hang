from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
)
from app.services.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=LoginResponse
)
def login(request: LoginRequest):
    result = login_user(
        email=request.email,
        password=request.password
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng"
        )
    return {
        "success": True,
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": result["user"]
    }
