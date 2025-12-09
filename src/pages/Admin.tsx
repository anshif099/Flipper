import React, { useEffect, useState } from 'react';
import { fetchSubmissions, deleteSubmission } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this submission? This action is permanent.');
    if (!ok) return;
    try {
      await deleteSubmission(id);
      toast.success('Submission deleted');
      // remove locally
      setSubmissions((prev) => {
        if (!prev) return prev;
        const copy = { ...prev } as Record<string, any>;
        delete copy[id];
        return Object.keys(copy).length ? copy : null;
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete submission');
    }
  };

  const handleExportAll = async () => {
    if (!submissions || Object.keys(submissions).length === 0) {
      toast.error('No submissions to export');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      const lineHeight = 16;
      const maxWidth = pageWidth - margin * 2;

      const rows: string[] = [];
      Object.entries(submissions).forEach(([id, s]) => {
        rows.push(`Name: ${s.name || ''}`);
        rows.push(`Email: ${s.email || ''}`);
        rows.push(`Location: ${s.location || ''}`);
        rows.push(`Company: ${s.company || ''}`);
        rows.push(`Pages: ${s.pagesCount || ''}`);
        rows.push(`Created: ${s.createdAt || ''}`);
        rows.push('');
      });

      let y = margin;
      pdf.setFontSize(12);
      rows.forEach((line) => {
        const split = pdf.splitTextToSize(line, maxWidth);
        split.forEach((seg) => {
          if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(seg, margin, y);
          y += lineHeight;
        });
      });

      pdf.save('submissions.pdf');
      toast.success('Exported submissions.pdf');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    }
  };

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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl mb-4">User Submissions</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={refresh}>Refresh</Button>
            <Button onClick={handleExportAll}>Export PDF</Button>
          </div>
        </div>
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
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{s.pagesCount} pages</div>
                    <Button variant="ghost" onClick={() => handleDelete(id)}>Delete</Button>
                  </div>
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
