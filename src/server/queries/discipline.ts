import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface RepeatOffenderRow {
  playerId: string;
  playerName: string;
  teamName: string | null;
  yellowCards: number;
  redCards: number;
  totalCards: number;
}

export async function getRepeatOffenders(): Promise<RepeatOffenderRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('card_events')
    .select(`
      player_id,
      card_type,
      player:players(full_name, teams(name))
    `);

  if (error) throw new Error('Could not load discipline data.');

  type CardRow = {
    player_id: string;
    card_type: string;
    player: { full_name: string; teams: { name: string } | null } | null;
  };

  const rows = (data ?? []) as unknown as CardRow[];

  const map = new Map<string, RepeatOffenderRow>();
  for (const row of rows) {
    const existing = map.get(row.player_id);
    const isYellow = row.card_type === 'yellow';
    if (existing) {
      if (isYellow) existing.yellowCards++;
      else existing.redCards++;
      existing.totalCards++;
    } else {
      map.set(row.player_id, {
        playerId: row.player_id,
        playerName: row.player?.full_name ?? 'Unknown',
        teamName: row.player?.teams?.name ?? null,
        yellowCards: isYellow ? 1 : 0,
        redCards: isYellow ? 0 : 1,
        totalCards: 1,
      });
    }
  }

  return Array.from(map.values())
    .filter((r) => r.totalCards >= 2)
    .sort((a, b) => b.totalCards - a.totalCards);
}

export interface PlayerAppearanceRow {
  playerId: string;
  playerName: string;
  teamName: string | null;
  jerseyNumber: number | null;
  position: string | null;
  appearances: number;
  asStarter: number;
  asBench: number;
}

export async function getPlayerAppearances(): Promise<PlayerAppearanceRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('match_lineups')
    .select(`
      player_id,
      lineup_type,
      player:players(full_name, jersey_number, position, teams(name))
    `);

  if (error) throw new Error('Could not load appearance data.');

  type LineupRow = {
    player_id: string;
    lineup_type: 'starter' | 'bench';
    player: { full_name: string; jersey_number: number | null; position: string | null; teams: { name: string } | null } | null;
  };

  const rows = (data ?? []) as unknown as LineupRow[];

  const map = new Map<string, PlayerAppearanceRow>();
  for (const row of rows) {
    const existing = map.get(row.player_id);
    const isStarter = row.lineup_type === 'starter';
    if (existing) {
      existing.appearances++;
      if (isStarter) existing.asStarter++;
      else existing.asBench++;
    } else {
      map.set(row.player_id, {
        playerId: row.player_id,
        playerName: row.player?.full_name ?? 'Unknown',
        teamName: row.player?.teams?.name ?? null,
        jerseyNumber: row.player?.jersey_number ?? null,
        position: row.player?.position ?? null,
        appearances: 1,
        asStarter: isStarter ? 1 : 0,
        asBench: isStarter ? 0 : 1,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.appearances - a.appearances);
}
