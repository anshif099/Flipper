import { useEffect, useState } from 'react';
import { fetchSubmissions, updateSubmission } from '@/lib/firebase';
import FlipbookViewer from '@/components/FlipbookViewer';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Submission {
  id: string;
  pages: string[];
  user?: {
    name?: string;
    email?: string;
    location?: string;
    company?: string;
  };
  stats?: {
    likes?: number;
    views?: number;
    shares?: number;
  };
  createdAt?: number;
}

const Bloges = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSubmissions();

        if (!data) {
          setSubmissions([]);
          return;
        }

        const list: Submission[] = Object.entries<any>(data).map(([id, value]) => ({
          id,
          pages: value.pages || [],
          user: value.user || {},
          stats: value.stats || {},
          createdAt: value.createdAt,
        }));

        // Only show real submitted blogs: must have pages + user name
        const filtered = list.filter(
          (item) => item.pages && item.pages.length > 0 && item.user && item.user.name
        );

        // newest first
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setSubmissions(filtered);

        if (filtered.length > 0 && !selectedId) {
          setSelectedId(filtered[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load flipbooks');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = submissions.find((s) => s.id === selectedId) || null;

  // increment views when a submission is selected
  useEffect(() => {
    const incrementViews = async () => {
      if (!selected) return;
      const currentStats = selected.stats || {};
      const currentViews = currentStats.views || 0;

      try {
        const newStats = {
          ...currentStats,
          views: currentViews + 1,
        };

        await updateSubmission(selected.id, { stats: newStats });

        setSubmissions((prev) =>
          prev.map((item) =>
            item.id === selected.id
              ? {
                  ...item,
                  stats: newStats,
                }
              : item
          )
        );
      } catch (err) {
        console.error('Failed to update views', err);
      }
    };

    if (selected) {
      incrementViews();
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLike = async (submission: Submission) => {
    setLiking(submission.id);

    const currentStats = submission.stats || {};
    const currentLikes = currentStats.likes || 0;

    try {
      const newStats = {
        ...currentStats,
        likes: currentLikes + 1,
      };

      await updateSubmission(submission.id, { stats: newStats });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submission.id
            ? {
                ...item,
                stats: newStats,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to like flipbook');
    } finally {
      setLiking(null);
    }
  };

  const handleShare = async (submission: Submission) => {
    if (!submission.pages || submission.pages.length === 0) {
      toast.error('No pages to share');
      return;
    }

    setSharing(true);
    try {
      const shareUrl = window.location.href; // simple: share this Bloges page

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Check out this flipbook',
            text: submission.user?.name
              ? `${submission.user.name}'s flipbook on Flipper`
              : 'Flipbook on Flipper',
            url: shareUrl,
          });
        } catch (err) {
          console.warn('Share cancelled or failed', err);
        }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      }

      const currentStats = submission.stats || {};
      const currentShares = currentStats.shares || 0;
      const newStats = {
        ...currentStats,
        shares: currentShares + 1,
      };

      await updateSubmission(submission.id, { stats: newStats });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submission.id
            ? {
                ...item,
                stats: newStats,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to share flipbook');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-50">
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Outer card to match Index theme */}
        <div className="rounded-3xl border border-amber-500/15 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-4 sm:p-6 lg:p-8">
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-amber-300 tracking-wide">
                Flipbook Blog
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
                Browse flipbooks submitted by users from the converter.
              </p>
            </div>
            <span className="hidden sm:inline text-xs text-amber-200/80">
              {submissions.length} published
            </span>
          </div>

          {/* Content split */}
          <div
            className="
              flex flex-col-reverse lg:flex-row
              gap-6 lg:gap-8
            "
          >
            {/* Left (desktop) / Bottom (mobile): list */}
            <div
              className="
                w-full 
                lg:w-1/3 
                lg:pr-6 
                border-t lg:border-t-0 
                lg:border-r 
                border-amber-500/20 
                pt-4 lg:pt-0 
                pb-2 lg:pb-0
                mt-4 lg:mt-0
              "
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
                <span className="text-[11px] sm:text-xs text-amber-200/80">
                  {submissions.length} flipbooks
                </span>
              </div>

              {loading && (
                <p className="text-sm text-slate-300/80">Loading flipbooks...</p>
              )}

              {!loading && submissions.length === 0 && (
                <p className="text-sm text-slate-300/80">
                  No flipbooks submitted yet. Generate a flipbook and tap
                  &quot;Submit&quot; on the converter page.
                </p>
              )}

              <div
                className="
                  space-y-3 
                  max-h-[40vh] 
                  sm:max-h-[50vh] 
                  lg:max-h-[70vh] 
                  overflow-y-auto 
                  pr-1 sm:pr-2
                "
              >
                {submissions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`
                      w-full text-left 
                      p-3 sm:p-3.5 
                      rounded-xl border text-slate-100
                      ${
                        selectedId === s.id
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-amber-500/20 bg-slate-950/70'
                      } 
                      hover:border-amber-400/80 hover:bg-amber-500/10
                      transition-colors
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm sm:text-[15px] font-medium truncate">
                        {s.user?.name || 'Untitled Flipbook'}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-amber-200/80 ml-2 shrink-0">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-[12px] text-slate-300/80 line-clamp-2">
                      {s.user?.company || s.user?.location || s.user?.email || 'No extra details'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] sm:text-[11px] text-amber-200/80">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {s.stats?.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {s.stats?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {s.stats?.shares || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right (desktop) / Top (mobile): viewer + info */}
            <div className="w-full lg:w-2/3 flex flex-col items-center">
              {selected ? (
                <>
                  {/* Flipbook viewer */}
                  <div className="w-full flex justify-center rounded-3xl border border-amber-500/20 bg-slate-950/70 p-3 sm:p-4">
                    <FlipbookViewer pages={selected.pages} allowSubmit={false} />
                  </div>

                  {/* Stats + user details below flipbook */}
                  <div className="w-full max-w-4xl mt-4 px-1 sm:px-1.5 lg:px-2">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 border border-amber-500/25 rounded-xl px-3 sm:px-4 py-3 bg-slate-950/80">
                      <div className="flex flex-col gap-1 text-sm w-full sm:w-auto">
                        <span className="font-medium text-amber-100">
                          {selected.user?.name || 'Anonymous creator'}
                        </span>
                        <div className="text-xs text-slate-300 space-y-0.5">
                          {selected.user?.company && (
                            <p>Company: {selected.user.company}</p>
                          )}
                          {selected.user?.location && (
                            <p>Location: {selected.user.location}</p>
                          )}
                          {selected.user?.email && <p>Email: {selected.user.email}</p>}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(selected)}
                          disabled={liking === selected.id}
                          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 text-amber-100 hover:text-black hover:bg-amber-400/90"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{selected.stats?.likes || 0}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(selected)}
                          disabled={sharing}
                          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 text-amber-100 hover:text-black hover:bg-amber-400/90"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{selected.stats?.shares || 0}</span>
                        </Button>

                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-200/90 ml-auto sm:ml-0">
                          <Eye className="w-4 h-4" />
                          <span>{selected.stats?.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-300/80 mt-10 sm:mt-12 text-center">
                  Select a flipbook from the list to view it here.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bloges;
