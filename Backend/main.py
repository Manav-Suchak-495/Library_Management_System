# main.py
import os
import jwt
import urllib
import string
import random
import secrets
import smtplib
import psycopg2
import traceback
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from Auth import SECRET_KEY, ALGORITHM, load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie, Request


app = FastAPI()
load_dotenv()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lms-six-wine.vercel.app"
]

@app.middleware("http")
async def force_cors_preflight(request: Request, call_next):
    origin = request.headers.get("Origin")
    
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
        connection = psycopg2.connect(connection_uri,cursor_factory=RealDictCursor)
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e

@app.post("/Login")
def login(payload: dict,response: Response,db: psycopg2.extensions.connection = Depends(get_db_connection),):
    try:
        email = payload.get("email")
        password = payload.get("password")
        print(email,password)
        with db.cursor() as cursor:
            cursor.execute( "SELECT * FROM user_data WHERE user_email=%s AND user_password=%s", (email, password), )
            user = cursor.fetchone()
            cursor.close()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        token = create_jwt_token(user_email=email, user_name=user["user_name"],user_role=user["user_role"],otp=None)
        return {"Authenticated": True, "Token" : token}

    except Exception:
        traceback.print_exc()
        raise

def generate_otp():
    return str(random.randint(100000, 999999))

def send_email(email: string, name: string, otp: string, password: string, role: string):

    message = MIMEMultipart()
    message["From"] = os.getenv("SMTP_SENDER")
    message["To"] = email
    

    if otp and otp != '':
        message["Subject"] = "Your One-Time Password (OTP)"
        body = f"""
        Hello,

        Your One-Time Password (OTP) for verification is: {otp}

        This OTP is valid for 5 minutes. Please do not share it with anyone.

        Best regards,
        LMS
        """
    elif password and password != '':
        message["Subject"] = "LMS Credentials"
        body = f"""
        Hello,

        ThankYou for being with LMS 
        Your new secure password for verification and login is: {password}

        Best regards,
        LMS
        """

    message.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(os.getenv("SMTP_SERVER"), os.getenv("SMTP_PORT"))
        server.starttls()
        
        server.login(os.getenv("SMTP_SENDER"), os.getenv("SMTP_PASSWORD"))
        server.sendmail(os.getenv("SMTP_SENDER"), email, message.as_string())
        if otp and otp != '':
            print(f"OTP sent successfully to {email}!")
            Token = create_jwt_token(user_email=email, user_name=name, otp=otp, user_role=role)
            return {"Authenticated" : True, "Token" : Token}
        if password and password != '':
            print(f"Login Credentials sent successfully to {email}!")
            Token = create_jwt_token(user_email=email, user_name=name, otp=otp, user_role=role)
            return {"Authenticated" : True, "Token" : Token}
    except Exception as e:
        print(f"Failed to send email: {e}")
        return None
    finally:
        server.quit()


@app.post("/otp")
def send_otp(payload: dict, db: psycopg2.extensions.connection = Depends(get_db_connection)):
    if payload.get("signup"):
        email = payload.get("email")
        role = ''
        name = ''
    else:
        email = payload.get("email")
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM user_data WHERE user_email=%s",(email,))
            user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        email = user['user_email']
        role = user['user_role']
        name = user['user_name']
        
    otp = generate_otp()
    return send_email(email=email, name=name, otp=otp, role=role, password='')
    

def generate_secure_password(length=8):
    all_characters = string.ascii_letters + string.digits + "#?$@_!"
    password = []
    password += [secrets.choice(all_characters) for i in range(length)]
    secrets.SystemRandom().shuffle(password)
    return "".join(password)

