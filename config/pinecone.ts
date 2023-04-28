/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */



const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

const PINECONE_NAME_SPACE = process.env.PINECONE_NAME_SPACE; //namespace is optional for your vectors

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };