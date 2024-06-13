"use client";

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import Link from 'next/link';
import styles from './page.module.css';

function SentimentAnalysis() {
  const [model, setModel] = useState(null);
  const [tokenizer, setTokenizer] = useState(null); // Asumiendo que tienes el tokenizer en un archivo JSON
  const [labelEncoder, setLabelEncoder] = useState(null); // Asumiendo que tienes el label encoder en un archivo JSON
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    async function loadModelAndResources() {
      const modelUrl = `${window.location.origin}/model/model.json`;
      const model = await tf.loadLayersModel(modelUrl);
      setModel(model);
      console.log('Modelo cargado');

      const tokenizerResponse = await fetch('/model/tokenizer.json');
      const tokenizerData = await tokenizerResponse.json();
      setTokenizer(tokenizerData);

      const labelEncoderResponse = await fetch('/model/label_encoder.json');
      const labelEncoderData = await labelEncoderResponse.json();
      setLabelEncoder(labelEncoderData);
    }

    loadModelAndResources();
  }, []);

  const handlePredict = async () => {
    if (model && tokenizer && labelEncoder && inputText) {
      const sequence = tokenizeInput(inputText, tokenizer);
      const paddedSequence = padSequence(sequence, 200); // Usando maxlen 200

      const inputTensor = tf.tensor2d([paddedSequence], [1, 200]);
      const prediction = model.predict(inputTensor);
      const predictionData = await prediction.data();
      const predictedClassIndex = tf.argMax(predictionData).dataSync()[0];
      const predictedClass = labelEncoder[predictedClassIndex];

      setPrediction(predictedClass);
    }
  };

  const tokenizeInput = (text, tokenizer) => {
    // Implementar la tokenización usando el tokenizer cargado
    // Nota: Aquí puedes necesitar adaptar la lógica de tokenización desde tu tokenizer en Python
    const tokens = text.split(' ').map(word => tokenizer[word] || tokenizer['<OOV>']);
    return tokens;
  };

  const padSequence = (sequence, maxlen) => {
    // Implementar el padding de la secuencia
    if (sequence.length < maxlen) {
      const padded = new Array(maxlen).fill(0);
      for (let i = 0; i < sequence.length; i++) {
        padded[maxlen - sequence.length + i] = sequence[i];
      }
      return padded;
    }
    return sequence.slice(-maxlen);
  };

  let predictionClass = styles.prediction;  // Clase base para el texto de predicción

  if (prediction === "Irrelevant") {
    predictionClass += ` ${styles.irrelevant}`;
  } else if (prediction === "Negative") {
    predictionClass += ` ${styles.negative}`;
  } else if (prediction === "Neutral") {
    predictionClass += ` ${styles.neutral}`;
  } else if (prediction === "Positive") {
    predictionClass += ` ${styles.positive}`;
  }

  return (
    <div className='card'>
      <h1><img width="48" height="48" src="https://img.icons8.com/color/48/twitter--v1.png" alt="twitter--v1"/> Sentiment Analysis Twitter <img width="38" height="38" src="https://img.icons8.com/color/48/twitterx--v2.png" alt="twitterx--v2"/></h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button onClick={handlePredict}>Predict Sentiment</button>
      {prediction && 
        <p>Predicted Sentiment: <br/><span className={predictionClass}>{prediction}</span></p>
      }

<div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20/Nextjs-Sentiment-Analysis-Twitter-X-with-Tensorflow">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
    </div>
  );
}

export default SentimentAnalysis;
