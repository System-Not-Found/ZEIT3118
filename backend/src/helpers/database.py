from typing import List, Tuple
import mysql.connector
from helpers.sql import init_commands

class Database():
    def __init__(self):
        print("Attempting to connect to database...")
        self.database = mysql.connector.connect(
            host='db',
            port=3306,
            user="root",
            password="admin",
            database="scoreboard"
        )
        print("Database connected!")
 
        for command in init_commands:
            self.database.reconnect()
            cursor = self.database.cursor()
            cursor.execute(command)
            cursor.close()


    def __validate_query_against_type(query: str, type: str) -> None:
        if query.strip()[:len(type)].upper() != type.upper():
            raise ValueError(f"Query provided is not a valid {type} query")

    def select(self, query: str, *args) -> Tuple:
        Database.__validate_query_against_type(query, 'select')
        cursor = self.database.cursor() 
        try:
            cursor.execute(query, args)
            result = cursor.fetchone()
            cursor.close()
            return result
        except Exception as err:
            cursor.close()  
            raise err

    def selectall(self, query: str, *args) -> List[Tuple]:
        Database.__validate_query_against_type(query, 'select')
        cursor = self.database.cursor()
        try:
            cursor.execute(query, args)
            result = cursor.fetchall()
            cursor.close()
            return result
        except Exception as err:
            if cursor is not None:
                cursor.close()  
            raise err

    def delete(self, query: str, *args) -> None:
        Database.__validate_query_against_type(query, 'delete')
        cursor = self.database.cursor()
        try:
            cursor.execute(query, args)
            self.database.commit()
            cursor.close()
        except Exception as err:
            if cursor is not None:
                cursor.close()  
            raise err

    def insert(self, query: str, *args) -> str:
        Database.__validate_query_against_type(query, 'insert')
        cursor = self.database.cursor()
        try:    
            cursor.execute(query, args)
            self.database.commit()
            id = cursor.lastrowid
            cursor.close()
            return id
        except Exception as err:
            if cursor is not None:
                cursor.close()  
            raise err

    def update(self, query: str, *args) -> str:
        Database.__validate_query_against_type(query, 'update')
        cursor = self.database.cursor()
        try:            
            cursor.execute(query, args)
            self.database.commit()
            id = cursor.lastrowid
            cursor.close()
            return id
        except Exception as err:
            if cursor is not None:
                cursor.close()  
            raise err