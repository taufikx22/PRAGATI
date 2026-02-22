"""
LLM Service - Integration with Ollama for text generation.
"""
import logging
from typing import List, Dict, Any, Optional
import httpx

from config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """Service for LLM-based text generation using Ollama."""
    
    def __init__(self):
        self.base_url = settings.LLM_BASE_URL
        self.model = settings.LLM_MODEL
        self.temperature = settings.LLM_TEMPERATURE
        self.max_tokens = settings.LLM_MAX_TOKENS
        self.repeat_penalty = settings.LLM_REPEAT_PENALTY
        self.top_p = settings.LLM_TOP_P
        logger.info(f"LLM Service initialized with model: {self.model}")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        repeat_penalty: Optional[float] = None,
        top_p: Optional[float] = None
    ) -> str:
        """
        Generate text using the LLM.
        
        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            temperature: Sampling temperature (overrides default)
            max_tokens: Max tokens to generate (overrides default)
            repeat_penalty: Penalty for repetition (overrides default)
            top_p: Nucleus sampling probability (overrides default)
        
        Returns:
            Generated text
        """
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature or self.temperature,
                        "num_predict": max_tokens or self.max_tokens,
                        "repeat_penalty": repeat_penalty or self.repeat_penalty,
                        "top_p": top_p or self.top_p
                    }
                }
                
                if system_prompt:
                    payload["system"] = system_prompt
                
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                generated_text = result.get("response", "")
                
                logger.info(f"Generated {len(generated_text)} characters")
                return generated_text
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error calling Ollama: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            raise
    
    async def generate_with_context(
        self,
        query: str,
        context_chunks: List[str],
        system_prompt: str
    ) -> str:
        """
        Generate text with retrieved context (RAG pattern).
        
        Args:
            query: User query
            context_chunks: Retrieved context chunks
            system_prompt: System prompt
        
        Returns:
            Generated text
        """
        try:
            # Build context string
            context = "\n\n".join([
                f"[Context {i+1}]\n{chunk}"
                for i, chunk in enumerate(context_chunks)
            ])
            
            # Build full prompt
            full_prompt = f"""Context Information:
{context}

User Query: {query}

Please provide a comprehensive response based on the context above."""
            
            # Generate response
            response = await self.generate(
                prompt=full_prompt,
                system_prompt=system_prompt
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating with context: {str(e)}")
            raise
    
    async def check_health(self) -> bool:
        """Check if Ollama service is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Ollama health check failed: {str(e)}")
            return False
