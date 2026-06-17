import { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import CountUp from '../components/CountUp';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Flame, Target, Star, CheckCircle, AlertCircle } from 'lucide-react';

// API Endpoints
const API_BASE = 'https://python-1w2h.onrender.com/api';
const LEETCODE_API_URL = 'https://python-1w2h.onrender.com/api/stats';
const MAYA_API_URL = 'https://maya-scraping.onrender.com/api/scrape';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache
const LEETCODE_CACHE_KEY = 'leetcode_stats_cache';
const MAYA_CACHE_KEY = 'maya_stats_cache';

interface LeetCodeData {
  total_solved: number;
  easy: number;
  medium: number;
  hard: number;
  contest_rating: string | number;
  streak: number;
  ranking: string | number;
}

interface MayaData {
  name: string;
  problems: { easy: number; medium: number; hard: number; total: number };
  score: number;
  rank: string | number;
  programmingLanguages: { c: number; java: number; sql: number; python: number };
  streak: { current_streak: number };
}

interface ToastMessage {
  text: string;
  type: 'success' | 'error';
  id: number;
}

export const CodingStatsSection = () => {
  const [lcStats, setLcStats] = useState<LeetCodeData>({
    total_solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    contest_rating: 'N/A',
    streak: 0,
    ranking: 'N/A',
  });

  const [mayaStats, setMayaStats] = useState<MayaData>({
    name: 'MAYA Coding Platform',
    problems: { easy: 0, medium: 0, hard: 0, total: 0 },
    score: 0,
    rank: 'N/A',
    programmingLanguages: { c: 0, java: 0, sql: 0, python: 0 },
    streak: { current_streak: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isLcLoading = loading && lcStats.total_solved === 0;
  const isMayaLoading = loading && (mayaStats.problems?.total === 0 || !mayaStats.problems);

  // Toast notifier helper
  const addToast = (text: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { text, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Caching utilities — wrapped for private browsing / SSR safety
  const isStorageAvailable = () => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const saveToCache = (key: string, data: any) => {
    if (!isStorageAvailable()) return;
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheObject));
    } catch (e) {
      // Storage full or unavailable — fail silently
    }
  };

  const loadFromCache = (key: string) => {
    if (!isStorageAvailable()) return null;
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheObject = JSON.parse(cached);
      const age = Date.now() - cacheObject.timestamp;

      if (age > CACHE_DURATION) {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore removal errors
        }
        return null;
      }
      return cacheObject.data;
    } catch {
      // JSON parse error or corrupted cache — return null
      return null;
    }
  };

  const loadInitialData = () => {
    const cachedLc = loadFromCache(LEETCODE_CACHE_KEY);
    const cachedMaya = loadFromCache(MAYA_CACHE_KEY);

    if (cachedLc) {
      if (cachedLc.leetcode) setLcStats(cachedLc.leetcode);
      if (cachedLc.last_updated) {
        setLastUpdated(new Date(cachedLc.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
    if (cachedMaya) {
      const r = cachedMaya.result || cachedMaya;
      setMayaStats(r);
    }

    // Trigger update automatically if cache is missing
    if (!cachedLc || !cachedMaya) {
      fetchStats(false);
    }
  };

  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 12000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const fetchStats = async (forceRefresh = false) => {
    setLoading(true);
    const startTime = Date.now();
    let timeoutOccurred = false;

    try {
      // 1. Prepare endpoints
      const leetcodeUrl = forceRefresh
        ? `${LEETCODE_API_URL}?force_refresh=true&timestamp=${startTime}`
        : `${LEETCODE_API_URL}?timestamp=${startTime}`;

      const mayaPayload = forceRefresh
        ? { roll_no: '24P31A1224', use_cache: false }
        : { roll_no: '24P31A1224' };

      // If force refresh is triggered, we hit refresh endpoint first for LeetCode
      if (forceRefresh) {
        try {
          await fetchWithTimeout(`${API_BASE}/refresh`, { method: 'GET', cache: 'no-cache' }, 8000);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for scraping
        } catch (e) {
          console.warn('Backend LeetCode refresh trigger failed, pulling standard stats', e);
        }
      }

      // Parallel fetching LeetCode & MAYA with a 12s timeout
      const [lcRes, mayaRes] = await Promise.allSettled([
        fetchWithTimeout(leetcodeUrl, { cache: 'no-cache' }).then((res) => {
          if (!res.ok) throw new Error('Leetcode status error');
          return res.json();
        }),
        fetchWithTimeout(MAYA_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mayaPayload),
          cache: 'no-cache',
        }).then((res) => {
          if (!res.ok) throw new Error('MAYA status error');
          return res.json();
        }),
      ]);

      let lcSuccess = false;
      let mayaSuccess = false;

      // Check for timeout / abort in either request
      if (lcRes.status === 'rejected') {
        const err = lcRes.reason;
        if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
          timeoutOccurred = true;
        }
      }
      if (mayaRes.status === 'rejected') {
        const err = mayaRes.reason;
        if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
          timeoutOccurred = true;
        }
      }

      if (timeoutOccurred) {
        addToast('Render API cold start detected. Using cached statistics.', 'error');
      }

      // Handle LeetCode response
      if (lcRes.status === 'fulfilled') {
        const data = lcRes.value;
        if (data.leetcode) {
          setLcStats(data.leetcode);
          saveToCache(LEETCODE_CACHE_KEY, data);
          lcSuccess = true;
        }
        if (data.last_updated) {
          setLastUpdated(new Date(data.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }

      // Handle MAYA response
      if (mayaRes.status === 'fulfilled') {
        const data = mayaRes.value;
        if (data.ok) {
          const r = data.result || data;
          setMayaStats(r);
          saveToCache(MAYA_CACHE_KEY, data);
          mayaSuccess = true;
        }
      }

      if (lcSuccess && mayaSuccess) {
        addToast('Statistics refreshed successfully!', 'success');
      } else if (lcSuccess || mayaSuccess) {
        addToast('Partial refresh complete (one platform was slow).', 'success');
      } else {
        throw new Error('Both platforms failed');
      }
    } catch (error: any) {
      console.error('Failed to fetch coding stats:', error);
      if (!timeoutOccurred) {
        addToast('Refresh failed. Showing offline cached data.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <section
      id="coding-stats"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 section-panel overflow-hidden"
    >
      {/* Toast Notification Container */}
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs sm:text-sm shadow-xl font-medium tracking-wide uppercase max-w-full break-words ${
                toast.type === 'success'
                  ? 'bg-black/90 border-[#B600A8]/30 text-[#B600A8]'
                  : 'bg-black/90 border-red-500/30 text-red-400'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-[#B600A8] animate-bounce" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              {toast.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto">
        <ScrollRevealText
          text="Coding Stats"
          as="h2"
          splitBy="chars"
          className="text-[#D7E2EA] font-black uppercase text-center mb-4 text-[clamp(3rem,8vw,110px)] leading-none"
          delay={0.03}
        />
          <p className="text-[#D7E2EA]/60 text-center uppercase tracking-widest text-sm sm:text-base font-semibold mb-16 sm:mb-20">
            Real-time coding platforms analytics
          </p>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
          {/* LeetCode Card */}
          <FadeIn delay={0.1} y={30}>
            <div className="relative rounded-[40px] border border-[#D7E2EA]/10 bg-[#111111]/85 p-6 sm:p-8 hover:border-[#B600A8]/30 transition-all duration-300 group hover:shadow-[0_15px_40px_rgba(182,0,168,0.05)] overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <a
                    href="https://leetcode.com/u/Nandu_2007_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/50 border border-[#D7E2EA]/10 rounded-2xl group-hover:scale-105 group-hover:border-[#B600A8]/20 transition-all"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}assets/leetcode-icon.png`}
                      alt="LeetCode"
                      className="w-10 h-10 object-contain"
                    />
                  </a>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl uppercase tracking-wider text-[#D7E2EA]">
                      LeetCode
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/40">
                      leetcode.com/u/Nandu_2007_/
                    </p>
                  </div>
                </div>
              </div>

              {/* Solved Stats Header */}
              <div className="text-center my-6 py-4 border-y border-[#D7E2EA]/5">
                {isLcLoading ? (
                  <div className="h-12 w-28 bg-[#D7E2EA]/10 rounded-2xl animate-pulse mx-auto my-1" />
                ) : (
                  <span className="block text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B600A8] to-[#7621B0]">
                    <CountUp target={lcStats.total_solved || 0} delay={0.2} />
                  </span>
                )}
                <span className="block text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-medium mt-1">
                  Problems Solved
                </span>
              </div>

              {/* Difficulty Breakdown */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Easy
                  </span>
                  {isLcLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-emerald-400">
                      <CountUp target={lcStats.easy || 0} delay={0.3} />
                    </span>
                  )}
                </div>
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Medium
                  </span>
                  {isLcLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-amber-500">
                      <CountUp target={lcStats.medium || 0} delay={0.4} />
                    </span>
                  )}
                </div>
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Hard
                  </span>
                  {isLcLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-rose-500">
                      <CountUp target={lcStats.hard || 0} delay={0.5} />
                    </span>
                  )}
                </div>
              </div>

              {/* Extra Stats */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-[#D7E2EA]/5">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Trophy className="w-4 h-4 text-[#B600A8]" /> Contest Rating
                  </span>
                  {isLcLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      {lcStats.contest_rating || 'N/A'}
                    </strong>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#D7E2EA]/5">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Flame className="w-4 h-4 text-[#B600A8]" /> Current Streak
                  </span>
                  {isLcLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      {lcStats.streak || 0} Days
                    </strong>
                  )}
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Target className="w-4 h-4 text-[#B600A8]" /> Global Rank
                  </span>
                  {isLcLoading ? (
                    <div className="h-4 w-16 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      {lcStats.ranking || 'N/A'}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* MAYA Card */}
          <FadeIn delay={0.2} y={30}>
            <div className="relative rounded-[40px] border border-[#D7E2EA]/10 bg-[#111111]/85 p-6 sm:p-8 hover:border-[#7621B0]/30 transition-all duration-300 group hover:shadow-[0_15px_40px_rgba(118,33,176,0.05)] overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <a
                    href="https://maya.technicalhub.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/50 border border-[#D7E2EA]/10 rounded-2xl group-hover:scale-105 group-hover:border-[#7621B0]/20 transition-all"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}assets/technical_hub.png`}
                      alt="Technical Hub"
                      className="w-10 h-10 object-contain"
                    />
                  </a>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl uppercase tracking-wider text-[#D7E2EA]">
                      Technical Hub
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/40">
                      {mayaStats.name || 'MAYA Coding Platform'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Solved Stats Header */}
              <div className="text-center my-6 py-4 border-y border-[#D7E2EA]/5">
                {isMayaLoading ? (
                  <div className="h-12 w-28 bg-[#D7E2EA]/10 rounded-2xl animate-pulse mx-auto my-1" />
                ) : (
                  <span className="block text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7621B0] to-[#BE4C00]">
                    <CountUp target={mayaStats.problems?.total || 0} delay={0.2} />
                  </span>
                )}
                <span className="block text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-medium mt-1">
                  Problems Solved
                </span>
              </div>

              {/* Difficulty Breakdown */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Easy
                  </span>
                  {isMayaLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-emerald-400">
                      <CountUp target={mayaStats.problems?.easy || 0} delay={0.3} />
                    </span>
                  )}
                </div>
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Medium
                  </span>
                  {isMayaLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-amber-500">
                      <CountUp target={mayaStats.problems?.medium || 0} delay={0.4} />
                    </span>
                  )}
                </div>
                <div className="bg-black/35 rounded-2xl p-4 text-center border border-[#D7E2EA]/5">
                  <span className="block text-xs text-[#D7E2EA]/40 font-medium uppercase tracking-wide mb-1">
                    Hard
                  </span>
                  {isMayaLoading ? (
                    <div className="h-6 w-12 bg-[#D7E2EA]/10 rounded animate-pulse mx-auto my-0.5" />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-rose-500">
                      <CountUp target={mayaStats.problems?.hard || 0} delay={0.5} />
                    </span>
                  )}
                </div>
              </div>

              {/* Language Statistics Grid */}
              <div className="my-6">
                <h4 className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-bold mb-3">
                  Language distribution
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 bg-black/25 rounded-xl border border-[#D7E2EA]/5">
                    <span className="text-[#D7E2EA]/50">C</span>
                    {isMayaLoading ? (
                      <div className="h-4 w-8 bg-[#D7E2EA]/10 rounded animate-pulse" />
                    ) : (
                      <strong className="text-[#D7E2EA]">{mayaStats.programmingLanguages?.c || 0}</strong>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/25 rounded-xl border border-[#D7E2EA]/5">
                    <span className="text-[#D7E2EA]/50">Java</span>
                    {isMayaLoading ? (
                      <div className="h-4 w-8 bg-[#D7E2EA]/10 rounded animate-pulse" />
                    ) : (
                      <strong className="text-[#D7E2EA]">{mayaStats.programmingLanguages?.java || 0}</strong>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/25 rounded-xl border border-[#D7E2EA]/5">
                    <span className="text-[#D7E2EA]/50">SQL</span>
                    {isMayaLoading ? (
                      <div className="h-4 w-8 bg-[#D7E2EA]/10 rounded animate-pulse" />
                    ) : (
                      <strong className="text-[#D7E2EA]">{mayaStats.programmingLanguages?.sql || 0}</strong>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/25 rounded-xl border border-[#D7E2EA]/5">
                    <span className="text-[#D7E2EA]/50">Python</span>
                    {isMayaLoading ? (
                      <div className="h-4 w-8 bg-[#D7E2EA]/10 rounded animate-pulse" />
                    ) : (
                      <strong className="text-[#D7E2EA]">{mayaStats.programmingLanguages?.python || 0}</strong>
                    )}
                  </div>
                </div>
              </div>

              {/* Extra Stats */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-[#D7E2EA]/5">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Star className="w-4 h-4 text-[#7621B0]" /> Score
                  </span>
                  {isMayaLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]"><CountUp target={mayaStats.score || 0} delay={0.6} /></strong>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#D7E2EA]/5">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Flame className="w-4 h-4 text-[#7621B0]" /> Current Streak
                  </span>
                  {isMayaLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      <CountUp target={mayaStats.streak?.current_streak || 0} delay={0.7} /> Days
                    </strong>
                  )}
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Target className="w-4 h-4 text-[#7621B0]" /> Year-wise Rank
                  </span>
                  {isMayaLoading ? (
                    <div className="h-4 w-16 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      {mayaStats.rank != null && mayaStats.rank !== 0 ? `#${mayaStats.rank}` : 'N/A'}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Footer & Manual Refresh Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-[#D7E2EA]/5">
          <p className="text-[#D7E2EA]/40 text-sm font-light">
            Last Updated: <span className="text-[#D7E2EA]/80 font-medium">{lastUpdated}</span>
          </p>

          <button
            onClick={() => fetchStats(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D7E2EA]/20 hover:border-[#B600A8] bg-[#111111] text-[#D7E2EA]/85 hover:text-white transition-all duration-300 font-medium uppercase tracking-widest text-[11px] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#B600A8] ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CodingStatsSection;
