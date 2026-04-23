"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPaymentsAction } from "../actions";
import { Edit2 } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const residentId = searchParams.get("id");
  const society = searchParams.get("society");
  const pocket = searchParams.get("pocket");
  const flat = searchParams.get("flat");
  
  // New: Capture IDs to pass back for editing
  const sId = searchParams.get("sId");
  const pId = searchParams.get("pId");

  useEffect(() => {
    if (residentId) {
      getPaymentsAction(Number(residentId)).then((data) => {
        setPayments(data);
        setLoading(false);
      });
    }
  }, [residentId]);

  const handleEdit = () => {
    const params = new URLSearchParams();
    if (sId) params.set("sId", sId);
    if (pId) params.set("pId", pId);
    if (flat) params.set("f", flat);
    router.push(`/?${params.toString()}`);
  };

  if (!residentId) {
    return <div className="p-4">Invalid Access. Please go back.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-10 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8">
        {/* Info Div */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative border border-gray-100">
          <button 
            onClick={handleEdit}
            className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <div className="text-center pt-2">
            <p className="text-lg font-bold text-gray-800 leading-tight">
              {pocket} - {flat}
            </p>
            <p className="text-sm text-gray-500 font-medium">{society}</p>
          </div>
        </div>

        {/* Dues Section */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            Current Dues
          </h2>
          
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Loading dues...</div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-200">
               <p className="text-gray-500 text-sm font-medium">No outstanding dues found.</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div 
                key={payment.payment_id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex-grow space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-gray-900">₹{payment.amount_due + payment.late_fee}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded uppercase">
                      {payment.payment_for_month}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-gray-500 leading-tight">
                    <p>Base: <span className="text-gray-700">₹{payment.amount_due}</span></p>
                    <p>Late Fee: <span className={payment.late_fee > 0 ? 'text-red-600 font-bold' : 'text-gray-700'}>₹{payment.late_fee}</span></p>
                    <p className="col-span-2 text-gray-400">Due By: <span className="text-gray-600 font-medium">{new Date(payment.due_date).toLocaleDateString()}</span></p>
                  </div>
                </div>
                <button className="ml-4 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 active:transform active:scale-95 transition-all">
                  PAY
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
