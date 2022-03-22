# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # update to mysql endpoint
# SQLALCHEMY_DATABASE_URL = "mysql::"

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# docker exec -it zeit3118_db_1 mysql -h localhost -uroot -p --port=5432 scoreboard
# super_secret_password


