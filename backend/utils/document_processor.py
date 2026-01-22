"""
Document Processor - Extract and chunk text from documents.
"""
import logging
from typing import List
import io
from PyPDF2 import PdfReader

from config import settings
from models.schemas import DocumentChunk

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Process documents for RAG pipeline."""
    
    def __init__(self):
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
        logger.info("Document Processor initialized")
    
    async def extract_text(self, content: bytes) -> str:
        """
        Extract text from PDF document.
        
        Args:
            content: PDF file content as bytes
        
        Returns:
            Extracted text
        """
        try:
            # Create PDF reader from bytes
            pdf_file = io.BytesIO(content)
            pdf_reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            text_parts = []
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            
            full_text = "\n\n".join(text_parts)
            logger.info(f"Extracted {len(full_text)} characters from PDF")
            
            return full_text
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise
    
    async def chunk_text(
        self,
        text: str,
        metadata: dict
    ) -> List[DocumentChunk]:
        """
        Chunk text into smaller pieces with overlap.
        
        Args:
            text: Text to chunk
            metadata: Metadata to attach to chunks
        
        Returns:
            List of document chunks
        """
        try:
            chunks = []
            
            # Simple character-based chunking with overlap
            start = 0
            chunk_id = 0
            
            while start < len(text):
                # Calculate end position
                end = start + self.chunk_size
                
                # Extract chunk
                chunk_text = text[start:end]
                
                # Skip very small chunks at the end
                if len(chunk_text.strip()) < 50:
                    break
                
                # Create chunk with metadata
                chunk_metadata = {
                    **metadata,
                    "chunk_id": chunk_id,
                    "start_char": start,
                    "end_char": end
                }
                
                chunk = DocumentChunk(
                    text=chunk_text.strip(),
                    metadata=chunk_metadata
                )
                
                chunks.append(chunk)
                
                # Move to next chunk with overlap
                start = end - self.chunk_overlap
                chunk_id += 1
            
            logger.info(f"Created {len(chunks)} chunks from text")
            return chunks
            
        except Exception as e:
            logger.error(f"Error chunking text: {str(e)}")
            raise
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text.
        
        Args:
            text: Text to clean
        
        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = " ".join(text.split())
        
        # Remove special characters (optional)
        # text = re.sub(r'[^\w\s.,!?-]', '', text)
        
        return text
