# Nextjs Sentiment Analysis Twitter X with Tensorflow

<p align="justify">
Nextjs Sentiment Analysis Twitter X with Tensorflow converting a.h5 model to tensorflowjs that is .json and .bin
</p>

The training and dataset are in this IPynb [repository proyecto-datos-secuenciales](https://github.com/diegoperea20/proyecto-datos-secuenciales/blob/main/Punto2/Punto%202%20Twitter%20dataset.ipynb)

The tokenizer and label in this project .public\model\Punto_2_Twitter_dataset.ipynb

<p align="center">
  <img src="README-images\homet.PNG" alt="Step1">
</p>
<p align="center">
  <img src="README-images/positivetwet.PNG" alt="Step2">
</p>
<p align="center">
  <img src="README-images/negativetwet.PNG" alt="Step3">
</p>
<p align="center">
  <img src="README-images/irrevelanttwet.PNG" alt="Step4">
</p>
<p align="center">
  <img src="README-images/neutraltwet.PNG" alt="Step5">
</p>

-----
## API

```bash
http://localhost:3000/api/sentiment
```
json

```bash
{
  "inputText": "hello"
}
```

<p align="center">
  <img src="README-images/apipositive.PNG" alt="Step6">
</p>

<p align="center">
  <img src="README-images/apinegative.PNG" alt="Step6">
</p>

<p align="center">
  <img src="README-images/apineutral.PNG" alt="Step6">
</p>

<p align="center">
  <img src="README-images/apiirrevelant.PNG" alt="Step6">
</p>




----
Convert model h5 to Tensorflowjs in ipynb
```bash
!pip install tensorflowjs
```
```bash
!tensorflowjs_converter --input_format keras /root/to/your/model.h5 /root/to/your/folder/save
```
-----

Fronted Nextjs Options for do it:

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Nodejs version v20.10.0 and Next.js version v14.2.3 

First
```bash
npm install
```
run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Resolve : Error Nextjs Parsing error: Cannot find module 'next/babel'

Put this code in .eslintrc.json 
```bash
{
  "extends": ["next/babel","next/core-web-vitals"]
}
```


Created by [Diego Ivan Perea Montealegre](https://github.com/diegoperea20)