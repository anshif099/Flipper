import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveSubmission } from '@/lib/firebase';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  pagesCount: number;
};

const MetadataForm: React.FC<Props> = ({ open, onClose, onSaved, pagesCount }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to prefill from localStorage
    const saved = localStorage.getItem('flipper_user');
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setName(obj.name || '');
        setEmail(obj.email || '');
        setLocation(obj.location || '');
        setCompany(obj.company || '');
      } catch {}
    }
  }, [open]);

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!name.trim() || !email.trim() || !location.trim()) {
      toast.error('Please fill required fields');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please provide a valid email');
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      location: location.trim(),
      company: company.trim() || null,
      pagesCount,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveSubmission(payload);
      // persist locally for future prefills
      localStorage.setItem('flipper_user', JSON.stringify({ name: payload.name, email: payload.email, location: payload.location, company: payload.company }));
      toast.success('Details saved — your flipbook is ready');
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tell us about yourself</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" required />
          </div>
          <div>
            <Label>Company (optional)</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Continue to Flipbook'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataForm;
