from passlib.context import CryptContext
import os

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
password = 'Password123!'
new_hash = pwd_context.hash(password)
print(f'New hash: {new_hash}')

# Update the database using psql
os.system(f"psql -U postgres -d talent_flow_db -c \"UPDATE admins SET hashed_password = '{new_hash}' WHERE email = 'admin@talentflow.com';\"")
