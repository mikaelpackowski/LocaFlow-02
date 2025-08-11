// utils/owner-data.ts

export function mockOwnerStats() {
  return {
    listed: 4,
    occupancy: 92,
    rentThisMonth: 3820,
    applications: 7,
  };
}

export function mockProperties() {
  return [
    { id: "p1", slug: "studio-paris-11-bastille", title: "Studio Paris 11 - Bastille", city: "Paris 11", type: "studio", rent: 980 },
    { id: "p2", slug: "t2-lyon-part-dieu", title: "T2 Lyon - Part-Dieu", city: "Lyon 3", type: "appartement", rent: 890 },
    { id: "p3", slug: "maison-bordeaux-cauderan", title: "Maison Bordeaux - Caudéran", city: "Bordeaux", type: "maison", rent: 1450 },
    { id: "p4", slug: "t3-marseille-vieux-port", title: "T3 Marseille - Vieux-Port", city: "Marseille 1", type: "appartement", rent: 990 },
    { id: "p5", slug: "t1lille-centre", title: "T1 Lille - Centre", city: "Lille", type: "appartement", rent: 640 },
  ];
}

export function mockApplications() {
  return [
    { id: "a1", applicant: "Alice B.", propertyTitle: "Studio Paris 11 - Bastille", city: "Paris 11", status: "Reçue" },
    { id: "a2", applicant: "Nicolas D.", propertyTitle: "T2 Lyon - Part-Dieu", city: "Lyon 3", status: "En cours" },
    { id: "a3", applicant: "Sonia L.", propertyTitle: "T3 Marseille - Vieux-Port", city: "Marseille 1", status: "Acceptée" },
    { id: "a4", applicant: "Mathieu R.", propertyTitle: "Maison Bordeaux - Caudéran", city: "Bordeaux", status: "Reçue" },
    { id: "a5", applicant: "Yasmine K.", propertyTitle: "T1 Lille - Centre", city: "Lille", status: "En cours" },
  ];
}

export function mockPayments() {
  return [
    { id: "pay1", tenant: "Paul M.", propertyTitle: "T2 Lyon - Part-Dieu", date: "05/08/2025", amount: 890 },
    { id: "pay2", tenant: "Clara T.", propertyTitle: "Studio Paris 11 - Bastille", date: "04/08/2025", amount: 980 },
    { id: "pay3", tenant: "Jules A.", propertyTitle: "T3 Marseille - Vieux-Port", date: "03/08/2025", amount: 990 },
    { id: "pay4", tenant: "Lina Z.", propertyTitle: "T1 Lille - Centre", date: "02/08/2025", amount: 640 },
    { id: "pay5", tenant: "Arthur B.", propertyTitle: "Maison Bordeaux - Caudéran", date: "01/08/2025", amount: 1450 },
  ];
}
