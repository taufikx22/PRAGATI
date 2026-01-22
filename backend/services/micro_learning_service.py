"""
Micro-Learning Service - Generate micro-learning modules from content.
"""
import logging
from typing import List, Dict, Any
import uuid
from datetime import datetime

from services.llm_service import LLMService
from models.schemas import Module, ModuleSection, RetrievalResult

logger = logging.getLogger(__name__)

class MicroLearningService:
    """Service for generating micro-learning modules."""
    
    def __init__(self):
        self.llm_service = LLMService()
        logger.info("Micro-Learning Service initialized")
    
    async def generate_module(
        self,
        challenge: str,
        context: List[RetrievalResult],
        target_duration: int = 15,
        difficulty_level: str = "intermediate",
        conversation_history: List[Dict[str, str]] = None
    ) -> Module:
        """
        Generate a micro-learning module based on teacher's challenge.
        
        Args:
            challenge: Teacher's classroom challenge
            context: Retrieved relevant content chunks
            target_duration: Target duration in minutes
            difficulty_level: Module difficulty level
            conversation_history: Previous messages for context (optional)
        
        Returns:
            Generated micro-learning module
        """
        try:
            # Extract context text
            context_texts = [result.text for result in context]
            
            # Build system prompt
            system_prompt = self._build_system_prompt(
                target_duration=target_duration,
                difficulty_level=difficulty_level
            )
            
            # Build generation prompt with conversation history
            generation_prompt = self._build_generation_prompt(
                challenge=challenge,
                context_texts=context_texts,
                target_duration=target_duration,
                conversation_history=conversation_history or []
            )
            
            # Generate module content
            generated_content = await self.llm_service.generate_with_context(
                query=generation_prompt,
                context_chunks=context_texts,
                system_prompt=system_prompt
            )
            
            # Parse generated content into structured module
            module = self._parse_module_content(
                generated_content=generated_content,
                challenge=challenge,
                target_duration=target_duration,
                difficulty_level=difficulty_level
            )
            
            logger.info(f"Generated module: {module.title}")
            return module
            
        except Exception as e:
            logger.error(f"Error generating module: {str(e)}")
            raise
    
    def _build_system_prompt(
        self,
        target_duration: int,
        difficulty_level: str
    ) -> str:
        """Build system prompt for module generation."""
        return f"""You are an expert educational content designer specializing in teacher training.

Your task is to create micro-learning modules that are:
- Actionable and practical for classroom implementation
- Culturally sensitive and adaptable to diverse contexts
- Focused on solving specific teaching challenges
- Designed for {target_duration}-minute learning sessions
- Appropriate for {difficulty_level} level teachers

Structure each module with:
1. Clear title
2. 3-5 focused sections
3. Practical activities or examples
4. Implementation tips

Keep language simple, clear, and encouraging."""
    
    def _build_generation_prompt(
        self,
        challenge: str,
        context_texts: List[str],
        target_duration: int,
        conversation_history: List[Dict[str, str]] = None
    ) -> str:
        """Build generation prompt for module creation."""
        
        # Build conversation context if history exists
        conversation_context = ""
        if conversation_history and len(conversation_history) > 0:
            conversation_context = "\n\nPrevious conversation:\n"
            for msg in conversation_history[-4:]:  # Last 4 messages for context
                role = "Teacher" if msg["role"] == "user" else "Assistant"
                conversation_context += f"{role}: {msg['content']}\n"
            conversation_context += "\nBased on the above conversation, "
        
        return f"""[INST]
You are an expert teacher trainer.
{conversation_context}Create a {target_duration}-minute micro-learning module for this challenge:
"{challenge}"

Format your response using proper markdown for readability:
- Use blank lines (double newlines) between paragraphs
- Use bullet points (- ) for lists
- Bold key terms with **text**
- Keep content well-organized with clear spacing

Structure your response exactly like this:

TITLE: [Module Title]

SECTION 1: [Name]
DURATION: [X min]
CONTENT: [Explanation with proper paragraphs and formatting]

ACTIVITY: [Short activity description]

SECTION 2: [Name]
DURATION: [X min]
CONTENT: [Explanation with proper paragraphs and formatting]

ACTIVITY: [Short activity description]
[/INST]"""
    
    def _parse_module_content(
        self,
        generated_content: str,
        challenge: str,
        target_duration: int,
        difficulty_level: str
    ) -> Module:
        """Parse generated content into structured Module object."""
        try:
            # Simple parsing logic (can be enhanced with more sophisticated parsing)
            lines = generated_content.strip().split('\n')
            
            # Extract title
            title = "Addressing Classroom Challenge"
            for line in lines:
                if line.startswith("TITLE:"):
                    title = line.replace("TITLE:", "").strip()
                    break
            
            # Parse sections (simplified - in production, use more robust parsing)
            sections = []
            current_section = None
            
            for line in lines:
                clean_line = line.strip().replace("*", "")
                if clean_line.upper().startswith("SECTION"):
                    if current_section:
                        sections.append(current_section)
                    current_section = {
                        "title": clean_line.split(":", 1)[1].strip() if ":" in clean_line else "Section",
                        "content": "",
                        "duration_minutes": 3,
                        "activity": None
                    }
                elif current_section and line.strip():
                    clean_start = line.strip().replace("*", "").upper()
                    if clean_start.startswith("DURATION:"):
                        # Extract duration
                        try:
                            duration_str = line.split(":", 1)[1].strip()
                            current_section["duration_minutes"] = int(''.join(filter(str.isdigit, duration_str)))
                        except:
                            pass
                    elif clean_start.startswith("ACTIVITY:"):
                        current_section["activity"] = line.split(":", 1)[1].strip().replace("*", "")
                    elif clean_start.startswith("CONTENT:"):
                        current_section["content"] = line.split(":", 1)[1].strip().replace("*", "")
                    else:
                        current_section["content"] += "\n" + line.strip()
            
            if current_section:
                sections.append(current_section)
            
            # Create ModuleSection objects
            module_sections = [
                ModuleSection(
                    title=s["title"],
                    content=s["content"],
                    duration_minutes=s["duration_minutes"],
                    activity=s.get("activity")
                )
                for s in sections
            ]
            
            # If no sections parsed, create a default one
            if not module_sections:
                module_sections = [
                    ModuleSection(
                        title="Practical Solution",
                        content=generated_content,
                        duration_minutes=target_duration,
                        activity=None
                    )
                ]
            
            # Create Module object
            module = Module(
                id=str(uuid.uuid4()),
                title=title,
                challenge=challenge,
                sections=module_sections,
                total_duration=sum(s.duration_minutes for s in module_sections),
                difficulty_level=difficulty_level,
                created_at=datetime.now()
            )
            
            return module
            
        except Exception as e:
            logger.error(f"Error parsing module content: {str(e)}")
            # Return a basic module with the raw content
            return Module(
                id=str(uuid.uuid4()),
                title="Addressing Your Challenge",
                challenge=challenge,
                sections=[
                    ModuleSection(
                        title="Solution Overview",
                        content=generated_content,
                        duration_minutes=target_duration,
                        activity=None
                    )
                ],
                total_duration=target_duration,
                difficulty_level=difficulty_level,
                created_at=datetime.now()
            )
