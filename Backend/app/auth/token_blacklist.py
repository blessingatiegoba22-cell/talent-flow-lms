from typing import Set
import threading

# Thread-safe token blacklist
_token_blacklist: Set[str] = set()
_blacklist_lock = threading.Lock()

def add_to_blacklist(token: str) -> None:
    """Add a token to the blacklist"""
    with _blacklist_lock:
        _token_blacklist.add(token)

def is_blacklisted(token: str) -> bool:
    """Check if a token is blacklisted"""
    with _blacklist_lock:
        return token in _token_blacklist

def remove_from_blacklist(token: str) -> None:
    """Remove a token from the blacklist (if needed)"""
    with _blacklist_lock:
        _token_blacklist.discard(token)
