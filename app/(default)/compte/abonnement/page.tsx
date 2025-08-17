// app/(default)/compte/abonnement/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { Suspense } from "react";

export const metadata = {
  title: "Mon abonnement – ForGesty",
};

type SubState = {
  status: string | null; // active | trialing | past_due | canceled | unpaid | ...
  planLabel: string | null; // ex. Proprietaire / Premium ...
  priceId: string | null;
  currentPeriodEnd: number | null; // epoch seconds
  customerEmail: string | null;
};

async function fetchSubscriptionForUser(email: string): Promise<SubState | null> {
  // === OPTION A: Ta base (si déjà branchée)
  // try {
  //   const res = await fetch(`${process.env.INTERNAL_API_URL}/subscriptions?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  //   if (res.ok) return await res.json();
  // } catch {}

  // === OPTION B: Stripe (fallback)
  const customers = await stripe.customers.list({ email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) return null;

  const subs = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 1,
    expand: ["data.items.data.price.product"],
  });

  const sub = subs.data[0];
  if (!sub) return null;

  const priceObj = sub.items.data[0]?.price as Stripe.Price | undefined;
  const product = priceObj?.product as Stripe.Product | undefined;

  return {
    status: sub.status ?? null,
    planLabel: (product?.name as string) ?? null,
    priceId: priceObj?.id ?? null,
    currentPeriodEnd: sub.current_period_end ?? null,
    customerEmail: typeof customer.email === "string" ? customer.email : null,
  };
}

function StatusPill({ status }: { status: string | null }) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    trialing: "bg-blue-100 text-blue-700",
    past_due: "bg-yellow-100 text-yellow-700",
    canceled: "bg-gray-200 text-gray-700",
    unpaid: "bg-red-100 text-red-700",
  };
  const cls = map[status ?? ""] ?? "bg-gray-100 text-gray-700";
  const label = (status ?? "unknown").replace("_", " ");
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

function formatDate(epoch: number | null) {
  if (!epoch) return "–";
  return new Date(epoch * 1000).toLocaleDateString();
}

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams?: Promise<{ checkout?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const justPaid = sp?.checkout === "success";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold">Mon abonnement</h1>
        <p className="mt-2 text-gray-600">Veuillez vous connecter pour voir votre abonnement.</p>
      </main>
    );
  }

  const sub = await fetchSubscriptionForUser(session.user.email);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">Mon abonnement</h1>

      {justPaid && (
        <SuccessBanner />
      )}

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        {sub ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Plan</div>
                <div className="text-lg font-semibold">{sub.planLabel ?? "—"}</div>
              </div>
              <StatusPill status={sub.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-gray-600">Prochaine échéance</div>
                <div className="font-medium">{formatDate(sub.currentPeriodEnd)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email de facturation</div>
                <div className="font-medium">{sub.customerEmail ?? "—"}</div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/api/billing/portal"
                className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
              >
                Gérer mon abonnement (Stripe)
              </a>
            </div>
          </div>
        ) : (
          <div className="text-gray-700">
            Aucun abonnement actif détecté pour <strong>{session.user.email}</strong>.
            <div className="mt-3">
              <Link
                className="inline-flex items-center rounded-full border px-5 py-2 font-medium hover:bg-gray-50"
                href="/tarifs"
              >
                Choisir un plan
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SuccessBanner() {
  return (
    <Suspense>
      {/* Client component inline via "use client" boundary */}
      {/* eslint-disable-next-line @next/next/no-script-in-document */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              const el = document.getElementById('success-redirect');
              if (el) el.style.display = 'block';
              setTimeout(() => { window.location.href = '/dashboard'; }, 3500);
            }, 100);
          `,
        }}
      />
      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="font-semibold text-green-800">Paiement confirmé 🎉</div>
        <div className="text-green-700">Merci ! Votre abonnement est actif (ou en cours d’activation).</div>
        <div id="success-redirect" className="mt-2 hidden text-sm text-green-800/80">
          Redirection vers le tableau de bord…
        </div>
      </div>
    </Suspense>
  );
}
