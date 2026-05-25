const TARGET_EMAIL = "ethanbenamram99@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { prenom, nom, email, entreprise, taille, interets, message } = data;

    if (!prenom?.trim() || !nom?.trim() || !email?.trim()) {
      return json({ error: "Prénom, nom et email sont requis." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Email invalide." }, 400);
    }
    if ((message || "").length > 5000) {
      return json({ error: "Message trop long." }, 400);
    }

    const subject = `Nouveau message Benul IA — ${prenom} ${nom}`;
    const payload = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      Prénom: prenom,
      Nom: nom,
      Email: email,
      Entreprise: entreprise || "—",
      "Taille équipe": taille || "—",
      "Centres d'intérêt": (interets && interets.length) ? interets.join(", ") : "—",
      Message: message || "—",
    };

    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      return json({ error: "Échec de l'envoi", details: txt }, 502);
    }

    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
