"""
Vector Store - ChromaDB integration for vector storage and retrieval.
"""
import logging
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings as ChromaSettings

from config import settings
from models.schemas import DocumentChunk, RetrievalResult

logger = logging.getLogger(__name__)

class VectorStore:
    """ChromaDB vector store for document embeddings."""
    
    def __init__(self):
        """Initialize ChromaDB client and collection."""
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(
                anonymized_telemetry=False
            )
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        
        logger.info(f"Vector store initialized: {settings.CHROMA_COLLECTION_NAME}")
    
    async def add_documents(self, chunks: List[DocumentChunk]) -> None:
        """
        Add document chunks to vector store.
        
        Args:
            chunks: List of document chunks with embeddings
        """
        try:
            # Prepare data for ChromaDB
            ids = []
            embeddings = []
            documents = []
            metadatas = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{chunk.metadata.get('document_id', 'doc')}_{chunk.metadata.get('chunk_id', i)}"
                ids.append(chunk_id)
                embeddings.append(chunk.embedding)
                documents.append(chunk.text)
                metadatas.append(chunk.metadata)
            
            # Add to collection
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas
            )
            
            logger.info(f"Added {len(chunks)} chunks to vector store")
            
        except Exception as e:
            logger.error(f"Error adding documents to vector store: {str(e)}")
            raise
    
    async def search(
        self,
        query_embedding: List[float],
        top_k: int = 5
    ) -> List[RetrievalResult]:
        """
        Search for similar documents using vector similarity.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
        
        Returns:
            List of retrieval results with scores
        """
        try:
            # Query collection
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=["documents", "metadatas", "distances"]
            )
            
            # Convert to RetrievalResult objects
            retrieval_results = []
            
            if results and results["documents"]:
                for i in range(len(results["documents"][0])):
                    result = RetrievalResult(
                        text=results["documents"][0][i],
                        score=1.0 - results["distances"][0][i],  # Convert distance to similarity
                        metadata=results["metadatas"][0][i]
                    )
                    retrieval_results.append(result)
            
            logger.info(f"Retrieved {len(retrieval_results)} results")
            return retrieval_results
            
        except Exception as e:
            logger.error(f"Error searching vector store: {str(e)}")
            raise
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection."""
        try:
            count = self.collection.count()
            
            return {
                "collection_name": settings.CHROMA_COLLECTION_NAME,
                "document_count": count,
                "persist_directory": settings.CHROMA_PERSIST_DIR
            }
            
        except Exception as e:
            logger.error(f"Error getting collection stats: {str(e)}")
            raise
    
    async def delete_collection(self) -> None:
        """Delete the entire collection (use with caution)."""
        try:
            self.client.delete_collection(name=settings.CHROMA_COLLECTION_NAME)
            logger.warning(f"Deleted collection: {settings.CHROMA_COLLECTION_NAME}")
        except Exception as e:
            logger.error(f"Error deleting collection: {str(e)}")
            raise
