from app.database import SessionLocal, User, AuditLog, Base, engine
import bcrypt

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if not db.query(User).filter(User.username == "admin").first():
        hashed_pw = get_password_hash("admin123")
        admin_user = User(username="admin", hashed_password=hashed_pw, role="admin")
        db.add(admin_user)
        
    if not db.query(User).filter(User.username == "dispatcher").first():
        hashed_pw = get_password_hash("dispatch123")
        dispatch_user = User(username="dispatcher", hashed_password=hashed_pw, role="dispatcher")
        db.add(dispatch_user)

    db.add(AuditLog(user="system", action="DB_INIT", details="Database seeded with initial users."))
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
