const TARGET_EMAIL = "ethanbenamram99@gmail.com";
const FROM_ADDRESS = "Benul IA Contact <onboarding@resend.dev>";

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

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function buildHtml({ prenom, nom, email, telephone, taille, interets }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 16px;background:#F5F0EB;font-weight:600;color:#1A1A1A;width:160px;">${label}</td>
      <td style="padding:10px 16px;color:#1A1A1A;">${value || "—"}</td>
    </tr>`;

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAFAF8;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #eee;">
    <div style="padding:20px 24px;background:#1A1A1A;color:white;">
      <div style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#E8A990;">Benul IA</div>
      <div style="font-size:18px;margin-top:4px;">Nouvelle demande de contact</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Prénom", escapeHtml(prenom))}
      ${row("Nom", escapeHtml(nom))}
      ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#C45D3E;text-decoration:none;">${escapeHtml(email)}</a>`)}
      ${row("Téléphone", escapeHtml(telephone))}
      ${row("Taille équipe", escapeHtml(taille))}
      ${row("Centres d'intérêt", escapeHtml((interets || []).join(", ")))}
    </table>
    <div style="padding:16px 24px;background:#FAFAF8;color:#8A8A8A;font-size:12px;">
      Envoyé depuis le formulaire de contact benul-ia.fr
    </div>
  </div>
</body></html>`;
}

export async function onRequestPost(context) {
  try {
    const { RESEND_API_KEY } = context.env;
    if (!RESEND_API_KEY) {
      return json({ error: "Configuration manquante côté serveur." }, 500);
    }

    const data = await context.request.json();
    const { prenom, nom, email, telephone, taille, interets } = data;

    if (!prenom?.trim() || !nom?.trim() || !email?.trim()) {
      return json({ error: "Prénom, nom et email sont requis." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Email invalide." }, 400);
    }

    const subject = `Nouvelle demande de contact — ${prenom} ${nom}`;
    const html = buildHtml({ prenom, nom, email, telephone, taille, interets });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: TARGET_EMAIL,
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return json({ error: "Échec de l'envoi", details: errBody }, 502);
    }

    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
