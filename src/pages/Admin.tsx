import React, { useEffect, useState } from 'react';
import { fetchSubmissions } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [submissions, setSubmissions] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSubmissions()
      .then((data) => {
        if (!mounted) return;
        setSubmissions(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin - Submissions</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl mb-4">User Submissions</h2>
        {loading && <p>Loading…</p>}

        {!loading && (!submissions || Object.keys(submissions).length === 0) && (
          <p>No submissions yet.</p>
        )}

        {submissions && (
          <div className="space-y-4">
            {Object.entries(submissions).map(([id, s]) => (
              <div key={id} className="p-4 border rounded-lg bg-card/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{s.name} {s.company ? `• ${s.company}` : ''}</div>
                    <div className="text-sm text-muted-foreground">{s.email} • {s.location}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{s.pagesCount} pages</div>
                </div>
                {s.createdAt && <div className="text-xs text-muted-foreground mt-2">{new Date(s.createdAt).toLocaleString()}</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
