import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = "./data/pragati.db"

def init_db():
    """Initialize the SQLite database and tables."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create feedback table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id TEXT NOT NULL,
        challenge TEXT,
        rating INTEGER NOT NULL,
        implementation_status TEXT NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Simple migration: try to add challenge column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE feedback ADD COLUMN challenge TEXT")
    except sqlite3.OperationalError:
        pass # Column likely already exists

    # Migration: add conversation_id
    try:
        cursor.execute("ALTER TABLE feedback ADD COLUMN conversation_id INTEGER")
    except sqlite3.OperationalError:
        pass 
    
    # Create conversations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Create messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        module_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
    )
    """)
    
    conn.commit()
    conn.close()

def save_feedback(data: Dict[str, Any]) -> int:
    """Save feedback to the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO feedback (module_id, challenge, rating, implementation_status, comments, conversation_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data['module_id'], 
        data.get('challenge', ''), 
        data['rating'], 
        data['implementation_status'], 
        data.get('comments'),
        data.get('conversation_id'),
        datetime.utcnow().isoformat() + 'Z'
    ))
    
    feedback_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return feedback_id

def get_all_feedback() -> List[Dict[str, Any]]:
    """Retrieve all feedback from the database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # To return dict-like objects
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC")
    rows = cursor.fetchall()
    
    feedback_list = []
    for row in rows:
        feedback_list.append(dict(row))
        
    conn.close()
    return feedback_list

def get_feedback_stats() -> Dict[str, Any]:
    """Calculate aggregated feedback statistics."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Total count
    cursor.execute("SELECT COUNT(*) FROM feedback")
    total_count = cursor.fetchone()[0]
    
    if total_count == 0:
        return {
            "total_count": 0,
            "average_rating": 0,
            "implementation_breakdown": {}
        }

    # Average rating
    cursor.execute("SELECT AVG(rating) FROM feedback")
    average_rating = round(cursor.fetchone()[0], 1)
    
    # Implementation status breakdown
    cursor.execute("SELECT implementation_status, COUNT(*) FROM feedback GROUP BY implementation_status")
    status_rows = cursor.fetchall()
    implementation_breakdown = {row[0]: row[1] for row in status_rows}
    
    conn.close()
    
    return {
        "total_count": total_count,
        "average_rating": average_rating,
        "implementation_breakdown": implementation_breakdown
    }

# ============= Conversation Management =============

def create_conversation(title: str) -> int:
    """Create a new conversation."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO conversations (title, created_at, updated_at)
    VALUES (?, ?, ?)
    """, (title, datetime.utcnow().isoformat() + 'Z', datetime.utcnow().isoformat() + 'Z'))
    
    conversation_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return conversation_id

def get_all_conversations() -> List[Dict[str, Any]]:
    """Retrieve all conversations."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM conversations ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    
    conversations = []
    for row in rows:
        conversations.append(dict(row))
        
    conn.close()
    return conversations

def add_message(conversation_id: int, role: str, content: str, module_data: Optional[Dict] = None) -> int:
    """Add a message to a conversation."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    module_json = json.dumps(module_data) if module_data else None
    
    cursor.execute("""
    INSERT INTO messages (conversation_id, role, content, module_data, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (conversation_id, role, content, module_json, datetime.utcnow().isoformat() + 'Z'))
    
    message_id = cursor.lastrowid
    
    # Update conversation timestamp
    cursor.execute("""
    UPDATE conversations SET updated_at = ? WHERE id = ?
    """, (datetime.utcnow().isoformat() + 'Z', conversation_id))
    
    conn.commit()
    conn.close()
    return message_id

def get_conversation_messages(conversation_id: int) -> List[Dict[str, Any]]:
    """Retrieve all messages for a conversation."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT * FROM messages 
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
    """, (conversation_id,))
    
    rows = cursor.fetchall()
    
    messages = []
    for row in rows:
        msg = dict(row)
        # Parse module_data JSON if present
        if msg['module_data']:
            msg['module_data'] = json.loads(msg['module_data'])
        messages.append(msg)
        
    conn.close()
    return messages

def get_recent_queries(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve recent user queries (messages with role='user')."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT m.content, m.created_at, c.title as topic 
    FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE m.role = 'user'
    ORDER BY m.created_at DESC
    LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    
    queries = []
    for row in rows:
        queries.append(dict(row))
        
    conn.close()
    return queries
