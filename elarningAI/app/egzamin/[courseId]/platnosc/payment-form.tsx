'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { config } from '@/config';

interface Props {
  courseId: string;
  amountGrosze: number;
}

export function PaymentForm({ courseId, amountGrosze }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMock = config.payment.mode === 'mock';

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, amountGrosze }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Błąd płatności');
      router.push(data.redirectUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Błąd płatności');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-700">
          Tryb testowy — płatność jest symulowana, bez prawdziwej transakcji
        </div>
      )}
      <Button onClick={handlePay} loading={loading} className="w-full py-3 text-base">
        {isMock ? 'Symuluj płatność (dev)' : 'Przejdź do płatności →'}
      </Button>
    </div>
  );
}
