import { useState, useEffect } from 'react';
import fallbackData from '../config/githubContributionsFallback.json';

interface DayContribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionsPayload {
  total: {
    lastYear: number;
    [key: string]: number;
  };
  contributions: DayContribution[];
}

export const GitHubHeatmap = ({ username = 'JAY4IGNITE' }: { username?: string }) => {
  const [data, setData] = useState<ContributionsPayload>(fallbackData as unknown as ContributionsPayload);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    level: number;
    x: number;
    y: number;
  } | null>(null);

  // Fetch live contributions, fallback to local cache
  useEffect(() => {
    let isMounted = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contributions');
        return res.json();
      })
      .then((resData) => {
        if (isMounted && resData?.contributions?.length) {
          setData(resData);
        }
      })
      .catch((err) => {
        console.warn('Using local GitHub contributions fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Organize days into 53 columns (weeks) x 7 rows
  const days = data.contributions || [];
  const weeks: DayContribution[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  const displayWeeks = weeks.slice(-53); // last 53 weeks

  // GitHub contribution level color palette
  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return '#0e4429';
      case 2:
        return '#006d32';
      case 3:
        return '#26a641';
      case 4:
        return '#39d353';
      default:
        return '#161b22';
    }
  };

  const getCellGlow = (level: number) => {
    switch (level) {
      case 4:
        return '0 0 10px rgba(57, 211, 83, 0.6)';
      case 3:
        return '0 0 6px rgba(38, 166, 65, 0.4)';
      default:
        return 'none';
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-4">
      {/* Clean dark container matching the screenshot */}
      <div className="w-full overflow-x-auto p-4 sm:p-5 rounded-[14px] bg-[#0A0E14] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] scrollbar-thin scrollbar-thumb-white/10 flex justify-center">
        {/* Heatmap Matrix with Shining Light Beam */}
        <div className="relative inline-flex gap-[3.5px] items-center overflow-hidden p-1 rounded-lg">
          
          {/* Radiant Shining Light Sweep Effect */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                'linear-gradient(110deg, transparent 20%, rgba(57,211,83,0.15) 38%, rgba(255,255,255,0.7) 48%, rgba(57,211,83,0.9) 52%, transparent 70%)',
              backgroundSize: '250% 100%',
              animation: 'heatmapShine 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              mixBlendMode: 'screen',
            }}
          />

          {displayWeeks.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-[3.5px]">
              {week.map((day, rowIdx) => (
                <div
                  key={`${colIdx}-${rowIdx}`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      date: day.date,
                      count: day.count,
                      level: day.level,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2.8px] transition-all duration-200 hover:scale-125 hover:z-30 cursor-pointer"
                  style={{
                    backgroundColor: getCellColor(day.level),
                    boxShadow: getCellGlow(day.level),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Tooltip on Hover */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded-md bg-[#161b22] text-white text-[11px] border border-white/15 shadow-xl font-mono mb-2"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 6,
          }}
        >
          <span className="font-semibold text-[#39D353]">
            {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contributions`}
          </span>{' '}
          <span className="text-white/50 text-[10px]">
            on {new Date(hoveredCell.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}

      {/* Shining Keyframe Animation */}
      <style>{`
        @keyframes heatmapShine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
};

export default GitHubHeatmap;
