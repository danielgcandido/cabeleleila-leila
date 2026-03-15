import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SuggestionBanner({ suggestion, onAccept }) {
  const [dismissed, setDismissed] = useState(false);

  if (!suggestion?.hasSuggestion || dismissed) return null;

  const formattedDate = format(new Date(suggestion.suggestedDate + 'T00:00:00'), "dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-4">
      <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-yellow-800 font-medium">{suggestion.message}</p>
        <button
          type="button"
          onClick={() => onAccept(suggestion.suggestedDate)}
          className="mt-1 text-xs text-yellow-700 underline hover:text-yellow-900"
        >
          Usar {formattedDate}
        </button>
      </div>
      <button onClick={() => setDismissed(true)} className="text-yellow-600 hover:text-yellow-800">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
