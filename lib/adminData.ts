import { isSupabaseConfigured, supabase } from './supabase.ts';

export interface SiteConfig {
  hiddenPages: string[];
  isReorganized: boolean;
  publicVoteEndDate: string;
  winnersVoteEndDate: string;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  link?: string;
  fileData?: string;
  fileName?: string;
  timestamp: string;
  type: 'message' | 'file' | 'critical' | 'auth';
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: 'enterprise' | 'institution' | 'media';
}

export interface VotingTeam {
  id: string;
  name: string;
  members: string;
  image: string;
  votes: number;
  type: 'public' | 'winners';
}

export interface LivePhase {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'completed' | 'active' | 'upcoming';
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  hiddenPages: ['/vote', '/vote-gagnants'],
  isReorganized: false,
  publicVoteEndDate: '',
  winnersVoteEndDate: '',
};

let cachedSiteConfig: SiteConfig | null = null;
let cachedBroadcasts: Broadcast[] | null = null;
let cachedPartners: Partner[] | null = null;
let cachedVotingTeams: VotingTeam[] | null = null;
let cachedLivePhases: LivePhase[] | null = null;

const toLocalDateTimeInput = (isoOrLocal: string | null | undefined): string => {
  if (!isoOrLocal) return '';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(isoOrLocal)) return isoOrLocal;
  const date = new Date(isoOrLocal);
  if (Number.isNaN(date.getTime())) return '';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
};

const logError = (scope: string, error: unknown) => {
  console.error(`[adminData:${scope}]`, error);
};

export const getSiteConfig = async (): Promise<SiteConfig> => {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_SITE_CONFIG;

  const { data, error } = await supabase
    .from('site_config')
    .select('hidden_pages,is_reorganized,public_vote_end_date,winners_vote_end_date')
    .eq('id', 1)
    .single();

  if (error || !data) {
    logError('getSiteConfig', error);
    return cachedSiteConfig ?? DEFAULT_SITE_CONFIG;
  }

  const mapped = {
    hiddenPages: data.hidden_pages || [],
    isReorganized: Boolean(data.is_reorganized),
    publicVoteEndDate: toLocalDateTimeInput(data.public_vote_end_date),
    winnersVoteEndDate: toLocalDateTimeInput(data.winners_vote_end_date),
  };
  cachedSiteConfig = mapped;
  return mapped;
};

export const saveSiteConfig = async (config: SiteConfig): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('site_config').upsert(
    {
      id: 1,
      hidden_pages: config.hiddenPages,
      is_reorganized: config.isReorganized,
      public_vote_end_date: config.publicVoteEndDate || null,
      winners_vote_end_date: config.winnersVoteEndDate || null,
    },
    { onConflict: 'id' }
  );

  if (error) {
    logError('saveSiteConfig', error);
    return false;
  }
  return true;
};

const mapBroadcast = (row: any): Broadcast => ({
  id: String(row.id),
  title: row.title,
  content: row.content,
  link: row.link || undefined,
  fileData: row.file_url || undefined,
  fileName: row.file_name || undefined,
  timestamp: row.created_at || new Date().toISOString(),
  type: row.type,
});

export const getBroadcasts = async (): Promise<Broadcast[]> => {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('broadcasts')
    .select('id,title,content,link,file_url,file_name,type,created_at')
    .order('created_at', { ascending: false });

  if (error || !data) {
    logError('getBroadcasts', error);
    return cachedBroadcasts ?? [];
  }
  const mapped = data.map(mapBroadcast);
  cachedBroadcasts = mapped;
  return mapped;
};

export const addBroadcast = async (payload: Omit<Broadcast, 'id' | 'timestamp'>): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('broadcasts').insert({
    title: payload.title,
    content: payload.content,
    link: payload.link || null,
    file_url: payload.fileData || null,
    file_name: payload.fileName || null,
    type: payload.type,
  });

  if (error) {
    logError('addBroadcast', error);
    return false;
  }
  return true;
};

export const deleteBroadcast = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('broadcasts').delete().eq('id', id);
  if (error) {
    logError('deleteBroadcast', error);
    return false;
  }
  return true;
};

const mapPartner = (row: any): Partner => ({
  id: String(row.id),
  name: row.name,
  logo: row.logo_url,
  category: row.category,
});

export const getPartners = async (): Promise<Partner[]> => {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('partners')
    .select('id,name,logo_url,category')
    .order('created_at', { ascending: true });

  if (error || !data) {
    logError('getPartners', error);
    return cachedPartners ?? [];
  }
  const mapped = data.map(mapPartner);
  cachedPartners = mapped;
  return mapped;
};

export const addPartner = async (payload: Omit<Partner, 'id'>): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('partners').insert({
    name: payload.name,
    logo_url: payload.logo,
    category: payload.category,
  });
  if (error) {
    logError('addPartner', error);
    return false;
  }
  return true;
};

export const deletePartner = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) {
    logError('deletePartner', error);
    return false;
  }
  return true;
};

const mapVotingTeam = (row: any): VotingTeam => ({
  id: String(row.id),
  name: row.name,
  members: row.members,
  image: row.image_url,
  votes: row.votes || 0,
  type: row.type,
});

export const getVotingTeams = async (): Promise<VotingTeam[]> => {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('voting_teams')
    .select('id,name,members,image_url,votes,type,created_at')
    .order('created_at', { ascending: true });

  if (error || !data) {
    logError('getVotingTeams', error);
    return cachedVotingTeams ?? [];
  }
  const mapped = data.map(mapVotingTeam);
  cachedVotingTeams = mapped;
  return mapped;
};

export const addVotingTeam = async (payload: Omit<VotingTeam, 'id'>): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('voting_teams').insert({
    name: payload.name,
    members: payload.members,
    image_url: payload.image,
    votes: payload.votes,
    type: payload.type,
  });
  if (error) {
    logError('addVotingTeam', error);
    return false;
  }
  return true;
};

export const incrementVotingTeamVotes = async (id: string, increment: number): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data: current, error: getError } = await supabase
    .from('voting_teams')
    .select('votes')
    .eq('id', id)
    .single();
  if (getError || !current) {
    logError('incrementVotingTeamVotes:getCurrent', getError);
    return false;
  }

  const { error: updateError } = await supabase
    .from('voting_teams')
    .update({ votes: (current.votes || 0) + increment })
    .eq('id', id);

  if (updateError) {
    logError('incrementVotingTeamVotes:update', updateError);
    return false;
  }
  return true;
};

export const deleteVotingTeam = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('voting_teams').delete().eq('id', id);
  if (error) {
    logError('deleteVotingTeam', error);
    return false;
  }
  return true;
};

const mapLivePhase = (row: any): LivePhase => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  image: row.image_url,
  status: row.status,
});

export const getLivePhases = async (): Promise<LivePhase[]> => {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('live_phases')
    .select('id,title,description,image_url,status,created_at')
    .order('created_at', { ascending: true });

  if (error || !data) {
    logError('getLivePhases', error);
    return cachedLivePhases ?? [];
  }
  const mapped = data.map(mapLivePhase);
  cachedLivePhases = mapped;
  return mapped;
};

export const addLivePhase = async (payload: Omit<LivePhase, 'id'>): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('live_phases').insert({
    title: payload.title,
    description: payload.description,
    image_url: payload.image,
    status: payload.status,
  });
  if (error) {
    logError('addLivePhase', error);
    return false;
  }
  return true;
};

export const deleteLivePhase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('live_phases').delete().eq('id', id);
  if (error) {
    logError('deleteLivePhase', error);
    return false;
  }
  return true;
};