"""
RAG Service - Orchestrates document ingestion and retrieval.
"""
import logging
from typing import List, Dict, Any
import hashlib
from datetime import datetime

from services.embedding_service import EmbeddingService
from utils.vector_store import VectorStore
from utils.document_processor import DocumentProcessor
from models.schemas import DocumentChunk, RetrievalResult

logger = logging.getLogger(__name__)

class RAGService:
    """RAG pipeline orchestration service."""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStore()
        self.document_processor = DocumentProcessor()
        logger.info("RAG Service initialized")
    
    async def ingest_document(
        self,
        content: bytes,
        filename: str,
        title: str = None
    ) -> Dict[str, Any]:
        """
        Ingest a document into the vector database.
        
        Args:
            content: Document content as bytes
            filename: Original filename
            title: Optional document title
        
        Returns:
            Dictionary with ingestion results
        """
        try:
            # Generate document ID
            doc_id = hashlib.md5(content).hexdigest()
            
            # Extract text from PDF
            text = await self.document_processor.extract_text(content)
            
            # Chunk the document
            chunks = await self.document_processor.chunk_text(
                text=text,
                metadata={
                    "document_id": doc_id,
                    "filename": filename,
                    "title": title or filename,
                    "ingested_at": datetime.now().isoformat()
                }
            )
            
            logger.info(f"Created {len(chunks)} chunks from {filename}")
            
            # Generate embeddings for chunks
            chunk_texts = [chunk.text for chunk in chunks]
            embeddings = await self.embedding_service.embed_texts(chunk_texts)
            
            # Add embeddings to chunks
            for chunk, embedding in zip(chunks, embeddings):
                chunk.embedding = embedding
            
            # Store in vector database
            await self.vector_store.add_documents(chunks)
            
            logger.info(f"Successfully ingested document {doc_id}")
            
            return {
                "document_id": doc_id,
                "chunks_created": len(chunks),
                "filename": filename
            }
            
        except Exception as e:
            logger.error(f"Error ingesting document: {str(e)}")
            raise
    
    async def retrieve_relevant_content(
        self,
        query: str,
        top_k: int = 5
    ) -> List[RetrievalResult]:
        """
        Retrieve relevant content chunks for a query.
        
        Args:
            query: Search query
            top_k: Number of results to return
        
        Returns:
            List of retrieval results with scores
        """
        try:
            # Generate query embedding
            query_embedding = await self.embedding_service.embed_query(query)
            
            # Search vector database
            results = await self.vector_store.search(
                query_embedding=query_embedding,
                top_k=top_k
            )
            
            logger.info(f"Retrieved {len(results)} chunks for query: {query[:50]}...")
            
            return results
            
        except Exception as e:
            logger.error(f"Error retrieving content: {str(e)}")
            raise
    
    async def get_document_stats(self) -> Dict[str, Any]:
        """Get statistics about ingested documents."""
        try:
            stats = await self.vector_store.get_collection_stats()
            return stats
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            raise
