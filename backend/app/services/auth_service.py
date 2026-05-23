from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def register_user(db: Session, username: str, email: str, password: str):
    existing_email = get_user_by_email(db, email)
    if existing_email:
        raise ValueError("Email already exists")

    existing_username = get_user_by_username(db, username)
    if existing_username:
        raise ValueError("Username already exists")

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": str(user.id)
    })

    return user, token


def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")

    token = create_access_token({
        "sub": str(user.id)
    })

    return user, token