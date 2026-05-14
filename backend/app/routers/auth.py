import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.database import get_users_collection

router = APIRouter(prefix="/api/auth", tags=["authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("JWT_SECRET", "railvision-hackathon-secret-key-2024")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "user"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            return None
        collection = await get_users_collection()
        user = await collection.find_one({"email": email})
        return user
    except JWTError:
        return None


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    collection = await get_users_collection()
    existing = await collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "email": req.email,
        "full_name": req.full_name,
        "hashed_password": pwd_context.hash(req.password),
        "role": req.role,
        "created_at": datetime.utcnow(),
    }
    result = await collection.insert_one(user_doc)
    token = create_access_token({"sub": req.email, "role": req.role})
    return TokenResponse(
        access_token=token,
        user={"id": str(result.inserted_id), "email": req.email, "full_name": req.full_name, "role": req.role},
    )


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    collection = await get_users_collection()
    user = await collection.find_one({"email": req.email})
    if not user or not pwd_context.verify(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"], "role": user.get("role", "user")})
    return TokenResponse(
        access_token=token,
        user={"id": str(user["_id"]), "email": user["email"], "full_name": user["full_name"], "role": user.get("role", "user")},
    )


@router.post("/demo-login", response_model=TokenResponse)
async def demo_login():
    """Quick demo login for hackathon judges."""
    collection = await get_users_collection()
    user = await collection.find_one({"email": "demo@railvision.ai"})
    if not user:
        user_doc = {
            "email": "demo@railvision.ai",
            "full_name": "Demo User",
            "hashed_password": pwd_context.hash("demo123"),
            "role": "user",
            "created_at": datetime.utcnow(),
        }
        result = await collection.insert_one(user_doc)
        user = {**user_doc, "_id": result.inserted_id}
    token = create_access_token({"sub": user["email"], "role": user.get("role", "user")})
    return TokenResponse(
        access_token=token,
        user={"id": str(user["_id"]), "email": user["email"], "full_name": user["full_name"], "role": user.get("role", "user")},
    )


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"id": str(user["_id"]), "email": user["email"], "full_name": user["full_name"], "role": user.get("role", "user")}
