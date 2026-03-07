'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireRole } from '@/server/queries/auth';

async function adminOnly() {
  await requireRole(['admin']);
  return await createServerSupabaseClient();
}

export async function archivePlayer(playerId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('players').update({ is_active: false }).eq('id', playerId);
  if (error) throw new Error(error.message);
  revalidatePath('/players');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function restorePlayer(playerId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('players').update({ is_active: true }).eq('id', playerId);
  if (error) throw new Error(error.message);
  revalidatePath('/players');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deletePlayer(playerId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('players').delete().eq('id', playerId);
  if (error) throw new Error(error.message);
  revalidatePath('/players');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function archiveReferee(refereeId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('referees').update({ is_active: false }).eq('id', refereeId);
  if (error) throw new Error(error.message);
  revalidatePath('/referees');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function restoreReferee(refereeId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('referees').update({ is_active: true }).eq('id', refereeId);
  if (error) throw new Error(error.message);
  revalidatePath('/referees');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteReferee(refereeId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('referees').delete().eq('id', refereeId);
  if (error) throw new Error(error.message);
  revalidatePath('/referees');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function archiveMatch(matchId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('matches').update({ is_archived: true }).eq('id', matchId);
  if (error) throw new Error(error.message);
  revalidatePath('/matches');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function restoreMatch(matchId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('matches').update({ is_archived: false }).eq('id', matchId);
  if (error) throw new Error(error.message);
  revalidatePath('/matches');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteMatch(matchId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('matches').delete().eq('id', matchId);
  if (error) throw new Error(error.message);
  revalidatePath('/matches');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function archiveTeam(teamId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('teams').update({ is_archived: true }).eq('id', teamId);
  if (error) throw new Error(error.message);
  revalidatePath('/teams');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function restoreTeam(teamId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('teams').update({ is_archived: false }).eq('id', teamId);
  if (error) throw new Error(error.message);
  revalidatePath('/teams');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteTeam(teamId: string) {
  const supabase = await adminOnly();
  const { error } = await supabase.from('teams').delete().eq('id', teamId);
  if (error) throw new Error(error.message);
  revalidatePath('/teams');
  revalidatePath('/dashboard');
  return { success: true };
}
