from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "Password123!"
stored_hash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W"

print(f"Password: {password}")
print(f"Stored hash: {stored_hash}")
print(f"Hash length: {len(stored_hash)}")

# Test verification
try:
    result = pwd_context.verify(password, stored_hash)
    print(f"Password verification result: {result}")
except Exception as e:
    print(f"Verification error: {e}")

# Also test creating a new hash
new_hash = pwd_context.hash(password)
print(f"New hash would be: {new_hash}")
print(f"New hash verification: {pwd_context.verify(password, new_hash)}")
