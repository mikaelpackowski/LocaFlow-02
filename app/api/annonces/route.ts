export async function POST(req: Request) {
  try {
    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const type = parsePropertyType(String(body.type ?? ""));
    const leaseType = parseLeaseType(String(body.leaseType ?? ""));
    const city = String(body.city ?? "").trim();

    if (!title || !type || !leaseType || !city) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const rent = Number(body.rent ?? 0);
    const charges = Number(body.charges ?? 0);
    const bedrooms = Number(body.bedrooms ?? 0);

    // ✅ surface est NON-nullable dans le schéma → toujours un nombre
    const surface =
      body.surface === null || body.surface === undefined
        ? 0
        : Number(body.surface);

    const furnished = Boolean(body.furnished ?? false);
    const status = parseStatus(body.status);
    const address = body.address ? String(body.address) : null;
    const lat = body.lat != null ? Number(body.lat) : null;
    const lng = body.lng != null ? Number(body.lng) : null;
    const availableAt = body.availableAt ? new Date(body.availableAt) : null;

    const images: string[] = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

    const created = await prisma.listing.create({
      data: {
        ownerId,
        title,
        description,
        type,
        leaseType,
        city,
        address,
        lat: lat,          // champs nullable: tu peux passer null
        lng: lng,
        rent,
        charges,
        bedrooms,
        surface,           // ✅ toujours un nombre
        furnished,
        status,
        availableAt,       // nullable OK
        images: images.length
          ? { create: images.map((url, idx) => ({ url, alt: null, sort: idx })) }
          : undefined,
      },
      include: { images: true, owner: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json({ ok: true, listing: created }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/annonces error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
