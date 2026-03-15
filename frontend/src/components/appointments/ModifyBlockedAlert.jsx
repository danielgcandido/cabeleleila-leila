import { Phone } from 'lucide-react';

export default function ModifyBlockedAlert() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
      <Phone className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-orange-800">
          Alteração disponível apenas por telefone
        </p>
        <p className="text-sm text-orange-700 mt-0.5">
          Para alterar ou cancelar agendamentos com menos de 2 dias de antecedência, entre em contato: <strong>(14) 3451-4098</strong>
        </p>
      </div>
    </div>
  );
}