@app.post("/verify-otp")
def send_otp(payload: dict, db: psycopg2.extensions.connection = Depends(get_db_connection)):
    Token = verify_jwt_token(payload.get('Token'))
    if int(payload.get("otp")) == int(Token.get('otp')):
        user_email=Token.get('user_email')
        if payload.get('forgot'):
            try: 
                user_password = generate_secure_password()
                with db.cursor() as cursor:
                    cursor.execute("UPDATE user_data SET user_password = %s WHERE user_email = %s",(user_password, user_email))
                    db.commit()
                send_email(email=user_email, role='', otp='', name=Token.get('user_name'),password=user_password)
                token = create_jwt_token(user_email=user_email, user_name=Token.get('user_name'),user_role=Token.get('user_role'),otp=None)
                return {"Authenticated": True, "Token" : token}
            except Exception as e:
                db.rollback()
                traceback.print_stack(e)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database error: {str(e)}"
                )
        else:
            issue_email = Token.get('user_email')
            issue_to = Token.get('user_name')
            issue_isbn = payload.get('issue_isbn')
            issue_title = payload.get('issue_title')
            issue_status = payload.get('issue_status')
            issue_by = payload.get('issue_by')
            if payload.get("signup") and payload.get("issue"):
                user_email = payload.get('user_email')
                user_name = " ".join(payload.get('user_name').split()).capitalize()
                user_mobile = payload.get('user_mobile')
                user_password = generate_secure_password()
                try: 
                    with db.cursor() as cursor:
                        cursor.execute("INSERT INTO user_data (user_name, user_email, user_password, user_mobile, user_role) VALUES(%s, %s, %s, %s, %s)",(user_name,user_email,user_password,user_mobile, 'Reader'))
                        cursor.execute("INSERT INTO issue_data(issue_email, issue_to, issue_isbn, issue_title, issue_status, issue_by) VALUES(%s, %s, %s, %s, %s, %s)", (issue_email, user_email, issue_isbn, issue_title, issue_status, issue_by))
                        cursor.execute("UPDATE book_data SET copy_count = copy_count - 1, issued_count = issued_count + 1 WHERE book_isbn = %s",(issue_isbn,))
                        db.commit()
                        return send_email( email=user_email, name='', role=Token.get('user_name'), otp='', password=user_password)
                except Exception as e:
                    db.rollback()
                    traceback.print_stack(e)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Database error: {str(e)}"
                    )
                
            elif not payload.get("signup") and payload.get("issue"):
                try: 
                    with db.cursor() as cursor:
                        cursor.execute("INSERT INTO issue_data(issue_email, issue_to, issue_isbn, issue_title, issue_status, issue_by) VALUES(%s, %s, %s, %s, %s, %s)", (issue_email, issue_to, issue_isbn, issue_title, issue_status, issue_by))
                        cursor.execute("UPDATE book_data SET copy_count = copy_count - 1, issued_count = issued_count + 1 WHERE book_isbn = %s",(issue_isbn,))
                        db.commit()
                        return {"Authenticated" : True}
                except Exception as e:
                    db.rollback()
                    traceback.print_stack(e)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Database error: {str(e)}"
                    )
            elif not payload.get("signup") and not payload.get("issue"):
                try: 
                    with db.cursor() as cursor:
                        cursor.execute("INSERT INTO issue_data(issue_email, issue_to, issue_isbn, issue_title, issue_status) VALUES(%s, %s, %s, %s, %s, %s)", (issue_email, issue_to, issue_isbn, issue_title, issue_status))
                        db.commit()
                        return {"Authenticated" : True}
                except Exception as e:
                    db.rollback()
                    traceback.print_stack(e)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Database error: {str(e)}"
                    )


@app.post("/verify-session")
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
@app.post("/isAdmin")
def verify_admin(payload: dict):
    
    if not payload.get("Token"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session missing. Please log in."
        )
    user_data = verify_jwt_token(payload.get("Token"))
    
    if not user_data or user_data["user_role"] != "Admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired or invalid token."
        )
    return {"isAdmin": True, "user_email": user_data["user_email"]}

@app.post("/books/add")
def add_books(payload: dict, response: Response, db: psycopg2.extensions.connection = Depends(get_db_connection)):
    isbn = payload.get("isbn").strip()
    title = " ".join(payload.get("title").split()).capitalize()
    author = " ".join(payload.get("author").split()).capitalize()
    publisher = " ".join(payload.get("publisher").split()).title().capitalize()
    category = payload.get("category")
    copy_count = payload.get("finalCopyCount", 1) 
    issued_count = payload.get("issuedCount", 0)
    book_status = payload.get("status")
    book_description = payload.get("description").strip() if payload.get("description") or payload.get("desciption") != '' else "No Description"
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

@app.get("/books/fetch")
def getBookData(db: psycopg2.extensions.connection = Depends(get_db_connection)):
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM book_data ORDER BY RANDOM();")
            books = cursor.fetchall()
            cursor.close()
            return books
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch books from database: {str(e)}"
        )

    
def create_jwt_token(user_email: string, user_name: string, user_role: string, otp: int):
    """Generates a secure, encrypted JWT token that expires in 1 hour"""
    if user_email and user_role and user_role != '':
        expiration = datetime.now(timezone.utc) + timedelta(hours=1)
        payload = {
            "sub": user_email,
            "name": user_name,
            "role": user_role,
            "otp": otp,
            "exp": expiration,
            "iat": datetime.now(timezone.utc)
        }
    else:
        expiration = datetime.now(timezone.utc) + timedelta(minutes=5)
        payload = {
            "sub": user_email,
            "nmae": user_name,
            "role": user_role,
            "otp": otp,
            "exp": expiration,
            "iat": datetime.now(timezone.utc)
        }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return { "user_email": decoded_payload.get("sub"), "user_name": decoded_payload.get("name"), "user_role": decoded_payload.get("role"), "otp": decoded_payload.get('otp')}
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None