import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

export async function POST(request) {
  try {
    tf.disposeVariables(); // Liberar todas las variables de TensorFlow.js

    const { inputText } = await request.json();

    // Cargar modelo, tokenizer y labelEncoder desde archivos JSON
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sentiment-analysis-twitter-x.vercel.app'; // if you local remplace https://sentiment-analysis-twitter-x.vercel.app and just use 'http://localhost:3000'
    const modelUrl = `${baseUrl}/model/model.json`;
    const tokenizeUrl = `${baseUrl}/model/tokenizer.json`;
    const labelEncoderUrl = `${baseUrl}/model/label_encoder.json`;

    const model = await tf.loadLayersModel(modelUrl);
    const tokenizerResponse = await fetch(tokenizeUrl);
    const tokenizer = await tokenizerResponse.json();
    const labelEncoderResponse = await fetch(labelEncoderUrl);
    const labelEncoder = await labelEncoderResponse.json();

    if (!model || !tokenizer || !labelEncoder) {
      throw new Error('Modelo o recursos no cargados');
    }

    // Tokenizar y predecir
    const sequence = tokenizeInput(inputText, tokenizer);
    const paddedSequence = padSequence(sequence, 200);

    const inputTensor = tf.tensor2d([paddedSequence], [1, 200]);
    const prediction = model.predict(inputTensor);
    const predictionData = await prediction.data();
    const predictedClassIndex = tf.argMax(predictionData).dataSync()[0];
    const predictedClass = labelEncoder[predictedClassIndex];

    return new Response(JSON.stringify({ prediction: predictedClass }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// Funciones auxiliares de tokenización y padding
function tokenizeInput(text, tokenizer) {
  const tokens = text.split(' ').map(word => tokenizer[word] || tokenizer['<OOV>']);
  return tokens;
}

function padSequence(sequence, maxlen) {
  if (sequence.length < maxlen) {
    const padded = new Array(maxlen).fill(0);
    for (let i = 0; i < sequence.length; i++) {
      padded[maxlen - sequence.length + i] = sequence[i];
    }
    return padded;
  }
  return sequence.slice(-maxlen);
}
