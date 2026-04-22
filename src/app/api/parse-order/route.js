import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a supply chain ordering assistant for ARDA Rituals, a beauty brand.
Parse natural language order requests and return a JSON array of order items.
Known products: Sea Mist (AR-001), Glow Oil (AR-002), Body Lotion (AR-003), Hand Wash (AR-004), Lip Balm (AR-005).
Match product names case-insensitively. If a product is not recognised, skip it.
Return ONLY valid JSON — no markdown, no code fences, no explanation.
Format: [{"product": "Sea Mist", "sku": "AR-001", "quantity": 3000}]`

export async function POST(request) {
  try {
    const { input } = await request.json()
    if (!input?.trim()) {
      return Response.json({ error: 'No input provided' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: input.trim() }],
    })

    const raw = message.content[0].text.trim()
    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const items = JSON.parse(cleaned)

    return Response.json({ items })
  } catch (err) {
    return Response.json({ error: err.message || 'Failed to parse order' }, { status: 500 })
  }
}
