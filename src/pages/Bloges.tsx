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

        // ❗ Only show REAL submitted blogs: must have pages + a user name
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

  // ✅ increment views when a submission is selected
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 lg:flex-row">
        {/* Left: List of flipbooks */}
        <div className="w-full lg:w-1/3 lg:pr-6 border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0">
          <h2 className="text-xl font-serif font-semibold mb-4">Flipbook Blog</h2>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading flipbooks...</p>
          )}

          {!loading && submissions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No flipbooks submitted yet. Create one and click &quot;Submit&quot; from the viewer.
            </p>
          )}

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3 rounded-lg border ${
                  selectedId === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/60 bg-card/40'
                } hover:bg-card/70 transition-colors`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {s.user?.name || 'Untitled Flipbook'}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground line-clamp-2">
                  {s.user?.company || s.user?.location || s.user?.email || 'No extra details'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
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

        {/* Right: Selected flipbook viewer + info */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          {selected ? (
            <>
              <FlipbookViewer pages={selected.pages} allowSubmit={false} />

              {/* Stats + user details below flipbook */}
              <div className="w-full max-w-4xl mt-4 px-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border border-border/50 rounded-xl px-4 py-3 bg-card/60">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">
                      {selected.user?.name || 'Anonymous creator'}
                    </span>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {selected.user?.company && (
                        <p>Company: {selected.user.company}</p>
                      )}
                      {selected.user?.location && (
                        <p>Location: {selected.user.location}</p>
                      )}
                      {selected.user?.email && <p>Email: {selected.user.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(selected)}
                      disabled={liking === selected.id}
                      className="flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">
                        {selected.stats?.likes || 0}
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(selected)}
                      disabled={sharing}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">
                        {selected.stats?.shares || 0}
                      </span>
                    </Button>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{selected.stats?.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-12">
              Select a flipbook from the left to view it here.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bloges;
