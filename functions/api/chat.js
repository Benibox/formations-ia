export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://benul-ia.fr",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { messages } = await context.request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Clé API non configurée" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: `Tu es l'assistant de Benul IA, un consultant en transformation IA. Tu aides les visiteurs à comprendre les formations proposées. Sois concis, amical et professionnel. Réponds en français.

Formations proposées :
- Formation IA pour dirigeants (1 jour) : comprendre l'IA, identifier les opportunités, construire une feuille de route
- Formation IA pour équipes (2 jours) : prise en main des outils IA, prompt engineering, intégration dans les workflows
- Accompagnement sur mesure : audit IA, stratégie de déploiement, suivi personnalisé

Si on te pose une question hors sujet, ramène poliment la conversation vers les formations et services de Benul IA.`,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: "Erreur API Claude", details: err }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://benul-ia.fr",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
