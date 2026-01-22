"""
API Routes for PRAGATI Backend
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import logging

from models.schemas import (
    GenerateModuleRequest,
    GenerateModuleResponse,
    TranslateRequest,
    TranslateResponse,
    FeedbackRequest,
    FeedbackResponse,
    IngestDocumentResponse
)
from services.rag_service import RAGService
from services.translation_service import TranslationService
from services.micro_learning_service import MicroLearningService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
rag_service = RAGService()
translation_service = TranslationService()
micro_learning_service = MicroLearningService()

@router.post("/ingest", response_model=IngestDocumentResponse)
async def ingest_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None)
):
    """
    Ingest a training manual (PDF) into the vector database.
    
    Args:
        file: PDF file to ingest
        title: Optional title for the document
    
    Returns:
        Document ingestion status and metadata
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read file content
        content = await file.read()
        
        # Ingest document
        result = await rag_service.ingest_document(
            content=content,
            filename=file.filename,
            title=title
        )
        
        return IngestDocumentResponse(
            success=True,
            message=f"Document '{file.filename}' ingested successfully",
            document_id=result["document_id"],
            chunks_created=result["chunks_created"]
        )
        
    except Exception as e:
        logger.error(f"Error ingesting document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to ingest document: {str(e)}")

@router.post("/generate", response_model=GenerateModuleResponse)
async def generate_module(request: GenerateModuleRequest):
    """
    Generate a micro-learning module based on teacher's challenge.
    Supports conversation context for iterative refinement.
    
    Args:
        request: Module generation request with challenge and optional conversation_id
    
    Returns:
        Generated micro-learning module with sections
    """
    try:
        from utils.db_utils import create_conversation, add_message, get_conversation_messages
        
        # Get conversation context if conversation_id is provided
        conversation_history = []
        if request.conversation_id:
            messages = get_conversation_messages(request.conversation_id)
            conversation_history = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in messages
            ]
        
        # Retrieve relevant content from vector DB
        relevant_chunks = await rag_service.retrieve_relevant_content(
            query=request.challenge,
            top_k=5
        )
        
        # Generate micro-learning module with conversation context
        module = await micro_learning_service.generate_module(
            challenge=request.challenge,
            context=relevant_chunks,
            conversation_history=conversation_history,
            target_duration=request.target_duration or 15,
            difficulty_level=request.difficulty_level or "intermediate"
        )
        
        # Save to conversation if conversation_id provided
        if request.conversation_id:
            # Add user message
            add_message(request.conversation_id, "user", request.challenge)
            # Add assistant message with module data (serialize to json compatible format)
            add_message(request.conversation_id, "assistant", "Module generated", module.model_dump(mode='json'))
        
        return GenerateModuleResponse(
            success=True,
            module=module
        )
        
    except Exception as e:
        logger.error(f"Error generating module: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate module: {str(e)}")

@router.post("/translate", response_model=TranslateResponse)
async def translate_content(request: TranslateRequest):
    """
    Translate content to vernacular language.
    
    Args:
        request: Translation request with content and target language
    
    Returns:
        Translated content
    """
    try:
        translated_text = await translation_service.translate(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language or "eng_Latn"
        )
        
        return TranslateResponse(
            success=True,
            translated_text=translated_text,
            source_language=request.source_language or "eng_Latn",
            target_language=request.target_language
        )
        
    except Exception as e:
        logger.error(f"Error translating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to translate: {str(e)}")

@router.post("/adapt", response_model=TranslateResponse)
async def adapt_content(request: TranslateRequest):
    """
    Adapt content to local dialect.
    Currently uses translation, but can be extended for cultural contextualization.
    """
    try:
        # Future: Add LLM step here to contextualize before translating
        # For now, direct translation
        translated_text = await translation_service.translate(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language or "eng_Latn"
        )
        
        return TranslateResponse(
            success=True,
            translated_text=translated_text,
            source_language=request.source_language or "eng_Latn",
            target_language=request.target_language
        )
        
    except Exception as e:
        logger.error(f"Error adapting content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to adapt content: {str(e)}")

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest):
    """
    Submit implementation feedback for a module.
    """
    try:
        from utils.db_utils import save_feedback, init_db
        
        # Ensure DB is initialized
        init_db()
        
        # Save feedback
        feedback_id = save_feedback({
            "module_id": request.module_id,
            "challenge": request.challenge,
            "rating": request.rating,
            "implementation_status": request.implementation_status,
            "comments": request.comments,
            "conversation_id": request.conversation_id
        })
        
        logger.info(f"Feedback saved with ID: {feedback_id}")
        
        return FeedbackResponse(
            success=True,
            message="Feedback submitted successfully",
            feedback_id=str(feedback_id)
        )
        
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")

@router.get("/feedback/stats")
async def get_feedback_stats_endpoint():
    """Get aggregated feedback statistics."""
    try:
        from utils.db_utils import get_feedback_stats, get_all_feedback, get_recent_queries
        
        stats = get_feedback_stats()
        recent_feedback = get_all_feedback()
        recent_queries = get_recent_queries()
        
        return {
            "success": True,
            "stats": stats,
            "recent_feedback": recent_feedback[:50],  # Limit to last 50 items
            "recent_queries": recent_queries
        }
    except Exception as e:
        logger.error(f"Error getting feedback stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")

# ============= Conversation Endpoints =============

@router.get("/conversations")
async def get_conversations():
    """Get all conversations."""
    try:
        from utils.db_utils import get_all_conversations
        
        conversations = get_all_conversations()
        return {
            "success": True,
            "conversations": conversations
        }
    except Exception as e:
        logger.error(f"Error getting conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch conversations: {str(e)}")

@router.post("/conversations")
async def create_new_conversation(title: str):
    """Create a new conversation."""
    try:
        from utils.db_utils import create_conversation
        
        conversation_id = create_conversation(title)
        return {
            "success": True,
            "conversation_id": conversation_id
        }
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")

@router.get("/conversations/{conversation_id}/messages")
async def get_messages(conversation_id: int):
    """Get all messages for a conversation."""
    try:
        from utils.db_utils import get_conversation_messages
        
        messages = get_conversation_messages(conversation_id)
        return {
            "success": True,
            "messages": messages
        }
    except Exception as e:
        logger.error(f"Error getting messages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch messages: {str(e)}")

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported vernacular languages."""
    return {
        "languages": [
            {"code": "eng_Latn", "name": "English"},
            {"code": "hin_Deva", "name": "Hindi"},
            {"code": "ben_Beng", "name": "Bengali"},
            {"code": "tam_Taml", "name": "Tamil"},
            {"code": "tel_Telu", "name": "Telugu"},
            {"code": "mar_Deva", "name": "Marathi"},
            {"code": "bho_Deva", "name": "Bhojpuri"},
            {"code": "mai_Deva", "name": "Maithili"},
            {"code": "mag_Deva", "name": "Magahi"},
            {"code": "san_Deva", "name": "Sanskrit"},
            {"code": "urd_Arab", "name": "Urdu"},
        ]
    }
