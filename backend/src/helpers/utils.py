import random
import hashlib
from typing import Dict, List


def generate_random_string(size=16) -> str:
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return ''.join(random.choice(ALPHABET) for _ in range(size))


def combine_hash(salt: str, password: str) -> str:
    combined = f'{salt}{password}'.encode('utf-8')
    return hashlib.sha256(combined).hexdigest()


def arrays_as_dict(keys: List[str], values: List[str]) -> Dict[str, str]:
    if len(keys) != len(values):
        raise ValueError(
            f"Keys ({keys}) must be equal to length of values ({values})"
        )
    
    return dict(zip(keys, values))

def arrays_as_dict_array(keys: List[str], values: List[List[str]]) -> List[Dict[str, str]]:
    return [arrays_as_dict(keys, val) for val in values]
