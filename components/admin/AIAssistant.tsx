
import React, { useState } from 'react';
import { runGemini } from '../../lib/gemini';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, digite uma solicitação.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const generatedText = await runGemini(prompt);
      setResult(generatedText || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Assistente IA</h2>
      <p className="text-brand-text mb-4 text-sm">
        Precisa de ajuda para escrever um anúncio ou uma mensagem para uma cliente? Descreva o que você precisa e a IA irá gerar um texto para você.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-brand-text mb-1">
            Sua Solicitação
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-brand-primary/50 bg-white/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300"
            placeholder="Ex: Escreva um anúncio amigável informando que não haverá atendimento no dia 25 de Dezembro devido ao feriado de Natal."
          />
        </div>

        <Button onClick={handleGenerate} isLoading={isLoading}>
          Gerar Texto
        </Button>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</p>}

        {result && (
          <div>
            <h3 className="text-lg font-semibold text-brand-dark mb-2">Resultado Gerado:</h3>
            <div className="bg-brand-light p-4 rounded-lg border border-brand-primary/20 whitespace-pre-wrap font-sans text-brand-text">
                {result}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIAssistant;
