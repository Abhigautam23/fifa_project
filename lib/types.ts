export type Match = {
  id: string
  match_name: string
  match_number: number
  kickoff_at: string
  my_prob_home: number
  my_prob_draw: number
  my_prob_away: number
  bookmaker_odds: number | null
  implied_prob: number | null
  bet_selection: 'home' | 'draw' | 'away' | null
  decision: 'bet' | 'no_bet'
  stake: number
  result: 'pending' | 'won' | 'lost' | 'no_bet'
  pnl: number | null
  notes: string | null
  created_at: string
}
