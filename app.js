import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://fruscihtkamxtzravegq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydXNjaWh0a2FteHR6cmF2ZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODgwMTQsImV4cCI6MjA2Mzg2NDAxNH0.sXncJsnUVzzauOd49kgYKbks0VDXxwGI9JIFqIY6mNY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function trackVisit() {
    console.log("Button clicked!")
  const phone = document.getElementById('phone').value.trim()
  const resultEl = document.getElementById('result')

  if (!phone) {
    resultEl.innerText = 'Please enter a phone number.'
    return
  }

  // Check if customer exists
  const { data: existing, error } = await supabase
    .from('customers')
    .select('*')
    .eq('phone_number', phone)
    .single()

  if (existing) {
    // Update visit count
    const newCount = existing.visit_count + 1
    await supabase
      .from('customers')
      .update({ visit_count: newCount, last_visit: new Date() })
      .eq('id', existing.id)

    resultEl.innerText = `Visit #${newCount} added.`

    if (newCount >= 5) {
      resultEl.innerText += ' 🎉 Reward earned!'
    }

  } else {
    // Add new customer
    await supabase.from('customers').insert({ phone_number: phone })
    resultEl.innerText = 'First visit added. Welcome!'
  }

  document.getElementById('phone').value = ''
}
