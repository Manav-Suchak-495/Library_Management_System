# main.py
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie, Request
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.errors import UniqueViolation
from psycopg2.extras import RealDictCursor
import jwt
from datetime import datetime, timedelta, timezone
import os
from Auth import SECRET_KEY, ALGORITHM, load_dotenv
import urllib

app = FastAPI()
load_dotenv()

# Allow your frontend port to bypass the browser security model
origins = [
    "http://localhost:5173", # Default Vite + React port
    "http://127.0.0.1:5173",
    "https://lms-six-wine.vercel.app"
]

@app.middleware("http")
async def force_cors_preflight(request: Request, call_next):
    origin = request.headers.get("Origin")
    
    # 1. Determine if the origin is allowed
    is_allowed = False

    if origin:
        if origin in origins or origin.endswith(".onrender.com"):
            is_allowed = True

    allowed_origin = origin if is_allowed else "http://localhost:5173"
    if request.method == "OPTIONS":
        response = Response(status_code=200)
        response.headers["Access-Control-Allow-Origin"] = allowed_origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, QUERY, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    # Process actual requests (like QUERY)
    response = await call_next(request)
    
    # Inject CORS headers into the final response as well
    response.headers["Access-Control-Allow-Origin"] = allowed_origin
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, QUERY, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


def get_db_connection():
    db_host = os.getenv("DB_HOST").strip()
    db_port = os.getenv("DB_PORT").strip()
    db_name = os.getenv("DB_NAME").strip()
    db_user = os.getenv("DB_USER").strip()
    db_password = os.getenv("DB_PASSWORD", "").strip()
    encoded_user = urllib.parse.quote_plus(db_user)
    encoded_password = urllib.parse.quote_plus(db_password)

    connection_uri = f"postgresql://{encoded_user}:{encoded_password}@{db_host}:{db_port}/{db_name}?sslmode=require"
    try:
        print(f"DEBUG: Connecting to host={db_host}, user={db_user}")
        print(f"DEBUG: Is password present? {'YES' if db_password else 'NO'}")
        connection = psycopg2.connect(connection_uri)
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e
"""@app.post("/Login")
def get_sample_user(payload: dict, response: Response, db: psycopg2.extensions.connection = Depends(get_db_connection)):
    email = payload.get("email")
    password = payload.get("password")
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM user_data WHERE user_email = %s AND user_password = %s", (email, password))
        user = cursor.fetchone()
        cursor.close()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found in the Library System"
        )
    response.set_cookie(
        key="token",
        value=create_jwt_token(email,user["user_role"]),
        httponly=True,       
        secure=True,     
        samesite="none",
        max_age=3600
    )
    return {'Authenticated': True}"""
import traceback

@app.post("/Login")
def login(
    payload: dict,
    response: Response,
    db: psycopg2.extensions.connection = Depends(get_db_connection),
):
    try:
        email = payload.get("email")
        password = payload.get("password")
        print(email,password)
        with db.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM user_data WHERE user_email=%s AND user_password=%s",
                (email, password),
            )
            user = cursor.fetchone()

        print("USER =", user)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        token = create_jwt_token(email, user[5])
        print("TOKEN CREATED")

        return {"Authenticated": True, "Token" : token}

    except Exception:
        traceback.print_exc()
        raise

@app.api_route("/verify-session", methods=["QUERY"])
def verify_session(payload: dict):
    
    if not payload.get("Token"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session missing. Please log in."
        )
    user_data = verify_jwt_token(payload.get("Token"))
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired or invalid token."
        )
    return {"authenticated": True}
@app.get("/isAdmin")
def verify_admin(token: str | None = Cookie(None)):
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session missing. Please log in."
        )
    user_data = verify_jwt_token(token)
    
    if not user_data or user_data["user_role"] != "Admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired or invalid token."
        )
    return {"isAdmin": True, "user_email": user_data["user_email"]}

@app.post("/books/add")
def get_sample_user(payload: dict, response: Response, db: psycopg2.extensions.connection = Depends(get_db_connection)):
    isbn = payload.get("isbn").strip()
    title = " ".join(payload.get("title").split())
    author = " ".join(payload.get("author").split())
    publisher = " ".join(payload.get("publisher").split()).title()
    category = payload.get("category")
    copy_count = payload.get("finalCopyCount", 1) 
    issued_count = payload.get("issuedCount", 0)
    book_status = payload.get("status")
    book_description = payload.get("description").strip() if payload.get("description") else "No Description"
    added_by = payload.get("addedBy")
    try:
        with db.cursor() as cursor:
            cursor.execute("INSERT INTO book_data (book_isbn, book_title, book_author, book_publisher, book_category, copy_count, issued_count, book_status, book_description, added_by) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                            (isbn, title, author, publisher, category, copy_count, issued_count, book_status, book_description, added_by))
            db.commit()
    except UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A book with ISBN '{isbn}' already exists."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    
    return {"success": True, "message": f"Book '{title}' successfully added to the catalog."}

@app.api_route("/books/fetch", methods=["QUERY"])
def getBookData(payload: dict,db: psycopg2.extensions.connection = Depends(get_db_connection)):
    try:
        with db.cursor() as cursor:
            if not payload :
                cursor.execute("SELECT * FROM book_data")
                books = cursor.fetchall()
                cursor.close()
                return books
            else :
                queryFilter = payload.get("queryFilter")
                cursor.execute("SELECT * FROM book_data WHERE book_title LIKE %s OR book_author LIKE %s OR book_isbn LIKE %s OR book_category LIKE %s OR book_publisher LIKE %s OR book_status LIKE %s;",(f"%{queryFilter}%", f"%{queryFilter}%", f"%{queryFilter}%", f"%{queryFilter}%", f"%{queryFilter}%",  f"%{queryFilter}%"))
                books = cursor.fetchall()
                cursor.close()
                return books
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch books from database: {str(e)}"
        )

    
def create_jwt_token(user_email: str, user_role: str):
    """Generates a secure, encrypted JWT token that expires in 1 hour"""
    expiration = datetime.now(timezone.utc) + timedelta(hours=1)
    
    payload = {
        "sub": user_email,
        "role": user_role,
        "exp": expiration,
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return { "user_email": decoded_payload.get("sub"), "user_role": decoded_payload.get("role")}
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None