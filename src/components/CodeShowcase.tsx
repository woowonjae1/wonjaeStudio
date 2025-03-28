import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaBrain, FaCode } from 'react-icons/fa';

interface CodeSnippet {
  title: string;
  description: string;
  code: string;
  category: 'AI' | 'Development' | 'Innovation';
}

const codeSnippets: CodeSnippet[] = [
  {
    title: "GPT-4 Integration",
    description: "Modern AI integration using OpenAI's GPT-4 API",
    code: `async function generateResponse(prompt: string) {
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt,
    max_tokens: 150
  });
  return response.choices[0].text;
}`,
    category: 'AI'
  },
  {
    title: "Neural Network Implementation",
    description: "Simple neural network using TensorFlow.js",
    code: `const model = tf.sequential({
  layers: [
    tf.layers.dense({inputShape: [4], units: 10, activation: 'relu'}),
    tf.layers.dense({units: 3, activation: 'softmax'})
  ]
});`,
    category: 'AI'
  },
  {
    title: "React Three.js Integration",
    description: "3D rendering in React applications",
    code: `const Scene = () => {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};`,
    category: 'Development'
  }
];

const CodeShowcase: React.FC = () => {
  return (
    <div className="relative">
      {/* 代码示例展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codeSnippets.map((snippet, index) => (
          <motion.div
            key={snippet.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {snippet.category === 'AI' ? (
                  <FaRobot className="text-2xl text-purple-600" />
                ) : snippet.category === 'Development' ? (
                  <FaCode className="text-2xl text-blue-600" />
                ) : (
                  <FaBrain className="text-2xl text-green-600" />
                )}
                <h3 className="text-xl font-semibold ml-2">{snippet.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{snippet.description}</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-200">{snippet.code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CodeShowcase; 