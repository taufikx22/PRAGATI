"""
Translation Service - Vernacular translation using HuggingFace transformers.
"""
import logging
from typing import Optional
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

from config import settings

logger = logging.getLogger(__name__)

class TranslationService:
    """Service for translating content to vernacular languages."""
    
    def __init__(self):
        """Initialize translation model."""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Loading translation model on {self.device}")
        
        self.model_name = settings.TRANSLATION_MODEL
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name).to(self.device)
        
        logger.info(f"Translation model loaded: {self.model_name}")
    
    async def translate(
        self,
        text: str,
        target_language: str,
        source_language: str = "eng_Latn"
    ) -> str:
        """
        Translate text to target language.
        
        Args:
            text: Text to translate
            target_language: Target language code (e.g., 'hin_Deva' for Hindi)
            source_language: Source language code (default: English)
        
        Returns:
            Translated text
        """
        try:
            # Validate language codes
            if target_language not in settings.SUPPORTED_LANGUAGES:
                raise ValueError(f"Unsupported target language: {target_language}")
            
            # Skip translation if source and target are the same
            if source_language == target_language:
                return text
            
            # Tokenize with language codes
            self.tokenizer.src_lang = source_language
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            ).to(self.device)
            
            # Generate translation
            forced_bos_token_id = self.tokenizer.convert_tokens_to_ids(target_language)
            
            with torch.no_grad():
                generated_tokens = self.model.generate(
                    **inputs,
                    forced_bos_token_id=forced_bos_token_id,
                    max_length=512,
                    num_beams=5,
                    early_stopping=True
                )
            
            # Decode translation
            translated_text = self.tokenizer.batch_decode(
                generated_tokens,
                skip_special_tokens=True
            )[0]
            
            logger.info(f"Translated text from {source_language} to {target_language}")
            return translated_text
            
        except Exception as e:
            logger.error(f"Error translating text: {str(e)}")
            raise
    
    async def translate_batch(
        self,
        texts: list[str],
        target_language: str,
        source_language: str = "eng_Latn"
    ) -> list[str]:
        """
        Translate multiple texts in batch.
        
        Args:
            texts: List of texts to translate
            target_language: Target language code
            source_language: Source language code
        
        Returns:
            List of translated texts
        """
        try:
            translations = []
            for text in texts:
                translated = await self.translate(
                    text=text,
                    target_language=target_language,
                    source_language=source_language
                )
                translations.append(translated)
            
            return translations
            
        except Exception as e:
            logger.error(f"Error in batch translation: {str(e)}")
            raise
