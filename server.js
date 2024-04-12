const express = require('express');
const multer = require('multer');
const { TextLoader } = require('langchain/dist/document_loaders/text_loader');
const { CharacterTextSplitter } = require('langchain/dist/text_splitter');
const { OpenAIEmbeddings } = require('langchain/dist/embeddings/openai');
const { FAISS } = require('langchain/dist/vectorstores/faiss');
const { RetrievalQA } = require('langchain/dist/chains/retrieval_qa');
const { OpenAI } = require('langchain/dist/llms/openai');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const loader = new TextLoader(filePath);
    const documents = await loader.load();
    const textSplitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });
    const docs = await textSplitter.splitDocuments(documents);
    const embeddings = new OpenAIEmbeddings();
    const db = await FAISS.fromDocuments(docs, embeddings);
    await db.save('vec_store');
    res.send({ message: 'Document uploaded and embedded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading document');
  }
});

app.post('/query', async (req, res) => {
  try {
    const query = req.body.query;
    const embeddings = new OpenAIEmbeddings();
    const db = await FAISS.load('vec_store', embeddings);
    const retriever = db.asRetriever();
    const qa = RetrievalQA.fromLLM(new OpenAI(), retriever);
    const result = await qa.run(query);
    res.send({ result });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error querying document');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});