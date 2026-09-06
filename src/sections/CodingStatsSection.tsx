import { useState, useEffect, useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import CountUp from '../components/CountUp';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Flame, Target, CheckCircle, AlertCircle } from 'lucide-react';

// API Endpoints
const LEETCODE_USERNAME = import.meta.env.VITE_LEETCODE_USERNAME?.trim() || 'krishna_0409';
const CODECHEF_USERNAME = import.meta.env.VITE_CODECHEF_USERNAME?.trim() || 'jay4ignite';
const CODECHEF_API_URL = import.meta.env.VITE_CODECHEF_API_URL?.trim() || '/api/codechef';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache
const LEETCODE_CACHE_KEY = `leetcode_stats_cache_${LEETCODE_USERNAME}`;
const CODECHEF_CACHE_KEY = 'codechef_stats_cache';

const getCodeChefStatsUrl = (forceRefresh: boolean) => {
  const separator = CODECHEF_API_URL.includes('?') ? '&' : '?';
  const cacheKey = forceRefresh ? Date.now() : Math.floor(Date.now() / CACHE_DURATION);
  return `${CODECHEF_API_URL}${separator}username=${encodeURIComponent(CODECHEF_USERNAME)}&_=${cacheKey}`;
};

// Helper to calculate current daily streak from LeetCode submission calendar
const calculateStreak = (submissionCalendar: Record<string, number> | string): number => {
  try {
    let calendar: Record<string, number> = {};
    if (typeof submissionCalendar === 'string') {
      calendar = JSON.parse(submissionCalendar);
    } else {
      calendar = submissionCalendar;
    }

    if (!calendar || Object.keys(calendar).length === 0) return 0;

    // Filter days with active submissions and sort in descending order
    const timestamps = Object.keys(calendar)
      .map(Number)
      .filter(t => calendar[String(t)] > 0)
      .sort((a, b) => b - a);

    if (timestamps.length === 0) return 0;

    const now = new Date();
    // UTC midnight for today and yesterday in seconds
    const todayStartUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000;
    const yesterdayStartUtc = todayStartUtc - 86400;

    const latest = timestamps[0];

    // If the latest submission is older than yesterday, streak is broken
    if (latest < yesterdayStartUtc) {
      return 0;
    }

    let streak = 0;
    let expectedTimestamp = latest;

    for (const t of timestamps) {
      if (t === expectedTimestamp) {
        streak++;
        expectedTimestamp -= 86400;
      } else if (t < expectedTimestamp) {
        break; // Gap detected, stop counting
      }
    }

    return streak;
  } catch (e) {
    console.error('Error calculating streak:', e);
    return 0;
  }
};

interface LeetCodeData {
  total_solved: number;
  easy: number;
  medium: number;
  hard: number;
  contest_rating: string | number;
  streak: number;
  ranking: string | number;
}

interface CodeChefData {
  rating: number;
  stars: string;
  total_solved: number;
}

interface ToastMessage {
  text: string;
  type: 'success' | 'error';
  id: number;
}

