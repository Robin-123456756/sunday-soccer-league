import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ExportPlayerFilters } from '@/types/database';
import type { PlayerExportRow } from '@/types/player';

export interface PlayerOption {
  id: string;
  full_name: string;
  jersey_number: number | null;
  position: string | null;
  team_id: string;
}

export interface PlayerListItem {
  id: string;
  full_name: string;
  jersey_number: number | null;
  position: string | null;
  registration_number: string | null;
  is_active: boolean;
  team_id: string;
  team_name: string | null;
}

export interface PlayerRecord {
  id: string;
  full_name: string;
  jersey_number: number | null;
  position: string | null;
  registration_number: string | null;
  is_active: boolean;
  team_id: string;
}

export async function getExportablePlayerRows(filters: ExportPlayerFilters = {}): Promise<PlayerExportRow[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('players')
    .select(`
      id,
      full_name,
      jersey_number,
      position,
      registration_number,
      is_active,
      teams(name),
      card_events(card_type),
      match_lineups(id)
    `)
    .order('full_name', { ascending: true });

  if (filters.teamId) {
    query = query.eq('team_id', filters.teamId);
  }

  if (filters.playerId) {
    query = query.eq('id', filters.playerId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Could not load player export data.');
  }

  type PlayerExportQueryRow = {
    id: string;
    full_name: string;
    jersey_number: number | null;
    position: string | null;
    registration_number: string | null;
    is_active: boolean;
    teams: { name: string } | null;
    card_events: { card_type: string }[] | null;
    match_lineups: { id: string }[] | null;
  };

  return ((data ?? []) as unknown as PlayerExportQueryRow[]).map((player) => {
    const cardEvents = Array.isArray(player.card_events) ? player.card_events : [];
    const lineups = Array.isArray(player.match_lineups) ? player.match_lineups : [];

    return {
      fullName: player.full_name,
      teamName: player.teams?.name ?? '',
      jerseyNumber: player.jersey_number ?? undefined,
      position: player.position ?? undefined,
      registrationNumber: player.registration_number ?? undefined,
      isActive: player.is_active,
      yellowCards: cardEvents.filter((event) => event.card_type === 'yellow').length,
      redCards: cardEvents.filter((event) => event.card_type !== 'yellow').length,
      appearances: lineups.length,
    } satisfies PlayerExportRow;
  });
}

export async function getPlayersByTeam(teamId: string): Promise<PlayerOption[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('players')
    .select('id, full_name, jersey_number, position, team_id')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .order('full_name');

  if (error) throw new Error('Could not load players.');
  return (data ?? []) as PlayerOption[];
}

export async function getPlayerRecord(playerId: string): Promise<PlayerRecord | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('players')
    .select('id, full_name, jersey_number, position, registration_number, is_active, team_id')
    .eq('id', playerId)
    .maybeSingle();

  if (error) throw new Error('Could not load player.');
  return (data as PlayerRecord | null) ?? null;
}

export interface PlayerFilterOptions {
  teamId?: string;
  search?: string;
  isActive?: boolean;
}

export async function getPlayersList(filters: PlayerFilterOptions = {}): Promise<PlayerListItem[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('players')
    .select('id, full_name, jersey_number, position, registration_number, is_active, team_id, teams(name)')
    .order('full_name');

  if (filters.teamId) {
    query = query.eq('team_id', filters.teamId);
  }

  if (filters.search) {
    query = query.ilike('full_name', `%${filters.search}%`);
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  const { data, error } = await query;

  if (error) throw new Error('Could not load players list.');

  type PlayerWithTeam = {
    id: string;
    full_name: string;
    jersey_number: number | null;
    position: string | null;
    registration_number: string | null;
    is_active: boolean;
    team_id: string;
    teams: { name: string } | null;
  };

  return ((data ?? []) as unknown as PlayerWithTeam[]).map((player) => ({
    id: player.id,
    full_name: player.full_name,
    jersey_number: player.jersey_number ?? null,
    position: player.position ?? null,
    registration_number: player.registration_number ?? null,
    is_active: Boolean(player.is_active),
    team_id: player.team_id,
    team_name: player.teams?.name ?? null,
  }));
}
