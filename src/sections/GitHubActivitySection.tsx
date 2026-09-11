import { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import GitHubHeatmap from '../components/GitHubHeatmap';
import { BookOpen, Star, GitFork, Clock, ArrowUpRight } from 'lucide-react';

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export const GitHubActivitySection = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGitHubData = async () => {
    const username = 'JAY4IGNITE';
    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`).then((res) => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`).then((res) => {
          if (!res.ok) throw new Error('Failed to fetch repos');
          return res.json();
        }),
      ]);

      setProfile(profileRes);
      setRepos(reposRes);
    } catch (e) {
      console.error('Failed to load GitHub data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  return (
    <section
      id="github-activity"
      className="bg-white text-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 section-panel overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0} y={40}>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center mb-4"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
          >
            GitHub Activity
          </h2>
          <p className="text-[#0C0C0C]/50 text-center uppercase tracking-widest text-xs sm:text-sm font-medium mb-16 sm:mb-20">
            My open source contributions
          </p>
        </FadeIn>

        {/* Interactive GitHub Heatmap with Snake Eater & Shining Modes */}
        <FadeIn delay={0.05} y={30} className="mb-12">
          <GitHubHeatmap username="JAY4IGNITE" />
        </FadeIn>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-[#0C0C0C]/10 border-t-[#B600A8] animate-spin" />
            <p className="text-[#0C0C0C]/40 text-sm mt-4 uppercase tracking-widest">
              Fetching repositories...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 items-start">
            
            {/* Profile Card */}
            {profile && (
              <FadeIn delay={0.1} y={30} className="lg:col-span-1">
                <div className="relative rounded-[40px] border border-[#0C0C0C]/10 bg-[#F8F9FA] p-6 sm:p-8 hover:border-[#B600A8]/30 transition-all duration-300 group hover:shadow-[0_15px_40px_rgba(182,0,168,0.05)] text-center flex flex-col items-center">
                  
                  {/* Avatar */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#B600A8] shadow-[0_0_30px_rgba(182,0,168,0.2)] mb-6">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.login}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
 
                  {/* Info */}
                  <h3 className="font-bold text-xl sm:text-2xl text-[#0C0C0C] mb-1">
                    {profile.name || profile.login}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[#B600A8] font-medium mb-4">
                    @{profile.login}
                  </p>
 
                  <p className="text-sm text-[#0C0C0C]/60 font-light leading-relaxed mb-6 max-w-xs">
                    {profile.bio || 'Passionate B.Tech Student & Web Developer'}
                  </p>
 
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 w-full my-6 py-4 border-y border-[#0C0C0C]/5 text-center">
                    <div>
                      <span className="block text-lg sm:text-xl font-bold text-[#0C0C0C]">
                        {profile.followers}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#0C0C0C]/40 font-medium">
                        Followers
                      </span>
                    </div>
                    <div>
                      <span className="block text-lg sm:text-xl font-bold text-[#0C0C0C]">
                        {profile.following}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#0C0C0C]/40 font-medium">
                        Following
                      </span>
                    </div>
                    <div>
                      <span className="block text-lg sm:text-xl font-bold text-[#0C0C0C]">
                        {profile.public_repos}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#0C0C0C]/40 font-medium">
                        Repos
                      </span>
                    </div>
                  </div>
 
                  {/* Button */}
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#0C0C0C]/20 hover:border-[#B600A8] bg-[#0C0C0C]/5 text-[#0C0C0C]/95 hover:text-white hover:bg-black transition-all duration-300 font-medium uppercase tracking-widest text-[11px] w-full justify-center group/btn hover:shadow-[0_0_20px_rgba(182,0,168,0.1)]"
                  >
                    View Profile
                    <ArrowUpRight className="w-4 h-4 text-[#B600A8] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </FadeIn>
            )}
 
            {/* Repositories List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {repos.map((repo, i) => (
                <FadeIn key={repo.name} delay={0.1 + i * 0.05} y={30}>
                  <div className="h-full rounded-[30px] border border-[#0C0C0C]/10 bg-[#F8F9FA]/75 p-5 sm:p-6 hover:border-[#7621B0]/30 hover:bg-white transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_10px_30px_rgba(118,33,176,0.04)]">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base sm:text-lg text-[#0C0C0C] hover:text-[#7621B0] transition-colors leading-snug break-all"
                        >
                          {repo.name}
                        </a>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-[#0C0C0C]/70 font-light leading-relaxed mb-6 line-clamp-3">
                        {repo.description || 'No description available for this repository.'}
                      </p>
                    </div>
 
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#0C0C0C]/50 pt-4 border-t border-[#0C0C0C]/5">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium text-[#7621B0]">
                          <BookOpen className="w-3.5 h-3.5" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#BE4C00]/20 text-[#BE4C00]" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-[#0C0C0C]/50" />
                        {repo.forks_count}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
 
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubActivitySection;