export const CodingStatsSection = () => {
  const initialFetchStarted = useRef(false);
  const [lcStats, setLcStats] = useState<LeetCodeData>({
    total_solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    contest_rating: 'N/A',
    streak: 0,
    ranking: 'N/A',
  });

  const [ccStats, setCcStats] = useState<CodeChefData>({
    rating: 0,
    stars: 'N/A',
    total_solved: 0,
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isLcLoading = loading && lcStats.total_solved === 0;
  const isCcLoading = loading && ccStats.total_solved === 0;

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

  const saveToCache = (key: string, data: unknown) => {
    if (!isStorageAvailable()) return;
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheObject));
    } catch {
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
    const cachedCc = loadFromCache(CODECHEF_CACHE_KEY);

    if (cachedLc) {
      if (cachedLc.leetcode) setLcStats(cachedLc.leetcode);
      if (cachedLc.last_updated) {
        setLastUpdated(new Date(cachedLc.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
    if (cachedCc?.codechef) {
      setCcStats(cachedCc.codechef);
    }

    const latestCachedUpdate = Math.max(
      cachedLc?.last_updated || 0,
      cachedCc?.last_updated || 0,
    );
    if (latestCachedUpdate) {
      setLastUpdated(new Date(latestCachedUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    // Hydrate from cache first, then always check the connected profiles in the background.
    fetchStats(false);
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
    let timeoutOccurred = false;

    try {
      const [lcRes, ccRes] = await Promise.allSettled([
        // Fetch LeetCode
        Promise.all([
          fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/profile`, { cache: 'no-cache' }),
          fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/contest`, { cache: 'no-cache' }),
        ]).then(async ([profileRes, contestRes]) => {
          if (!profileRes.ok || !contestRes.ok) throw new Error('LeetCode API error');
          return {
            profile: await profileRes.json(),
            contest: await contestRes.json(),
          };
        }),
        // Fetch CodeChef
        fetchWithTimeout(getCodeChefStatsUrl(forceRefresh), { cache: 'no-store' }).then(async (res) => {
          if (!res.ok) throw new Error('CodeChef API error');
          return res.json();
        }),
      ]);

      let lcSuccess = false;
      let ccSuccess = false;

      // Handle LeetCode result
      if (lcRes.status === 'fulfilled') {
        const { profile, contest } = lcRes.value;
        const streak = profile.submissionCalendar
          ? calculateStreak(profile.submissionCalendar)
          : 0;

        const leetcodeStats: LeetCodeData = {
          total_solved: profile.totalSolved || 0,
          easy: profile.easySolved || 0,
          medium: profile.mediumSolved || 0,
          hard: profile.hardSolved || 0,
          contest_rating: contest.contestRating ? Math.round(contest.contestRating) : 'N/A',
          streak,
          ranking: profile.ranking || 'N/A',
        };

        setLcStats(leetcodeStats);
        saveToCache(LEETCODE_CACHE_KEY, { leetcode: leetcodeStats, last_updated: Date.now() });
        lcSuccess = true;
      } else {
        const err = lcRes.reason;
        console.error('Failed to fetch LeetCode:', err);
        if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
          timeoutOccurred = true;
        }
      }

      // Handle CodeChef result
      if (ccRes.status === 'fulfilled') {
        const data = ccRes.value;
        if (data.success) {
          const codechefStats: CodeChefData = {
            rating: data.rating || 0,
            stars: data.stars || 'N/A',
            total_solved: data.totalSolved || 0,
          };
          setCcStats(codechefStats);
          saveToCache(CODECHEF_CACHE_KEY, { codechef: codechefStats, last_updated: Date.now() });
          ccSuccess = true;
        }
      } else {
        const err = ccRes.reason;
        console.error('Failed to fetch CodeChef:', err);
        if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('timed out')) {
          timeoutOccurred = true;
        }
      }

      if (forceRefresh && lcSuccess && ccSuccess) {
        addToast('Statistics refreshed successfully!', 'success');
      } else if (forceRefresh && (lcSuccess || ccSuccess)) {
        addToast('Partial refresh complete (one platform was slow).', 'success');
      } else {
        throw new Error('Both platforms failed');
      }

      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error: unknown) {
      console.error('Failed to fetch coding stats:', error);
      if (forceRefresh) {
        if (timeoutOccurred) {
          addToast('Stats service is waking up. Showing cached statistics.', 'error');
        } else {
          addToast('Refresh failed. Showing offline cached data.', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFetchStarted.current) {
      initialFetchStarted.current = true;
      loadInitialData();
    }

    const refreshInterval = window.setInterval(() => fetchStats(false), CACHE_DURATION);
    return () => window.clearInterval(refreshInterval);
    // The refresh lifecycle is intentionally owned by this mount-only effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg sm:text-xl uppercase tracking-wider text-[#D7E2EA]">
                        LeetCode
                      </h3>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        Live
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/40">
                      leetcode.com/u/{LEETCODE_USERNAME}/
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

          {/* CodeChef Card */}
          <FadeIn delay={0.2} y={30}>
            <div className="relative rounded-[40px] border border-[#D7E2EA]/10 bg-[#111111]/85 p-6 sm:p-8 hover:border-[#D5A020]/30 transition-all duration-300 group hover:shadow-[0_15px_40px_rgba(213,160,32,0.05)] overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <a
                    href={`https://www.codechef.com/users/${CODECHEF_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/50 border border-[#D7E2EA]/10 rounded-2xl group-hover:scale-105 group-hover:border-[#D5A020]/20 transition-all flex items-center justify-center"
                  >
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-current text-[#D5A020]">
                      <title>CodeChef</title>
                      <path d="M11.2574.0039c-.37.0101-.7353.041-.1003.095C9.6164.153 9.0766.4236 8.482.694c-.757.3244-1.5147.6486-2.2176.7027-1.1896.3785-1.568.919-1.8925 1.3516 0 .054-.054.1079-.054.1079-.4325.865-.4873 1.73-.325 2.5952.1621.5407.3786 1.0282.5408 1.5148.3785 1.0274.7578 2.0007.92 3.1362.1622.3244.3235.7571.4316 1.1897.2704.8651.542 1.8383 1.353 2.5952l.0057-.0028c.0175.0183.0301.0387.0482.0568.0072-.0036.0141-.0063.0213-.0099l-.0213-.5849c.6489-.9733 1.5673-1.6221 2.865-1.8925.5195-.1093 1.081-.1497 1.6625-.1278a8.7733 8.7733 0 0 1 1.7988.2357c1.4599.3785 2.595 1.1358 2.6492 1.7846.0273.3549.0398.6952.0326 1.0364-.001.064-.0046.1285-.007.193l.1362.0682c.075-.0375.1424-.107.2059-.1902.0008-.001.002-.002.0028-.0028.0018-.0023.0039-.0061.0057-.0085.0396-.0536.0747-.1236.1107-.1931.0188-.0377.0372-.0866.0554-.1292.2048-.4622.362-1.1536.538-1.9635.0541-.2703.1092-.4864.1633-.7027.4326-.9733 1.0266-1.8382 1.6213-2.6492.9733-1.3518 1.8928-2.5962 1.7846-4.0561-1.784-3.4608-4.2718-4.0017-5.5695-4.272-.2163-.0541-.3233-.0539-.4856-.108-1.3382-.2433-2.4945-.3953-3.6046-.3648zm5.0428 14.3788a9.8602 9.8602 0 0 0-.0326-.9824c-.0541-.703-1.1892-1.46-2.7032-1.8386-.588-.1336-1.1764-.2142-1.7448-.2356-.539-.0137-1.0657.0248-1.5546.1277-1.2436.2704-2.2162.9193-2.811 1.8925l.0511 1.431c.6672-.3558 1.7326-.8747 3.139-.9994.0662-.0059.1368-.0059.2044-.0099.1177-.013.2667-.044.4444-.044 1.6075 0 3.2682.5336 4.8767 1.6483.039-.2744.0611-.549.071-.8234l.044.0227c.0028-.0622.0143-.1268.0156-.1888zM11.256.0578c.1239-.0034.2538.01.379.0114-.23-.0022-.4588.0026-.6871.0156.103-.0061.2046-.0242.308-.027zm.4983.0156c.6552.014 1.3255.0711 2.0387.1803-.6834-.0987-1.3646-.1671-2.0387-.1803zm-1.3147.0554c-.076.0087-.1527.0133-.2285.0241-.8168.1167-1.7742.7015-2.75 1.045.3545-.1323.7143-.2957 1.0747-.4501C9.0765.4774 9.6705.207 10.1571.1529c.0939-.0139.1886-.0133.2825-.0241zm-.2285.24c.1622 0 .3787-.0002.5409.0539-.1425-.0357-.2595-.026-.3706-.0142a1.174 1.174 0 0 1 .3166.0681c.5796 1.0012-.4264 5.2791-.6786 8.1492.1559 1.0276.3138 1.9963.4628 2.7201-.7029-1.7843-1.4067-4.921-1.5148-7.354-.054-.9733.001-1.8386.2172-2.4874C9.401.8557 9.7244.4228 10.2111.3687zm3.1361.271c-.811 2.1088-.9184 6.1092-.9725 7.3528-.054.5407-.0001 1.73.054 2.5952 0 .2163.054.4325.054.6488 0-.2163-.054-.3786-.054-.5948-.4326-3.2442-.974-7.1362.9185-10.002zm3.352.3777c-.2704 2.1628-1.4047 3.191-1.7832 5.2998-.1081 1.6762-.325 3.6222-.379 5.2984-.0541-1.6762-.0007-3.4601.2697-5.2444.2703-1.8384.8651-3.6776 1.8925-5.3538zm-10.381.433c-.3581.1194-.632.248-.8575.3805.2317-.1358.4996-.2666.8575-.3805zm.2101.1974c.2155.0025.4384.0734.6006.2357-.0067-.004-.0078-.0033-.0142-.0071.1331.0929.2666.2093.3932.3847-.2036.9673.2553 3.0317.0398 4.6694.0763 1.5485.0717 3.1804.849 4.4594-.9796-1.5107-1.176-3.4375-1.3218-5.236-.1128-1.0907-.2035-2.0969-.4642-2.9033-.144-.3047-.2684-.5745-.3833-.822-.0247-.0369-.0447-.0784-.071-.1135-.1082-.1082-.1619-.2696-.1619-.3777 0-.054.0539-.1618.108-.1618.054-.0541.1616-.0553.2157-.1094a1.013 1.013 0 0 1 .2101-.0184zm-1.3459.6133c-.0604.0201-.0923.041-.1405.061.1768-.034" />
                    </svg>
                  </a>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg sm:text-xl uppercase tracking-wider text-[#D7E2EA]">
                        CodeChef
                      </h3>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        Live
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/40">
                      codechef.com/users/{CODECHEF_USERNAME}
                    </p>
                  </div>
                </div>
              </div>

              {/* Solved Stats Header */}
              <div className="text-center my-6 py-4 border-y border-[#D7E2EA]/5">
                {isCcLoading ? (
                  <div className="h-12 w-28 bg-[#D7E2EA]/10 rounded-2xl animate-pulse mx-auto my-1" />
                ) : (
                  <span className="block text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D5A020] to-[#BE4C00]">
                    <CountUp target={ccStats.total_solved || 0} delay={0.2} />
                  </span>
                )}
                <span className="block text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-medium mt-1">
                  Problems Solved
                </span>
              </div>

              {/* Extra Stats */}
              <div className="space-y-4 text-sm mt-6">
                <div className="flex justify-between items-center py-2 border-b border-[#D7E2EA]/5">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Trophy className="w-4 h-4 text-[#D5A020]" /> Rating
                  </span>
                  {isCcLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D7E2EA]">
                      {ccStats.rating || 'N/A'}
                    </strong>
                  )}
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="flex items-center gap-2 text-[#D7E2EA]/50 font-light">
                    <Flame className="w-4 h-4 text-[#D5A020]" /> Stars
                  </span>
                  {isCcLoading ? (
                    <div className="h-4 w-12 bg-[#D7E2EA]/10 rounded animate-pulse" />
                  ) : (
                    <strong className="font-semibold text-[#D5A020] tracking-wider">
                      {ccStats.stars || 'N/A'}
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
