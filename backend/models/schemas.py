"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============= Request Models =============

class GenerateModuleRequest(BaseModel):
    """Request model for micro-learning module generation."""
    challenge: str = Field(..., description="The classroom challenge faced by the teacher")
    target_duration: Optional[int] = Field(15, description="Target duration in minutes")
    difficulty_level: Optional[str] = Field("intermediate", description="Difficulty level")
    conversation_id: Optional[int] = Field(None, description="Conversation ID for contextual refinement")
    language: Optional[str] = Field("eng_Latn", description="Target language code")

class TranslateRequest(BaseModel):
    """Request model for content translation."""
    text: str = Field(..., description="Text to translate")
    target_language: str = Field(..., description="Target language code (e.g., hin_Deva)")
    source_language: Optional[str] = Field("eng_Latn", description="Source language code")

class FeedbackRequest(BaseModel):
    """Request model for module feedback."""
    module_id: str = Field(..., description="Module identifier")
    challenge: Optional[str] = Field(None, description="Original challenge text")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1-5")
    implementation_status: str = Field(..., description="Implementation status")
    comments: Optional[str] = Field(None, description="Additional comments")
    conversation_id: Optional[int] = Field(None, description="Associated conversation ID")
    evidence_url: Optional[str] = Field(None, description="URL to evidence (photo/quiz)")

# ============= Response Models =============

class ModuleSection(BaseModel):
    """Individual section within a micro-learning module."""
    title: str
    content: str
    duration_minutes: int
    activity: Optional[str] = None

class Module(BaseModel):
    """Micro-learning module structure."""
    id: str
    title: str
    challenge: str
    sections: List[ModuleSection]
    total_duration: int
    difficulty_level: str
    created_at: datetime = Field(default_factory=datetime.now)
    language: str = "eng_Latn"

class GenerateModuleResponse(BaseModel):
    """Response model for module generation."""
    success: bool
    module: Module
    message: Optional[str] = None

class TranslateResponse(BaseModel):
    """Response model for translation."""
    success: bool
    translated_text: str
    source_language: str
    target_language: str

class FeedbackResponse(BaseModel):
    """Response model for feedback submission."""
    success: bool
    message: str
    feedback_id: str

class IngestDocumentResponse(BaseModel):
    """Response model for document ingestion."""
    success: bool
    message: str
    document_id: str
    chunks_created: int

# ============= Internal Models =============

class DocumentChunk(BaseModel):
    """Document chunk with metadata."""
    text: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

class RetrievalResult(BaseModel):
    """Result from vector database retrieval."""
    text: str
    score: float
    metadata: Dict[str, Any]
