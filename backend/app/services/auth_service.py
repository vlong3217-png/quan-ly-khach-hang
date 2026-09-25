from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

fake_user = {
    "id": 1,
    "email": "admin@gmail.com",
    "username": "admin",
    "full_name": "Admin",
    "role": "ADMIN",
    "is_active": True,
    "hashed_password": hash_password("123456"),
}


def authenticate_user(
    identifier: str,
    password: str
):
    clean_identifier = (identifier or "").strip().lower()

    # Check if identifier matches either email or username
    if (
        clean_identifier != fake_user["email"].lower()
        and clean_identifier != fake_user["username"].lower()
    ):
        return None

    if not verify_password(
        password,
        fake_user["hashed_password"]
    ):
        return None

    if not fake_user["is_active"]:
        return None

    return fake_user


def login_user(
    identifier: str,
    password: str
):
    user = authenticate_user(identifier, password)
    if not user:
        return None

    access_token = create_access_token({
        "sub": user["email"],
        "id": user["id"],
        "role": user["role"],
    })

    return {
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
        }
    }
