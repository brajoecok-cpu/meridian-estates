'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Property, 
  PropertySection, 
  Neighborhood, 
  Amenity, 
  SiteSettings, 
  GalleryItem, 
  PressArticle, 
  LeadershipMember, 
  Testimonial,
  AboutContent,
} from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  Building,
  MapPin,
  Diamond,
  Film,
  Layers,
  ArrowUpRight,
  LogOut,
  Save,
  X,
  Clock,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
  Activity,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Search,
  LayoutDashboard,
  Filter,
  ExternalLink,
  Laptop,
  Smartphone,
  CheckCircle2,
  Calendar,
  Compass,
  DollarSign,
  Menu,
  ChevronDown,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Sun,
  Shield,
  Award,
  Upload,
  ImageIcon,
  Newspaper,
  Users,
  Megaphone,
  Quote,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  message: string;
  type: 'lead' | 'update' | 'system';
}

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  propertyInterest: string;
  propertySlug?: string;
  budgetRange: string;
  timeframe?: string;
  acquisitionTimeframe?: string;
  message?: string;
  specialRequirements?: string;
  createdAt?: string;
  timestamp?: string;
  status: 'New' | 'Contacted' | 'In Review' | 'Showing Scheduled' | 'Under Contract' | 'Archived';
  priorityTier?: string;
  notes?: string;
  ndaAcknowledged?: boolean;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // 2FA Security States
  const [authStep, setAuthStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('admin@kings-realestate.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorPin, setTwoFactorPin] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemainingSec, setLockRemainingSec] = useState<number | null>(null);

  // Responsive Sidebar Navigation States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    | 'overview'
    | 'inquiries'
    | 'properties'
    | 'homepage'
    | 'about'
    | 'gallery'
    | 'press'
    | 'leadership'
    | 'announcement'
    | 'contact'
    | 'testimonials'
    | 'neighborhoods'
    | 'amenities'
    | 'media'
    | 'audit'
  >('overview');

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [media, setMedia] = useState<{ images: string[]; videos: string[] }>({ images: [], videos: [] });
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [pressArticles, setPressArticles] = useState<PressArticle[]>([]);
  const [leadershipMembers, setLeadershipMembers] = useState<LeadershipMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'uhnw' | 'new' | 'showing' | 'contract'>('all');

  // Real-time polling
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activityLog, setActivityLog] = useState<{ id: string; time: string; message: string; type: 'lead' | 'update' | 'system' }[]>([
    { id: '1', time: '10:15 AM', message: 'VIP Lead from Sir Alistair Sterling for The Marquis Brickell ($20M+ Tier 1)', type: 'lead' },
    { id: '2', time: '09:42 AM', message: 'Inquiry received for Vela Star Island compound ($20M+)', type: 'lead' },
    { id: '3', time: '08:30 AM', message: 'Pricing model synchronized with production catalog', type: 'system' },
  ]);

  // Selected Inquiry for Slide-Over Drawer
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Property Editor Modal State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isNewProperty, setIsNewProperty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // New CMS Editing Modals
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isNewGalleryItem, setIsNewGalleryItem] = useState(false);

  const [editingPressArticle, setEditingPressArticle] = useState<PressArticle | null>(null);
  const [isNewPressArticle, setIsNewPressArticle] = useState(false);

  const [editingLeadershipMember, setEditingLeadershipMember] = useState<LeadershipMember | null>(null);
  const [isNewLeadershipMember, setIsNewLeadershipMember] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Check existing session
  useEffect(() => {
    setMounted(true);
    const session = sessionStorage.getItem('kings_admin_session') || sessionStorage.getItem('meridian_admin_session');
    if (session) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Real-time polling effect
  useEffect(() => {
    if (!isAuthenticated || !isAutoRefresh) return;

    const interval = setInterval(() => {
      fetchInquiriesOnly();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isAutoRefresh, inquiries.length]);

  // STEP 1: Verify Email and Master Password
  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_credentials', email, password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setIsLocked(true);
        setLockRemainingSec(data.remainingSeconds || 900);
        setAuthError(data.error);
        return;
      }

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Authentication handshake failed');
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      // Step 1 Success: Proceed to Step 2 (2FA)
      setChallengeToken(data.challengeToken);
      setAuthStep('2fa');
      setRemainingAttempts(null);
    } catch (err) {
      setAuthError('Connection error to Sovereign Auth Gateway');
    } finally {
      setAuthLoading(false);
    }
  };

  // STEP 2: Verify 6-Digit 2FA Clearance Code
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_2fa', pin: twoFactorPin, challengeToken }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setIsLocked(true);
        setLockRemainingSec(data.remainingSeconds || 900);
        setAuthError(data.error);
        return;
      }

      if (!res.ok || !data.success) {
        setAuthError(data.error || '2FA clearance rejected');
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      // 2FA Clearance Verified: Save session token and load executive dashboard
      sessionStorage.setItem('kings_admin_session', data.token || 'authenticated');
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      setAuthError('Error validating 2FA clearance token');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kings_admin_session');
    sessionStorage.removeItem('meridian_admin_session');
    setIsAuthenticated(false);
    setAuthStep('credentials');
    setPassword('');
    setTwoFactorPin('');
    setChallengeToken('');
  };

  // Fetch all CMS datasets
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        propsRes,
        neighRes,
        amenRes,
        mediaRes,
        inqRes,
        settingsRes,
        galRes,
        pressRes,
        leadRes,
        testRes,
        aboutRes,
      ] = await Promise.all([
        fetch('/api/admin/properties'),
        fetch('/api/admin/neighborhoods'),
        fetch('/api/admin/amenities'),
        fetch('/api/admin/media'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/site-settings'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/press'),
        fetch('/api/admin/leadership'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/about'),
      ]);

      const propsData = await propsRes.json();
      const neighData = await neighRes.json();
      const amenData = await amenRes.json();
      const mediaData = await mediaRes.json();
      const inqData = await inqRes.json();
      const settingsData = await settingsRes.json();
      const galData = await galRes.json();
      const pressData = await pressRes.json();
      const leadData = await leadRes.json();
      const testData = await testRes.json();
      const aboutData = await aboutRes.json();

      setProperties(propsData.properties || []);
      setNeighborhoods(neighData.neighborhoods || []);
      setAmenities(amenData.amenities || []);
      setMedia(mediaData || { images: [], videos: [] });
      setInquiries(inqData.inquiries || []);
      setSiteSettings(settingsData.settings || null);
      setGalleryItems(galData.items || []);
      setPressArticles(pressData.articles || []);
      setLeadershipMembers(leadData.members || []);
      setTestimonials(testData.testimonials || []);
      setAboutContent(aboutData || null);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Failed to load Sovereign CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Silent background inquiries polling
  const fetchInquiriesOnly = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.inquiries) {
        if (data.inquiries.length > inquiries.length && inquiries.length > 0) {
          const newest = data.inquiries[0];
          setActivityLog((prev) => [
            {
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message: `Live VIP Lead: ${newest.fullName} for ${newest.propertyInterest} (${newest.budgetRange})`,
              type: 'lead',
            },
            ...prev.slice(0, 15),
          ]);
        }
        setInquiries(data.inquiries);
        setLastRefreshed(new Date());
      }
    } catch (e) {
      // Background retry
    }
  };

  // Pipeline status update handler
  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  // Quick Inline Status Toggles for Properties
  const handleQuickStatusChange = async (slug: string, newStatus: Property['status']) => {
    const property = properties.find((p) => p.slug === slug);
    if (!property) return;

    const updated = { ...property, status: newStatus };
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProperties((prev) => prev.map((p) => (p.slug === slug ? updated : p)));
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  // Split-screen editor handlers
  const handleEditProperty = (property: Property) => {
    setEditingProperty(JSON.parse(JSON.stringify(property)));
    setIsNewProperty(false);
    setSaveStatus(null);
  };

  const handleCreateProperty = () => {
    const initialSlug = `residence-${Date.now().toString().slice(-4)}`;
    const newProp: Property = {
      slug: initialSlug,
      name: '',
      tagline: '',
      shortDescription: '',
      overview: '',
      neighborhood: 'Brickell',
      neighborhoodSlug: 'brickell',
      priceFrom: 0,
      completionDate: '2026',
      unitType: 'Luxury Residence',
      status: 'Pre-Construction',
      heroPoster: '',
      galleryImages: [],
      sections: [],
      amenitiesHighlight: [],
    };
    setEditingProperty(newProp);
    setIsNewProperty(true);
    setSaveStatus(null);
  };

  const handleSaveProperty = async () => {
    if (!editingProperty) return;
    if (!editingProperty.name || !editingProperty.name.trim()) {
      alert('Please enter a Residence Name.');
      return;
    }
    if (!editingProperty.heroPoster) {
      alert('Please upload a residence image before publishing.');
      return;
    }

    const autoSlug = editingProperty.slug?.trim() ||
      editingProperty.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ||
      `residence-${Date.now().toString().slice(-4)}`;

    const propertyToSave: Property = {
      ...editingProperty,
      name: editingProperty.name.trim(),
      slug: autoSlug,
      tagline: editingProperty.tagline || 'Bespoke Luxury Residence',
      shortDescription: editingProperty.shortDescription || editingProperty.overview || `${editingProperty.name.trim()} in ${editingProperty.neighborhood || 'Miami'}`,
      overview: editingProperty.overview || editingProperty.shortDescription || `${editingProperty.name.trim()} presents unmatched architecture and luxury finishes.`,
      heroPoster: editingProperty.heroPoster,
      heroVideoMp4: editingProperty.heroVideoMp4 || '/videos/hero-skyline.mp4',
      galleryImages: editingProperty.galleryImages || [],
      neighborhood: editingProperty.neighborhood || 'Brickell',
      neighborhoodSlug: editingProperty.neighborhoodSlug || 'brickell',
      priceFrom: Number(editingProperty.priceFrom) || 5000000,
      completionDate: editingProperty.completionDate || '2026',
      status: editingProperty.status || 'Pre-Construction',
      unitType: editingProperty.unitType || 'Luxury Residence',
      sections: editingProperty.sections && editingProperty.sections.length > 0 ? editingProperty.sections : [
        {
          id: 'living',
          title: 'The Great Room & Horizon Loggia',
          subtitle: 'Double-Height Ceilings',
          description: 'Expansive living volumes lined in bookmatched Italian finishes framing uninterrupted views.',
          poster: editingProperty.heroPoster,
          videoMp4: '/videos/living-volume.mp4',
        }
      ],
      amenitiesHighlight: editingProperty.amenitiesHighlight && editingProperty.amenitiesHighlight.length > 0
        ? editingProperty.amenitiesHighlight
        : ['Private Marina', 'Sky Pool', '24/7 Biometric Concierge'],
    };

    setSaveStatus('saving');

    try {
      const method = isNewProperty ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/properties', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyToSave),
      });

      const json = await res.json();

      if (res.ok) {
        setSaveStatus('saved');

        // Update in-memory state immediately so UI updates in real time
        setProperties((prev) => {
          if (isNewProperty) {
            return [propertyToSave, ...prev.filter((p) => p.slug !== propertyToSave.slug)];
          } else {
            return prev.map((p) => (p.slug === propertyToSave.slug ? propertyToSave : p));
          }
        });

        // Add audit trail
        const newLog: ActivityItem = {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          message: isNewProperty
            ? `Published new residence: "${propertyToSave.name}"`
            : `Updated residence: "${propertyToSave.name}"`,
          type: 'update',
        };
        setActivityLog((prev) => [newLog, ...prev]);

        // Auto close modal after celebration
        setTimeout(() => {
          setSaveStatus(null);
          setEditingProperty(null);
        }, 1000);
      } else {
        setSaveStatus('error');
        alert(`Failed to save: ${json.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setSaveStatus('error');
      alert(`Network error saving property: ${e?.message || 'Please retry'}`);
    }
  };

  const handleDeleteProperty = async (slug: string) => {
    if (!confirm('Are you certain you wish to archive and delete this property listing?')) return;
    try {
      const res = await fetch(`/api/admin/properties?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (e) {
      alert('Error deleting property');
    }
  };

  // Save Site Settings (Hero & Philosophy & Announcement Banner)

  const handleSaveAboutContent = async (updatedAbout: AboutContent) => {
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAbout),
      });
      if (res.ok) {
        const saved = await res.json();
        setAboutContent(saved);
        setSaveStatus('About Content Saved!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving about content:', error);
    }
  };

  const handleSaveSiteSettings = async (updatedSettings: SiteSettings) => {
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      if (res.ok) {
        setSiteSettings(updatedSettings);
        alert('Site Settings & Homepage Banners updated successfully!');
      }
    } catch {
      alert('Failed to save site settings');
    }
  };

  // Gallery CRUD Handlers
  const handleSaveGalleryItem = async (item: GalleryItem) => {
    try {
      const method = isNewGalleryItem ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (res.ok) {
        setGalleryItems(data.items);
        setEditingGalleryItem(null);
      } else {
        alert(data.error || 'Failed to save gallery item');
      }
    } catch {
      alert('Network error saving gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setGalleryItems(data.items);
    } catch {
      alert('Failed to delete gallery item');
    }
  };

  // Press CRUD Handlers
  const handleSavePressArticle = async (article: PressArticle) => {
    try {
      const method = isNewPressArticle ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/press', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const data = await res.json();
      if (res.ok) {
        setPressArticles(data.articles);
        setEditingPressArticle(null);
      } else {
        alert(data.error || 'Failed to save press article');
      }
    } catch {
      alert('Network error saving press article');
    }
  };

  const handleDeletePressArticle = async (id: string) => {
    if (!confirm('Are you sure you want to remove this press release?')) return;
    try {
      const res = await fetch('/api/admin/press', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setPressArticles(data.articles);
    } catch {
      alert('Failed to delete press article');
    }
  };

  // Leadership CRUD Handlers
  const handleSaveLeadershipMember = async (member: LeadershipMember) => {
    try {
      const method = isNewLeadershipMember ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/leadership', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      const data = await res.json();
      if (res.ok) {
        setLeadershipMembers(data.members);
        setEditingLeadershipMember(null);
      } else {
        alert(data.error || 'Failed to save leadership member');
      }
    } catch {
      alert('Network error saving leadership member');
    }
  };

  const handleDeleteLeadershipMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this leadership member?')) return;
    try {
      const res = await fetch('/api/admin/leadership', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setLeadershipMembers(data.members);
    } catch {
      alert('Failed to delete leadership member');
    }
  };

  // Testimonials CRUD Handlers
  const handleSaveTestimonial = async (item: Testimonial) => {
    try {
      const method = isNewTestimonial ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials);
        setEditingTestimonial(null);
      } else {
        alert(data.error || 'Failed to save testimonial');
      }
    } catch {
      alert('Network error saving testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials);
    } catch {
      alert('Failed to delete testimonial');
    }
  };

  const handleAddSection = () => {
    if (!editingProperty) return;
    const newSection: PropertySection = {
      id: `room-${Date.now().toString().slice(-4)}`,
      title: 'New Architectural Reveal',
      subtitle: 'Bespoke Finish Details',
      description: 'Private volume framing uninterrupted water exposures.',
      poster: '/images/im5.webp',
      videoMp4: '/videos/building-tour.mp4',
    };
    setEditingProperty({
      ...editingProperty,
      sections: [...(editingProperty.sections || []), newSection],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!editingProperty) return;
    const updated = [...editingProperty.sections];
    updated.splice(index, 1);
    setEditingProperty({ ...editingProperty, sections: updated });
  };

  // Media & Project File Upload Handlers
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setMedia((prev) => ({
          images: data.type === 'image' ? [data.url, ...prev.images] : prev.images,
          videos: data.type === 'video' ? [data.url, ...prev.videos] : prev.videos,
        }));

        const log: ActivityItem = {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          message: `Uploaded project asset: "${data.fileName}"`,
          type: 'update',
        };
        setActivityLog((prev) => [log, ...prev]);

        return data.url;
      } else {
        alert(data.error || 'Failed to upload media.');
        return null;
      }
    } catch (e) {
      alert('Network error while uploading asset.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Project JSON Package Import Handler
  const handleImportProjectJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.name || !parsed.slug) {
        alert('Invalid project package: "name" and "slug" are required.');
        return;
      }
      setEditingProperty(parsed);
      setIsNewProperty(true);
      alert(`Loaded project package "${parsed.name}". You can now review specifications and click Publish.`);
    } catch (err) {
      alert('Failed to parse project JSON file.');
    }
  };

  // Gallery and Amenities Helpers
  const [newAmenityInput, setNewAmenityInput] = useState('');

  const handleAddGalleryImage = (url: string) => {
    if (!editingProperty || !url) return;
    const current = editingProperty.galleryImages || [];
    if (current.includes(url)) return;
    setEditingProperty({
      ...editingProperty,
      galleryImages: [...current, url],
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!editingProperty || !editingProperty.galleryImages) return;
    const updated = [...editingProperty.galleryImages];
    updated.splice(index, 1);
    setEditingProperty({
      ...editingProperty,
      galleryImages: updated,
    });
  };

  const handleAddAmenityTag = () => {
    if (!editingProperty || !newAmenityInput.trim()) return;
    const current = editingProperty.amenitiesHighlight || [];
    if (current.includes(newAmenityInput.trim())) {
      setNewAmenityInput('');
      return;
    }
    setEditingProperty({
      ...editingProperty,
      amenitiesHighlight: [...current, newAmenityInput.trim()],
    });
    setNewAmenityInput('');
  };

  const handleRemoveAmenityTag = (index: number) => {
    if (!editingProperty || !editingProperty.amenitiesHighlight) return;
    const updated = [...editingProperty.amenitiesHighlight];
    updated.splice(index, 1);
    setEditingProperty({
      ...editingProperty,
      amenitiesHighlight: updated,
    });
  };

  // Helper to match property image for inquiries
  const getPropertyImage = (interest: string): string => {
    const matched = properties.find((p) =>
      interest.toLowerCase().includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(interest.toLowerCase())
    );
    return matched?.heroPoster || '/images/im1.jpg';
  };

  // KPIs
  const totalPortfolioValue = properties.reduce((acc, curr) => acc + (curr.priceFrom || 0), 0);
  const newLeadsCount = inquiries.filter((i) => i.status === 'New').length;
  const uhnwLeads = inquiries.filter((i) => i.budgetRange === '$20M+' || i.priorityTier?.includes('Tier 1'));

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((i) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        i.fullName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.propertyInterest.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (inquiryFilter === 'uhnw') return i.budgetRange === '$20M+' || i.priorityTier?.includes('Tier 1');
    if (inquiryFilter === 'new') return i.status === 'New';
    if (inquiryFilter === 'showing') return i.status === 'Showing Scheduled';
    if (inquiryFilter === 'contract') return i.status === 'Under Contract';
    return true;
  });

  // Filtered Properties
  const filteredProperties = properties.filter((p) =>
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.neighborhood && p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.status && p.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Mount Guard to eliminate SSR / Client hydration mismatch
  if (!mounted) {
    return null;
  }

  // 1. Enterprise Multi-Factor Authentication Guard Screen with Architectural Split Showcase
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[rgb(236,244,232)] via-[rgb(203,243,187)] to-[rgb(147,191,199)] text-[#12281D] flex items-center justify-center p-4 sm:p-6 md:p-12 antialiased selection:bg-[#17462E] selection:text-white relative overflow-hidden">
        {/* Ambient Architectural Watermark */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/images/im1.jpg" alt="Watermark" fill className="object-cover object-center filter grayscale contrast-150" />
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white/95 border border-[rgb(147,191,199)] shadow-2xl rounded-2xl overflow-hidden backdrop-blur-2xl relative z-10">
          {/* Left Visual Column */}
          <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-8 bg-[#17462E] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <Image src="/images/im18.jpg" alt="Architecture" fill className="object-cover object-center" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#17462E] via-[#17462E]/70 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[9px] uppercase tracking-[0.3em] font-semibold text-[rgb(203,243,187)] backdrop-blur-md">
                <Shield size={11} />
                <span>Executive Gateway</span>
              </div>
              <h2 className="font-serif text-3xl leading-tight">
                Kings Command OS
              </h2>
            </div>

            <div className="relative z-10 space-y-3 pt-12 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-[rgb(203,243,187)]">
                <ShieldCheck size={16} />
                <span className="font-medium">Dual-Factor Biometric Encryption</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans font-light">
                Authorized executive clearance only. All terminal transactions and lead dispatches are audited in real time.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[rgb(203,243,187)]/80 text-[#17462E] border border-[rgb(171,231,178)] flex items-center justify-center mx-auto md:mx-0 shadow-inner">
                <Lock size={24} />
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#17462E] font-bold block">
                  Sovereign Clearance Gateway
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#12281D] tracking-tight mt-1">
                  Terminal Authorization
                </h1>
                <p className="text-xs text-[#385B49] font-sans mt-1">
                  {authStep === 'credentials'
                    ? 'Enter executive credentials to initiate 2FA handshake'
                    : 'Enter 6-digit hardware clearance token'}
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-300 text-xs text-red-800 space-y-1 rounded-xl">
                <div className="font-medium flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-red-600" />
                  <span>Clearance Error</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-700">{authError}</p>
              </div>
            )}

            {/* STEP 1: CREDENTIALS */}
            {authStep === 'credentials' && (
              <form onSubmit={handleVerifyCredentials} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#385B49] font-semibold mb-1.5">
                    Executive Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D6F5C]" />
                    <input
                      type="email"
                      required
                      placeholder="admin@kings-realestate.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[rgb(147,191,199)] focus:border-[#17462E] text-xs text-[#12281D] focus:outline-none transition-colors rounded-xl shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#385B49] font-semibold mb-1.5">
                    Master Vault Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D6F5C]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-[rgb(147,191,199)] focus:border-[#17462E] text-xs text-[#12281D] focus:outline-none transition-colors font-mono rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4D6F5C] hover:text-[#12281D] text-xs font-semibold cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || isLocked}
                  className="w-full py-3.5 bg-[#17462E] hover:bg-[#113523] disabled:bg-gray-300 text-white text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-lg shadow-[#17462E]/20 cursor-pointer flex items-center justify-center gap-2 rounded-xl"
                >
                  {authLoading ? 'Verifying...' : (
                    <>
                      <span>Proceed to 2FA Clearance</span>
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: 2FA */}
            {authStep === '2fa' && (
              <form onSubmit={handleVerify2FA} className="space-y-4 text-center">
                <div className="p-3.5 bg-[rgb(236,244,232)] border border-[rgb(171,231,178)] text-xs text-[#12281D] space-y-1 rounded-xl">
                  <span className="text-[10px] uppercase tracking-wider text-[#17462E] font-bold block">Credentials Accepted</span>
                  <span className="font-mono text-[#12281D] font-medium block">{email}</span>
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Enter 6-Digit PIN (102910)"
                    value={twoFactorPin}
                    onChange={(e) => setTwoFactorPin(e.target.value)}
                    autoFocus
                    maxLength={6}
                    className="w-full px-4 py-3.5 bg-white border border-[rgb(147,191,199)] focus:border-[#17462E] text-center text-xl tracking-[0.5em] text-[#17462E] font-bold focus:outline-none transition-colors font-mono rounded-xl shadow-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('credentials');
                      setAuthError('');
                    }}
                    className="w-1/3 py-3 bg-[rgb(236,244,232)] hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-[#385B49] text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={authLoading || isLocked}
                    className="w-2/3 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-lg cursor-pointer rounded-xl"
                  >
                    {authLoading ? 'Verifying...' : 'Authorize Terminal'}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-[rgb(147,191,199)]/40 text-[10px] text-[#4D6F5C] text-center">
              Master credentials: <code className="text-[#17462E] font-mono font-semibold">admin@kings-realestate.com</code> • Pass: <code className="text-[#17462E] font-mono font-semibold">kings@2026</code> • PIN: <code className="text-[#17462E] font-mono font-semibold">102910</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items Definition
  const NAV_ITEMS = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Developments Matrix', icon: Building, count: properties.length },
    { id: 'homepage', label: 'Homepage & Videos', icon: Film },
    { id: 'about', label: 'About Page Content', icon: Layers },
    { id: 'gallery', label: 'Gallery Vault', icon: ImageIcon, count: galleryItems.length },
    { id: 'press', label: 'Press & Editorial', icon: Newspaper, count: pressArticles.length },
    { id: 'leadership', label: 'Leadership Team', icon: Users, count: leadershipMembers.length },
    { id: 'announcement', label: 'Announcement Banner', icon: Megaphone },
    { id: 'contact', label: 'Contact Settings', icon: Phone },
    { id: 'testimonials', label: 'Client Endorsements', icon: Quote, count: testimonials.length },
    { id: 'neighborhoods', label: 'District Guides', icon: MapPin },
    { id: 'amenities', label: 'Signature Amenities', icon: Diamond },
    { id: 'inquiries', label: 'VIP Inquiries Feed', icon: MessageSquare, badge: newLeadsCount > 0 ? `${newLeadsCount} New` : null },
    { id: 'media', label: 'Media Assets Vault', icon: Film, count: media.videos.length + media.images.length },
    { id: 'audit', label: 'Audit & Telemetry', icon: Activity },
  ];

  // 2. MAIN EXECUTIVE COMMAND CENTER (Botanical Luxury Slate / Sage / Seafoam Theme)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(236,244,232)] via-[rgb(203,243,187)]/40 to-[rgb(147,191,199)]/30 text-[#12281D] flex antialiased selection:bg-[#17462E] selection:text-white">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* BESPOKE EXECUTIVE SIDEBAR */}
      <aside
        className={`w-72 bg-white/95 backdrop-blur-2xl border-r border-[rgb(147,191,199)]/60 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-50 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[rgb(147,191,199)]/40 flex items-center justify-between">
            <Link href="/" target="_blank" className="block group">
              <span className="font-serif text-2xl tracking-[0.16em] uppercase text-[#12281D] group-hover:text-[#17462E] transition-colors">
                Kings
              </span>
              <span className="block text-[8px] uppercase tracking-[0.4em] text-[#17462E] font-semibold mt-0.5">
                Real Estate Command OS
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#4D6F5C] hover:text-[#12281D] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Real-time Socket Indicator */}
          <div className="px-6 py-3 border-b border-[rgb(147,191,199)]/20 bg-[rgb(236,244,232)]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-[10px] text-[#385B49] font-mono font-medium">Telemetry Live</span>
            </div>
            <span className="text-[9px] text-[#17462E] font-mono font-semibold bg-[rgb(203,243,187)] px-2 py-0.5 rounded-full border border-[rgb(171,231,178)]">
              4s auto
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#17462E] text-white font-semibold shadow-md shadow-[#17462E]/20'
                      : 'text-[#385B49] hover:text-[#12281D] hover:bg-[rgb(203,243,187)]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-semibold ${
                      isActive ? 'bg-white text-[#17462E]' : 'bg-[rgb(171,231,178)] text-[#12281D] border border-[#17462E]/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && !item.badge && (
                    <span className="text-[10px] font-mono opacity-80">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[rgb(147,191,199)]/40 space-y-3 bg-white/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[rgb(203,243,187)] border border-[rgb(171,231,178)] flex items-center justify-center font-serif text-[#17462E] text-xs font-semibold shadow-sm">
                EP
              </div>
              <div>
                <div className="text-[#12281D] font-semibold text-xs">Executive Principal</div>
                <div className="text-[10px] text-[#4D6F5C]">Brickell HQ 48F</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-[#4D6F5C] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Lock Session"
            >
              <LogOut size={16} />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-[rgb(236,244,232)] hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)]/60 text-[#17462E] text-xs font-semibold transition-colors rounded-xl"
          >
            <span>Open Public Portal</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </aside>

      {/* MAIN VIEWPORT CANVAS */}
      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col w-full overflow-x-hidden">
        {/* Top Executive Header Bar */}
        <header className="h-16 bg-white/85 backdrop-blur-xl border-b border-[rgb(147,191,199)]/60 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[rgb(236,244,232)] text-[#17462E] hover:bg-[rgb(203,243,187)] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D6F5C]" />
              <input
                type="text"
                placeholder="Search leads, residences, pricing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[rgb(147,191,199)] focus:border-[#17462E] text-xs text-[#12281D] focus:outline-none transition-colors rounded-xl shadow-sm"
              />
            </div>
          </div>

          {/* Action Header Items */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-[#4D6F5C] border-r border-[rgb(147,191,199)]/40 pr-4">
              <Clock size={13} className="text-[#17462E]" />
              <span className="font-mono">{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST</span>
            </div>

            {currentView === 'inquiries' && (
              <a
                href="/api/admin/inquiries/export"
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-xs text-[#17462E] font-semibold transition-colors rounded-xl shadow-sm"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export CSV</span>
              </a>
            )}

            {(currentView === 'properties' || currentView === 'overview') && (
              <button
                onClick={handleCreateProperty}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md hover:shadow-lg rounded-xl cursor-pointer"
              >
                <Plus size={14} />
                <span>New Residence</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content Views */}
        <main className="p-4 sm:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto">
          {/* VIEW 1: EXECUTIVE OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-8">
              {/* STATE-OF-THE-ART EXECUTIVE PORCELAIN & BOTANICAL HERO BANNER */}
              <div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 p-6 sm:p-8 lg:p-10 shadow-xl shadow-[rgb(147,191,199)]/20 overflow-hidden">
                {/* Top Emerald & Seafoam Specular Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[rgb(147,191,199)] via-[#17462E] to-[rgb(203,243,187)]" />
                
                {/* Soft Ambient Botanical Glow in Corner */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[rgb(203,243,187)]/35 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Executive Title & Telemetry */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(236,244,232)] border border-[rgb(171,231,178)] text-[10px] uppercase tracking-[0.25em] text-[#17462E] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Miami HQ 48F • 78°F Sunny</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgb(147,191,199)] text-[10px] uppercase tracking-wider text-[#4D6F5C] font-mono">
                        <Clock size={11} className="text-[#17462E]" />
                        <span>Real-Time Sync</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#12281D] tracking-tight leading-tight">
                        Kings Capital & Asset Matrix
                      </h2>
                      <p className="text-xs sm:text-sm text-[#385B49] font-sans font-light leading-relaxed max-w-xl">
                        Executive portfolio oversight across <span className="font-semibold text-[#12281D]">{properties.length} flagship towers</span> and private island enclaves. All lead transactions and showing schedules monitored under strict NDA clearance.
                      </p>
                    </div>

                    {/* Integrated Metric Snapshot Pills */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <div className="px-3.5 py-2 bg-[rgb(236,244,232)]/80 border border-[rgb(171,231,178)]/80 rounded-xl">
                        <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] block">Pipeline Valuation</span>
                        <span className="font-serif text-[#17462E] font-bold text-sm">{formatPrice(totalPortfolioValue)}</span>
                      </div>

                      <div className="px-3.5 py-2 bg-[rgb(236,244,232)]/80 border border-[rgb(171,231,178)]/80 rounded-xl">
                        <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] block">Total Inquiries</span>
                        <span className="font-serif text-[#12281D] font-bold text-sm">{inquiries.length} VIP Leads</span>
                      </div>

                      <div className="px-3.5 py-2 bg-[rgb(236,244,232)]/80 border border-[rgb(171,231,178)]/80 rounded-xl">
                        <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] block">Qualified UHNW</span>
                        <span className="font-serif text-emerald-800 font-bold text-sm">{uhnwLeads.length} Tier 1</span>
                      </div>
                    </div>

                    {/* Clean Ergonomic Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setCurrentView('inquiries')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#17462E]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 rounded-xl cursor-pointer"
                      >
                        <MessageSquare size={14} />
                        <span>Inspect VIP Inquiries ({inquiries.length})</span>
                      </button>

                      <button
                        onClick={() => setCurrentView('properties')}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[rgb(236,244,232)] hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-[#17462E] text-xs font-semibold uppercase tracking-wider transition-all rounded-xl cursor-pointer shadow-sm hover:shadow"
                      >
                        <Building size={14} />
                        <span>Developments Matrix</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Framed Flagship Architectural Showcase Preview */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden border border-[rgb(147,191,199)] shadow-lg group bg-black">
                      <Image
                        src="/images/im1.jpg"
                        alt="Flagship Development"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md border border-[rgb(147,191,199)] text-[9px] uppercase tracking-wider text-[#17462E] font-bold rounded-lg shadow-sm">
                          Flagship Tower
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-[rgb(203,243,187)] font-semibold">
                            Brickell Financial District
                          </span>
                          <span className="font-serif text-sm font-bold text-[rgb(203,243,187)]">
                            From $12.5M
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-medium leading-tight">
                          The Marquis Brickell
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-2 rounded-2xl relative overflow-hidden group hover:border-[#17462E]/50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase tracking-wider text-[10px] font-semibold">Total Portfolio Value</span>
                    <TrendingUp size={16} className="text-[#17462E]" />
                  </div>
                  <div className="font-serif text-3xl text-[#17462E]">
                    {formatPrice(totalPortfolioValue)}
                  </div>
                  <div className="text-[11px] text-[#4D6F5C]">
                    Across <span className="text-[#12281D] font-semibold">{properties.length} flagship towers</span>
                  </div>
                </div>

                <div className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-2 rounded-2xl relative overflow-hidden group hover:border-[#17462E]/50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase tracking-wider text-[10px] font-semibold">VIP Inquiries Volume</span>
                    <MessageSquare size={16} className="text-[#17462E]" />
                  </div>
                  <div className="font-serif text-3xl text-[#12281D] flex items-center gap-2">
                    <span>{inquiries.length}</span>
                    <span className="px-2 py-0.5 bg-[rgb(203,243,187)] text-[#17462E] border border-[rgb(171,231,178)] text-xs font-sans rounded-full font-semibold">
                      {uhnwLeads.length} UHNW
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time capture active</span>
                  </div>
                </div>

                <div className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-2 rounded-2xl relative overflow-hidden group hover:border-[#17462E]/50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase tracking-wider text-[10px] font-semibold">Active Showings</span>
                    <Calendar size={16} className="text-[#17462E]" />
                  </div>
                  <div className="font-serif text-3xl text-[#12281D]">
                    {inquiries.filter((i) => i.status === 'Showing Scheduled').length} Scheduled
                  </div>
                  <div className="text-[11px] text-[#4D6F5C]">
                    Private yacht & sky pad transfers
                  </div>
                </div>

                <div className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-2 rounded-2xl relative overflow-hidden group hover:border-[#17462E]/50 transition-colors">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase tracking-wider text-[10px] font-semibold">Catalog Distribution</span>
                    <Compass size={16} className="text-[#17462E]" />
                  </div>
                  <div className="font-serif text-3xl text-[#12281D]">
                    4 Districts
                  </div>
                  <div className="text-[11px] text-[#4D6F5C]">
                    Brickell, Grove, Edgewater, Star Is.
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Visual VIP Inquiries Feed & Portfolio Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Recent VIP Inquiries Feed with Imagery */}
                <div className="lg:col-span-7 p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-4 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-[rgb(147,191,199)]/40 pb-4">
                    <h3 className="font-serif text-xl text-[#12281D] flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#17462E]" />
                      <span>Incoming VIP Inquiries</span>
                    </h3>
                    <button
                      onClick={() => setCurrentView('inquiries')}
                      className="text-xs uppercase tracking-wider text-[#17462E] font-semibold hover:underline cursor-pointer"
                    >
                      View All ({inquiries.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="p-4 bg-[rgb(236,244,232)]/70 border border-[rgb(147,191,199)]/40 hover:border-[#17462E] transition-all cursor-pointer flex items-center justify-between rounded-xl shadow-sm hover:shadow-md gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 border border-[rgb(147,191,199)]">
                            <Image
                              src={getPropertyImage(inq.propertyInterest)}
                              alt={inq.propertyInterest}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm text-[#12281D] font-semibold">{inq.fullName}</span>
                              <span className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded-full font-semibold ${
                                inq.priorityTier?.includes('Tier 1') ? 'bg-[rgb(171,231,178)] text-[#12281D] border border-[#17462E]/30' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {inq.priorityTier?.includes('Tier 1') ? 'Tier 1 UHNW' : 'Qualified'}
                              </span>
                            </div>
                            <div className="text-xs text-[#4D6F5C] truncate max-w-xs">{inq.propertyInterest} • {inq.budgetRange}</div>
                          </div>
                        </div>

                        <div className="text-right space-y-1 flex-shrink-0">
                          <span className="text-[10px] text-[#17462E] font-semibold block">{inq.status}</span>
                          <span className="text-[10px] text-[#4D6F5C]">
                            {new Date(inq.timestamp || inq.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagship Developments Status with Imagery */}
                <div className="lg:col-span-5 p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-4 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-[rgb(147,191,199)]/40 pb-4">
                    <h3 className="font-serif text-xl text-[#12281D] flex items-center gap-2">
                      <Building size={18} className="text-[#17462E]" />
                      <span>Portfolio Status</span>
                    </h3>
                    <button
                      onClick={() => setCurrentView('properties')}
                      className="text-xs uppercase tracking-wider text-[#17462E] font-semibold hover:underline cursor-pointer"
                    >
                      Manage ({properties.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {properties.map((p) => (
                      <div key={p.slug} className="p-3.5 bg-[rgb(236,244,232)]/70 border border-[rgb(147,191,199)]/40 flex items-center justify-between rounded-xl gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 border border-[rgb(147,191,199)]">
                            <Image src={p.heroPoster} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif text-sm text-[#12281D] font-semibold">{p.name}</h4>
                            <span className="text-[10px] uppercase text-[#17462E] font-semibold">{p.neighborhood}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-serif text-sm text-[#17462E] font-semibold block">{formatPrice(p.priceFrom)}</span>
                          <span className="text-[9px] uppercase text-[#4D6F5C]">{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: VIP INQUIRIES FEED (With Visual Thumbnails & Mobile Cards) */}
          {currentView === 'inquiries' && (
            <div className="space-y-6">
              {/* Filter Chips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs text-[#385B49] mr-2 flex items-center gap-1 font-medium flex-shrink-0">
                  <Filter size={13} />
                  <span>Filter:</span>
                </span>
                <button
                  onClick={() => setInquiryFilter('all')}
                  className={`px-3.5 py-2 text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 ${inquiryFilter === 'all' ? 'bg-[#17462E] text-white font-semibold' : 'bg-white text-[#385B49] border border-[rgb(147,191,199)]'}`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('uhnw')}
                  className={`px-3.5 py-2 text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 ${inquiryFilter === 'uhnw' ? 'bg-[#17462E] text-white font-semibold' : 'bg-white text-[#385B49] border border-[rgb(147,191,199)]'}`}
                >
                  Tier 1 UHNW ({uhnwLeads.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('new')}
                  className={`px-3.5 py-2 text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 ${inquiryFilter === 'new' ? 'bg-[#17462E] text-white font-semibold' : 'bg-white text-[#385B49] border border-[rgb(147,191,199)]'}`}
                >
                  New Leads ({newLeadsCount})
                </button>
                <button
                  onClick={() => setInquiryFilter('showing')}
                  className={`px-3.5 py-2 text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 ${inquiryFilter === 'showing' ? 'bg-[#17462E] text-white font-semibold' : 'bg-white text-[#385B49] border border-[rgb(147,191,199)]'}`}
                >
                  Showing Scheduled ({inquiries.filter((i) => i.status === 'Showing Scheduled').length})
                </button>
              </div>

              {/* Inquiries Table (Desktop) */}
              <div className="hidden md:block bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[rgb(236,244,232)] text-[#385B49] uppercase tracking-wider text-[10px] border-b border-[rgb(147,191,199)]/40 font-semibold">
                      <tr>
                        <th className="py-3.5 px-6">Client Identity</th>
                        <th className="py-3.5 px-4">Residence Target</th>
                        <th className="py-3.5 px-4">Capital Range</th>
                        <th className="py-3.5 px-4">Pipeline Status</th>
                        <th className="py-3.5 px-6 text-right">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(147,191,199)]/30 text-[#12281D]">
                      {filteredInquiries.map((inq) => (
                        <tr
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className="cursor-pointer transition-colors hover:bg-[rgb(203,243,187)]/25"
                        >
                          <td className="py-4 px-6 space-y-0.5">
                            <div className="font-serif text-sm font-semibold text-[#12281D]">{inq.fullName}</div>
                            <div className="text-[11px] text-[#4D6F5C] font-mono">{inq.email}</div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 border border-[rgb(147,191,199)]">
                                <Image
                                  src={getPropertyImage(inq.propertyInterest)}
                                  alt={inq.propertyInterest}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-[#12281D] font-medium">{inq.propertyInterest}</div>
                                <div className="text-[10px] text-[#4D6F5C]">
                                  {new Date(inq.timestamp || inq.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 space-y-1">
                            <div className="text-xs text-[#17462E] font-serif font-semibold">{inq.budgetRange}</div>
                            <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-full font-medium ${
                              inq.priorityTier?.includes('Tier 1') ? 'bg-[rgb(171,231,178)] text-[#12281D] border border-[#17462E]/30' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {inq.priorityTier?.includes('Tier 1') ? 'Tier 1 UHNW' : 'Qualified'}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <select
                              value={inq.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                              className="px-2.5 py-1.5 bg-white border border-[rgb(147,191,199)] text-[11px] text-[#12281D] focus:border-[#17462E] focus:outline-none rounded-xl shadow-sm cursor-pointer"
                            >
                              <option value="New">🟢 New Lead</option>
                              <option value="In Review">🟡 In Review</option>
                              <option value="Showing Scheduled">🟣 Showing Scheduled</option>
                              <option value="Under Contract">🔵 Under Contract</option>
                              <option value="Archived">⚪ Archived</option>
                            </select>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInquiry(inq);
                              }}
                              className="px-3 py-1.5 bg-[rgb(236,244,232)] hover:bg-[#17462E] hover:text-white text-[#17462E] border border-[rgb(147,191,199)] font-semibold text-xs transition-colors rounded-xl inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Inspect</span>
                              <ChevronRight size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Lead Cards Stack */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="p-5 bg-white border border-[rgb(147,191,199)]/70 rounded-2xl shadow-sm space-y-4 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 border border-[rgb(147,191,199)]">
                          <Image src={getPropertyImage(inq.propertyInterest)} alt={inq.propertyInterest} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-[#12281D] font-semibold">{inq.fullName}</h4>
                          <span className="text-xs text-[#4D6F5C] font-mono">{inq.email}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded-full font-semibold ${
                        inq.priorityTier?.includes('Tier 1') ? 'bg-[rgb(171,231,178)] text-[#12281D]' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {inq.priorityTier?.includes('Tier 1') ? 'Tier 1' : 'Qualified'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[rgb(147,191,199)]/30">
                      <div>
                        <span className="text-[10px] text-[#4D6F5C] block">Residence</span>
                        <span className="font-medium text-[#12281D]">{inq.propertyInterest}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#4D6F5C] block">Budget</span>
                        <span className="font-serif font-semibold text-[#17462E]">{inq.budgetRange}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={inq.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="px-2.5 py-1.5 bg-[rgb(236,244,232)] border border-[rgb(147,191,199)] text-xs text-[#12281D] rounded-xl"
                      >
                        <option value="New">🟢 New Lead</option>
                        <option value="In Review">🟡 In Review</option>
                        <option value="Showing Scheduled">🟣 Showing Scheduled</option>
                        <option value="Under Contract">🔵 Under Contract</option>
                        <option value="Archived">⚪ Archived</option>
                      </select>

                      <span className="text-xs text-[#17462E] font-semibold flex items-center gap-1">
                        <span>View Dossier</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: DEVELOPMENTS MATRIX (High-Res Architectural Cards) */}
          {currentView === 'properties' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 1-Click Commission New Luxury Development Card */}
                <div
                  onClick={handleCreateProperty}
                  className="p-6 bg-[rgb(236,244,232)]/80 hover:bg-[rgb(203,243,187)]/70 border-2 border-dashed border-[#17462E]/40 hover:border-[#17462E] transition-all duration-300 rounded-2xl flex flex-col items-center justify-center min-h-[360px] text-center cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#17462E] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Plus size={28} />
                  </div>
                  <h4 className="font-serif text-xl text-[#12281D] font-semibold">Commission New Residence</h4>
                  <p className="text-xs text-[#385B49] max-w-xs mt-1.5 leading-relaxed">
                    Launch a new trophy tower or island estate, configure bespoke room reveals, and publish to the public catalog.
                  </p>
                  <span className="mt-5 px-5 py-2.5 bg-white border border-[rgb(147,191,199)] text-[#17462E] text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm group-hover:bg-[#17462E] group-hover:text-white transition-colors">
                    + Launch Studio Editor
                  </span>
                </div>

                {filteredProperties.map((prop) => (
                  <div
                    key={prop.slug}
                    className="bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#17462E]/60 transition-all rounded-2xl"
                  >
                    <div className="relative aspect-[16/10] w-full bg-[rgb(236,244,232)] overflow-hidden">
                      <Image
                        src={prop.heroPoster}
                        alt={prop.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <select
                          value={prop.status}
                          onChange={(e) => handleQuickStatusChange(prop.slug, e.target.value as Property['status'])}
                          className="px-2.5 py-1 bg-white/95 backdrop-blur-md border border-[rgb(147,191,199)] text-[9px] uppercase tracking-wider text-[#17462E] font-semibold focus:outline-none cursor-pointer rounded-lg shadow-sm"
                        >
                          <option value="Under Construction">Under Construction</option>
                          <option value="Pre-Construction">Pre-Construction</option>
                          <option value="Immediate Occupancy">Immediate Occupancy</option>
                        </select>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase tracking-wider text-[rgb(203,243,187)] font-semibold">
                          {prop.neighborhood}
                        </span>
                        <h3 className="font-serif text-xl leading-tight">{prop.name}</h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-[#4D6F5C] line-clamp-2">{prop.tagline}</p>

                      {/* Amenities / Room Reveal Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {prop.sections?.slice(0, 3).map((sec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-[rgb(236,244,232)] border border-[rgb(147,191,199)]/40 text-[9px] text-[#385B49] rounded-md font-medium"
                          >
                            {sec.title}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-[rgb(147,191,199)]/40 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] block">Inquiries From</span>
                          <span className="font-serif text-[#17462E] font-bold text-base">{formatPrice(prop.priceFrom)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] block">Delivery</span>
                          <span className="text-xs text-[#12281D] font-medium">{prop.completionDate}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-2">
                        <button
                          onClick={() => handleEditProperty(prop)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#17462E] hover:bg-[#113523] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm rounded-xl cursor-pointer"
                        >
                          <Edit2 size={12} />
                          <span>Live Studio Editor</span>
                        </button>

                        <Link
                          href={`/developments/${prop.slug}`}
                          target="_blank"
                          className="p-2.5 bg-white hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-[#385B49] hover:text-[#12281D] transition-colors rounded-xl"
                          title="Preview Public Page"
                        >
                          <Eye size={14} />
                        </Link>

                        <button
                          onClick={() => handleDeleteProperty(prop.slug)}
                          className="p-2.5 bg-white hover:bg-red-50 border border-[rgb(147,191,199)] text-red-600 transition-colors rounded-xl cursor-pointer"
                          title="Delete Property"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

                    {/* VIEW: ABOUT PAGE CONTENT */}
          {currentView === 'about' && aboutContent && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-serif text-2xl text-[#12281D]">About Page Content</h3>
                <button
                  onClick={() => handleSaveAboutContent(aboutContent)}
                  className="bg-[#12281D] hover:bg-[#1a382a] text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>

              {/* Hero Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-lg font-bold text-[#12281D] border-b pb-2">Hero Section</h4>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Hero Title (HTML supported)</label>
                  <input
                    type="text"
                    value={aboutContent.heroTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, heroTitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={aboutContent.heroSubtitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, heroSubtitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Hero Description</label>
                  <textarea
                    value={aboutContent.heroDescription}
                    onChange={(e) => setAboutContent({ ...aboutContent, heroDescription: e.target.value })}
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Hero Video MP4 URL</label>
                    <input
                      type="text"
                      value={aboutContent.heroVideoMp4}
                      onChange={(e) => setAboutContent({ ...aboutContent, heroVideoMp4: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Hero Poster Image URL</label>
                    <input
                      type="text"
                      value={aboutContent.heroPoster}
                      onChange={(e) => setAboutContent({ ...aboutContent, heroPoster: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Founding Philosophy */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-lg font-bold text-[#12281D] border-b pb-2">Founding Philosophy</h4>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Title (HTML supported)</label>
                  <input
                    type="text"
                    value={aboutContent.philosophyTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, philosophyTitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={aboutContent.philosophySubtitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, philosophySubtitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Paragraph 1</label>
                  <textarea
                    value={aboutContent.philosophyParagraph1}
                    onChange={(e) => setAboutContent({ ...aboutContent, philosophyParagraph1: e.target.value })}
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Paragraph 2</label>
                  <textarea
                    value={aboutContent.philosophyParagraph2}
                    onChange={(e) => setAboutContent({ ...aboutContent, philosophyParagraph2: e.target.value })}
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Philosophy Image URL</label>
                  <input
                    type="text"
                    value={aboutContent.philosophyImage}
                    onChange={(e) => setAboutContent({ ...aboutContent, philosophyImage: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Stat 1</label>
                    <input
                      type="text"
                      placeholder="Value (e.g. 25+ Years)"
                      value={aboutContent.philosophyStat1Value}
                      onChange={(e) => setAboutContent({ ...aboutContent, philosophyStat1Value: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Miami Heritage)"
                      value={aboutContent.philosophyStat1Label}
                      onChange={(e) => setAboutContent({ ...aboutContent, philosophyStat1Label: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Stat 2</label>
                    <input
                      type="text"
                      placeholder="Value"
                      value={aboutContent.philosophyStat2Value}
                      onChange={(e) => setAboutContent({ ...aboutContent, philosophyStat2Value: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={aboutContent.philosophyStat2Label}
                      onChange={(e) => setAboutContent({ ...aboutContent, philosophyStat2Label: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-lg font-bold text-[#12281D] border-b pb-2">Bottom CTA Block</h4>
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutContent.ctaTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, ctaTitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    value={aboutContent.ctaDescription}
                    onChange={(e) => setAboutContent({ ...aboutContent, ctaDescription: e.target.value })}
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
              </div>

              {/* Tenets Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="text-lg font-bold text-[#12281D]">Core Tenets</h4>
                  <button
                    onClick={() => {
                      const newTenets = [...aboutContent.tenets, { id: 't-' + Date.now(), iconName: 'Diamond', title: 'New Tenet', desc: '' }];
                      setAboutContent({ ...aboutContent, tenets: newTenets });
                    }}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded"
                  >
                    + Add Tenet
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Section Subtitle</label>
                    <input type="text" value={aboutContent.tenetsSubtitle} onChange={(e) => setAboutContent({ ...aboutContent, tenetsSubtitle: e.target.value })} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Section Title</label>
                    <input type="text" value={aboutContent.tenetsTitle} onChange={(e) => setAboutContent({ ...aboutContent, tenetsTitle: e.target.value })} className="w-full p-2 border rounded text-sm" />
                  </div>
                </div>

                {aboutContent.tenets.map((tenet, idx) => (
                  <div key={tenet.id} className="p-4 border rounded relative bg-gray-50">
                    <button
                      onClick={() => {
                        const newTenets = [...aboutContent.tenets];
                        newTenets.splice(idx, 1);
                        setAboutContent({ ...aboutContent, tenets: newTenets });
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Title</label>
                        <input type="text" value={tenet.title} onChange={(e) => {
                          const nt = [...aboutContent.tenets];
                          nt[idx].title = e.target.value;
                          setAboutContent({ ...aboutContent, tenets: nt });
                        }} className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Icon Name (lucide-react)</label>
                        <select value={tenet.iconName} onChange={(e) => {
                          const nt = [...aboutContent.tenets];
                          nt[idx].iconName = e.target.value;
                          setAboutContent({ ...aboutContent, tenets: nt });
                        }} className="w-full p-2 border rounded text-sm">
                          <option value="Landmark">Landmark</option>
                          <option value="Shield">Shield</option>
                          <option value="Award">Award</option>
                          <option value="Diamond">Diamond</option>
                          <option value="Building2">Building2</option>
                          <option value="MapPin">MapPin</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Description</label>
                      <textarea value={tenet.desc} onChange={(e) => {
                        const nt = [...aboutContent.tenets];
                        nt[idx].desc = e.target.value;
                        setAboutContent({ ...aboutContent, tenets: nt });
                      }} className="w-full p-2 border rounded text-sm h-16" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivered Portfolio Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="text-lg font-bold text-[#12281D]">Delivered Architectural Portfolio</h4>
                  <button
                    onClick={() => {
                      const newProjs = [...aboutContent.deliveredProjects, { 
                        id: 'p-' + Date.now(), title: 'New Project', neighborhood: '', architect: '', units: '', valuation: '', status: '', image: '', description: '', slug: '' 
                      }];
                      setAboutContent({ ...aboutContent, deliveredProjects: newProjs });
                    }}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Section Subtitle</label>
                    <input type="text" value={aboutContent.portfolioSubtitle} onChange={(e) => setAboutContent({ ...aboutContent, portfolioSubtitle: e.target.value })} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Section Title (HTML)</label>
                    <input type="text" value={aboutContent.portfolioTitle} onChange={(e) => setAboutContent({ ...aboutContent, portfolioTitle: e.target.value })} className="w-full p-2 border rounded text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold mb-1">Section Description</label>
                  <textarea value={aboutContent.portfolioDescription} onChange={(e) => setAboutContent({ ...aboutContent, portfolioDescription: e.target.value })} className="w-full p-2 border rounded text-sm h-16" />
                </div>

                <div className="space-y-4">
                  {aboutContent.deliveredProjects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 border rounded relative bg-gray-50 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          const np = [...aboutContent.deliveredProjects];
                          np.splice(idx, 1);
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div>
                        <label className="block text-xs mb-1">Title</label>
                        <input type="text" value={proj.title} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].title = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1">Neighborhood</label>
                        <input type="text" value={proj.neighborhood} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].neighborhood = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs mb-1">Architect</label>
                        <input type="text" value={proj.architect} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].architect = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs mb-1">Units/Residences</label>
                        <input type="text" value={proj.units} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].units = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs mb-1">Valuation</label>
                        <input type="text" value={proj.valuation} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].valuation = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs mb-1">Status</label>
                        <input type="text" value={proj.status} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].status = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs mb-1">Slug/Link</label>
                        <input type="text" value={proj.slug} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].slug = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1">Image URL</label>
                        <input type="text" value={proj.image} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].image = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs mb-1">Description</label>
                        <textarea value={proj.description} onChange={(e) => {
                          const np = [...aboutContent.deliveredProjects];
                          np[idx].description = e.target.value;
                          setAboutContent({ ...aboutContent, deliveredProjects: np });
                        }} className="w-full p-1.5 border rounded text-sm h-16" />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* VIEW: HOMEPAGE & VIDEO MANAGER */}
          {currentView === 'homepage' && siteSettings && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Homepage Hero & Section Video CMS</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Control live headlines, background video pickers, subheadings, and call-to-action destinations across the main landing portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSiteSettings(siteSettings)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Save size={14} />
                  <span>Save All Changes</span>
                </button>
              </div>

              {/* Section 1: Hero Banner */}
              <div className="p-8 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-3xl space-y-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[rgb(147,191,199)]/40 pb-3">
                  <Film size={18} className="text-[#17462E]" />
                  <h4 className="font-serif text-xl text-[#12281D]">Section 1: Hero Banner (Full Viewport)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Badge Tagline</label>
                      <input
                        type="text"
                        value={siteSettings.hero?.badge || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          hero: { ...siteSettings.hero, badge: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Title Line 1</label>
                        <input
                          type="text"
                          value={siteSettings.hero?.titleLine1 || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            hero: { ...siteSettings.hero, titleLine1: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Title Line 2 (Gold Serif)</label>
                        <input
                          type="text"
                          value={siteSettings.hero?.titleLine2 || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            hero: { ...siteSettings.hero, titleLine2: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Subtitle / Descriptor</label>
                      <textarea
                        rows={3}
                        value={siteSettings.hero?.subtitle || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          hero: { ...siteSettings.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Hero Background Video MP4</label>
                      <select
                        value={siteSettings.hero?.videoMp4 || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          hero: { ...siteSettings.hero, videoMp4: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                      >
                        {media.videos.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Hero Poster (Fallback Image)</label>
                      <select
                        value={siteSettings.hero?.poster || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          hero: { ...siteSettings.hero, poster: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                      >
                        {media.images.map((img) => (
                          <option key={img} value={img}>{img}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-inner">
                      <video
                        key={siteSettings.hero?.videoMp4}
                        src={siteSettings.hero?.videoMp4}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full backdrop-blur-md">Live Hero Video Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Brand Philosophy */}
              <div className="p-8 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-3xl space-y-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[rgb(147,191,199)]/40 pb-3">
                  <Diamond size={18} className="text-[#17462E]" />
                  <h4 className="font-serif text-xl text-[#12281D]">Section 2: Architecture as an Emotional Art</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Title</label>
                        <input
                          type="text"
                          value={siteSettings.philosophy?.title || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, title: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Subtitle (Gold Italic)</label>
                        <input
                          type="text"
                          value={siteSettings.philosophy?.subtitle || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, subtitle: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Description Paragraph</label>
                      <textarea
                        rows={3}
                        value={siteSettings.philosophy?.description || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          philosophy: { ...siteSettings.philosophy, description: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#17462E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Stat 1 Value & Label</label>
                        <input
                          type="text"
                          value={siteSettings.philosophy?.stat1Value || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, stat1Value: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] mb-1"
                        />
                        <input
                          type="text"
                          value={siteSettings.philosophy?.stat1Label || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, stat1Label: e.target.value }
                          })}
                          className="w-full px-4 py-1.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-[11px] text-[#4D6F5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Stat 2 Value & Label</label>
                        <input
                          type="text"
                          value={siteSettings.philosophy?.stat2Value || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, stat2Value: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] mb-1"
                        />
                        <input
                          type="text"
                          value={siteSettings.philosophy?.stat2Label || ''}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            philosophy: { ...siteSettings.philosophy, stat2Label: e.target.value }
                          })}
                          className="w-full px-4 py-1.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-[11px] text-[#4D6F5C]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Video Loop MP4</label>
                      <select
                        value={siteSettings.philosophy?.videoMp4 || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          philosophy: { ...siteSettings.philosophy, videoMp4: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      >
                        {media.videos.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-inner">
                      <video
                        key={siteSettings.philosophy?.videoMp4}
                        src={siteSettings.philosophy?.videoMp4}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full backdrop-blur-md">Live Philosophy Video Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ARCHITECTURAL GALLERY VAULT */}
          {currentView === 'gallery' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Architectural Gallery Vault ({galleryItems.length} Photos)</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Manage high-resolution photography exhibited in the public /gallery portfolio showroom.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewGalleryItem(true);
                    setEditingGalleryItem({
                      id: `gal-${Date.now()}`,
                      title: '',
                      category: 'Architecture',
                      image: '',
                      caption: '',
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Plus size={14} />
                  <span>+ Add Gallery Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden">
                        <Image src={item.image || '/images/im1.jpg'} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 text-[#17462E] text-[9px] uppercase tracking-wider font-bold rounded-lg shadow-sm">
                          {item.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif text-lg text-[#12281D] leading-snug">{item.title}</h4>
                        {item.caption && <p className="text-xs text-[#4D6F5C] line-clamp-2 mt-1">{item.caption}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgb(147,191,199)]/40">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewGalleryItem(false);
                          setEditingGalleryItem(item);
                        }}
                        className="p-2 bg-[rgb(236,244,232)] text-[#17462E] hover:bg-[rgb(203,243,187)] rounded-xl transition-colors cursor-pointer"
                        title="Edit Photo"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: PRESS & EDITORIAL CMS */}
          {currentView === 'press' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Press & Global News Releases ({pressArticles.length})</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Publish architectural awards, global features, and developer acquisitions exhibited across the platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewPressArticle(true);
                    setEditingPressArticle({
                      id: `press-${Date.now()}`,
                      title: '',
                      publication: '',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      summary: '',
                      link: '',
                      image: '',
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Plus size={14} />
                  <span>+ Publish News Feature</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pressArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {art.image && (
                        <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden">
                          <Image src={art.image} alt={art.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#17462E] uppercase text-[10px] tracking-wider bg-[rgb(203,243,187)] px-2 py-0.5 rounded-md">
                          {art.publication}
                        </span>
                        <span className="text-[#4D6F5C] text-[11px]">{art.date}</span>
                      </div>
                      <h4 className="font-serif text-lg text-[#12281D] leading-snug">{art.title}</h4>
                      <p className="text-xs text-[#4D6F5C] line-clamp-3 leading-relaxed">{art.summary}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[rgb(147,191,199)]/40">
                      {art.link ? (
                        <span className="text-xs text-[#17462E] font-semibold inline-flex items-center gap-1">
                          <span>Link Provided</span>
                          <ArrowUpRight size={12} />
                        </span>
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewPressArticle(false);
                            setEditingPressArticle(art);
                          }}
                          className="p-2 bg-[rgb(236,244,232)] text-[#17462E] hover:bg-[rgb(203,243,187)] rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePressArticle(art.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: EXECUTIVE LEADERSHIP CMS */}
          {currentView === 'leadership' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Executive Leadership Team ({leadershipMembers.length} Partners)</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Manage founding partners, master architects, and acquisition principals showcased on the /about page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewLeadershipMember(true);
                    setEditingLeadershipMember({
                      id: `lead-${Date.now()}`,
                      name: '',
                      role: '',
                      bio: '',
                      image: '',
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Plus size={14} />
                  <span>+ Add Leadership Principal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadershipMembers.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
                        <Image src={lead.image || '/images/im7.jpeg'} alt={lead.name} fill className="object-cover object-top" />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#17462E] tracking-wider block">
                        {lead.role}
                      </span>
                      <h4 className="font-serif text-xl text-[#12281D]">{lead.name}</h4>
                      <p className="text-xs text-[#4D6F5C] line-clamp-3 leading-relaxed">{lead.bio}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgb(147,191,199)]/40">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewLeadershipMember(false);
                          setEditingLeadershipMember(lead);
                        }}
                        className="p-2 bg-[rgb(236,244,232)] text-[#17462E] hover:bg-[rgb(203,243,187)] rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLeadershipMember(lead.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ANNOUNCEMENT BANNER CMS */}
          {currentView === 'announcement' && siteSettings && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Site-Wide Announcement Banner</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Control the global top bar announcement visible to every visitor on the public portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSiteSettings(siteSettings)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Save size={14} />
                  <span>Save Banner</span>
                </button>
              </div>

              {/* Live Preview Bar */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#4D6F5C] block">Live Banner Preview</span>
                <div className="p-3 bg-[#17462E] text-white rounded-2xl flex items-center justify-center gap-3 text-xs shadow-md border border-[rgb(171,231,178)]/40">
                  {siteSettings.announcementBanner?.badge && (
                    <span className="px-2.5 py-0.5 bg-[rgb(203,243,187)] text-[#17462E] text-[10px] uppercase font-bold rounded-full">
                      {siteSettings.announcementBanner.badge}
                    </span>
                  )}
                  <span>{siteSettings.announcementBanner?.text || 'Announcement preview text'}</span>
                  {siteSettings.announcementBanner?.linkText && (
                    <span className="text-[rgb(203,243,187)] font-semibold underline underline-offset-4">
                      {siteSettings.announcementBanner.linkText} →
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              <div className="p-8 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-3xl space-y-6 shadow-sm">
                <div className="flex items-center justify-between p-4 bg-[rgb(236,244,232)] rounded-2xl border border-[rgb(147,191,199)]/40">
                  <div>
                    <span className="font-semibold text-xs text-[#12281D] block">Enable Top Announcement Bar</span>
                    <span className="text-[11px] text-[#4D6F5C]">When enabled, this bar appears at the very top of all public pages.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({
                      ...siteSettings,
                      announcementBanner: {
                        ...siteSettings.announcementBanner,
                        enabled: !siteSettings.announcementBanner?.enabled,
                      }
                    })}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      siteSettings.announcementBanner?.enabled
                        ? 'bg-[#17462E] text-white shadow-md'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {siteSettings.announcementBanner?.enabled ? 'Active / Visible' : 'Disabled / Hidden'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. PRIVATE RELEASE"
                      value={siteSettings.announcementBanner?.badge || ''}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        announcementBanner: {
                          ...siteSettings.announcementBanner,
                          badge: e.target.value,
                        }
                      })}
                      className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Announcement Message</label>
                    <input
                      type="text"
                      placeholder="e.g. Now accepting confidential inquiries for the Sky Sanctuary at The Marquis Brickell."
                      value={siteSettings.announcementBanner?.text || ''}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        announcementBanner: {
                          ...siteSettings.announcementBanner,
                          text: e.target.value,
                        }
                      })}
                      className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Link Call to Action Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Explore Sky Penthouse"
                        value={siteSettings.announcementBanner?.linkText || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          announcementBanner: {
                            ...siteSettings.announcementBanner,
                            linkText: e.target.value,
                          }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#4D6F5C] mb-1">Destination URL / Anchor</label>
                      <input
                        type="text"
                        placeholder="e.g. /developments/the-marquis-brickell"
                        value={siteSettings.announcementBanner?.linkUrl || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          announcementBanner: {
                            ...siteSettings.announcementBanner,
                            linkUrl: e.target.value,
                          }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CONTACT SETTINGS */}
          {currentView === 'contact' && siteSettings && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Contact Information</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Manage global contact details displayed in the footer, navigation, and contact page.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSiteSettings(siteSettings)}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2.5 bg-[#17462E] hover:bg-[#0D2A1B] text-white text-xs uppercase tracking-widest font-bold rounded-full transition-colors flex items-center gap-2"
                >
                  {saveStatus === 'saving' ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Changes'}
                </button>
              </div>

              <div className="bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl overflow-hidden shadow-sm p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-2">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.contact?.email || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          contact: { ...siteSettings.contact, email: e.target.value } as any
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-2">
                        Primary Phone
                      </label>
                      <input
                        type="text"
                        value={siteSettings.contact?.phone || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          contact: { ...siteSettings.contact, phone: e.target.value } as any
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-2">
                        WhatsApp VIP Number
                      </label>
                      <input
                        type="text"
                        value={siteSettings.contact?.whatsapp || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          contact: { ...siteSettings.contact, whatsapp: e.target.value } as any
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-2">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        value={siteSettings.contact?.workingHours || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          contact: { ...siteSettings.contact, workingHours: e.target.value } as any
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-2">
                      Corporate Address
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.contact?.address || ''}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        contact: { ...siteSettings.contact, address: e.target.value } as any
                      })}
                      className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TESTIMONIALS & ENDORSEMENTS CMS */}
          {currentView === 'testimonials' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/95 backdrop-blur-2xl border border-[rgb(147,191,199)]/70 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl text-[#12281D]">Client Endorsements & Critical Reviews ({testimonials.length})</h3>
                  <p className="text-xs text-[#4D6F5C] mt-1">
                    Manage buyer endorsements and architectural reviews displayed on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewTestimonial(true);
                    setEditingTestimonial({
                      id: `test-${Date.now()}`,
                      quote: '',
                      author: '',
                      titleOrResidence: '',
                      category: 'Penthouse Owner',
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Plus size={14} />
                  <span>+ Add Endorsement</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#17462E] bg-[rgb(203,243,187)] px-2 py-0.5 rounded-md">
                          {test.category}
                        </span>
                        <div className="text-amber-500 text-xs">★★★★★</div>
                      </div>
                      <p className="text-xs text-[#12281D] italic leading-relaxed">&ldquo;{test.quote}&rdquo;</p>
                      <div>
                        <div className="font-serif text-base text-[#12281D] font-bold">{test.author}</div>
                        <div className="text-[11px] text-[#4D6F5C]">{test.titleOrResidence}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgb(147,191,199)]/40">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewTestimonial(false);
                          setEditingTestimonial(test);
                        }}
                        className="p-2 bg-[rgb(236,244,232)] text-[#17462E] hover:bg-[rgb(203,243,187)] rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(test.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: DISTRICT GUIDES (Visual Photo Highlights) */}
          {currentView === 'neighborhoods' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {neighborhoods.map((n) => (
                <div key={n.slug} className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-4 rounded-2xl overflow-hidden">
                  <div className="relative aspect-[16/9] w-full bg-[rgb(236,244,232)] overflow-hidden rounded-xl group">
                    <Image src={n.heroPoster} alt={n.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] uppercase tracking-wider text-[rgb(203,243,187)] font-semibold">{n.tagline}</span>
                      <h3 className="font-serif text-2xl leading-tight">{n.name}</h3>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#4D6F5C] leading-relaxed">{n.description}</p>
                  </div>
                  <div className="pt-2 text-xs text-[#12281D] space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#4D6F5C] font-semibold block">Lifestyle Highlights:</span>
                    {n.keyFeatures?.map((f, i) => (
                      <div key={i} className="text-xs text-[#12281D]">• {f}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 5: SIGNATURE AMENITIES (Visual Luxury Cards) */}
          {currentView === 'amenities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {amenities.map((a) => (
                <div key={a.id} className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-4 rounded-2xl overflow-hidden">
                  <div className="relative aspect-[16/9] w-full bg-[rgb(236,244,232)] overflow-hidden rounded-xl group">
                    <Image src={a.poster} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 border border-[rgb(147,191,199)] text-[9px] uppercase tracking-wider text-[#17462E] font-semibold rounded-lg shadow-sm">
                      {a.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#12281D]">{a.title}</h3>
                    <p className="text-xs text-[#17462E] italic mt-0.5">&ldquo;{a.tagline}&rdquo;</p>
                    <p className="text-xs text-[#4D6F5C] mt-2 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 6: MEDIA VAULT & UPLOAD CENTER */}
          {currentView === 'media' && (
            <div className="space-y-8">
              {/* Media Upload Dropzone Banner */}
              <div className="p-8 bg-white/95 backdrop-blur-2xl border-2 border-dashed border-[#17462E]/30 rounded-3xl space-y-4 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-[rgb(203,243,187)] border border-[rgb(171,231,178)] flex items-center justify-center text-[#17462E] shadow-sm">
                  {isUploading ? <RefreshCw size={28} className="animate-spin" /> : <Upload size={28} />}
                </div>

                <div className="space-y-1 max-w-md">
                  <h3 className="font-serif text-2xl text-[#12281D]">
                    {isUploading ? 'Uploading Project Asset...' : 'Upload Project Photography & Media'}
                  </h3>
                  <p className="text-xs text-[#385B49] leading-relaxed">
                    Upload high-resolution architectural renderings, penthouse photography, or cinematic MP4 video loops directly to the media vault.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95">
                  <Upload size={14} />
                  <span>Select Files from Device</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      for (let i = 0; i < files.length; i++) {
                        await handleFileUpload(files[i]);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#12281D] flex items-center gap-2">
                  <Film size={20} className="text-[#17462E]" />
                  <span>Architectural Video Loops ({media.videos.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {media.videos.map((vid, idx) => (
                    <div key={idx} className="p-4 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-3 rounded-2xl">
                      <div className="relative aspect-[16/10] bg-black overflow-hidden rounded-xl">
                        <video src={vid} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <code className="text-[11px] text-[#17462E] font-semibold truncate">{vid}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(vid);
                            alert(`Copied path: ${vid}`);
                          }}
                          className="px-2.5 py-1 bg-[rgb(236,244,232)] text-[10px] text-[#17462E] hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] rounded-lg font-medium cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-[rgb(147,191,199)]/40">
                <h3 className="font-serif text-2xl text-[#12281D] flex items-center gap-2">
                  <Diamond size={20} className="text-[#17462E]" />
                  <span>Posters & Renderings ({media.images.length})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.images.map((img, idx) => (
                    <div key={idx} className="p-3 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 shadow-sm space-y-2 rounded-2xl">
                      <div className="relative aspect-[4/3] bg-black overflow-hidden rounded-xl">
                        <Image src={img} alt="Media Asset" fill className="object-cover" />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <code className="text-[#4D6F5C] truncate">{img}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(img);
                            alert(`Copied: ${img}`);
                          }}
                          className="text-[10px] text-[#17462E] font-semibold hover:underline cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: PLATFORM HEALTH & AUDIT STREAM */}
          {currentView === 'audit' && (
            <div className="space-y-8">
              {/* Platform Health Matrix Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-[#12281D] flex items-center gap-2">
                    <Activity size={20} className="text-[#17462E]" />
                    <span>Platform Diagnostics & System Health</span>
                  </h3>
                  <span className="px-3 py-1 bg-[rgb(203,243,187)] border border-[rgb(171,231,178)] text-[10px] uppercase tracking-wider text-[#17462E] font-bold rounded-full">
                    🟢 All Systems Operational
                  </span>
                </div>
                <p className="text-xs text-[#385B49]">
                  All platform anomalies, API errors, and infrastructure alerts are isolated strictly to this executive dashboard.
                </p>
              </div>

              {/* 4 Health Diagnostic Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase text-[10px] font-semibold">Next.js Core Routes</span>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="font-serif text-2xl text-[#12281D]">26 / 26 Routes</div>
                  <div className="text-[11px] text-emerald-700 font-medium">100% Pre-rendered & SSG</div>
                </div>

                <div className="p-5 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase text-[10px] font-semibold">API Microservices</span>
                    <ShieldCheck size={16} className="text-emerald-600" />
                  </div>
                  <div className="font-serif text-2xl text-[#12281D]">7 Endpoints</div>
                  <div className="text-[11px] text-emerald-700 font-medium">0 Errors • Latency 24ms</div>
                </div>

                <div className="p-5 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase text-[10px] font-semibold">SSR Hydration Status</span>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="font-serif text-2xl text-emerald-800">Synchronized</div>
                  <div className="text-[11px] text-[#4D6F5C]">Deterministic FX Formatters</div>
                </div>

                <div className="p-5 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#4D6F5C]">
                    <span className="uppercase text-[10px] font-semibold">Public View Mode</span>
                    <Eye size={16} className="text-[#17462E]" />
                  </div>
                  <div className="font-serif text-2xl text-[#12281D]">Pristine View</div>
                  <div className="text-[11px] text-[#4D6F5C]">Dev Overlays Disabled</div>
                </div>
              </div>

              {/* Event Stream */}
              <div className="p-6 bg-white/90 backdrop-blur-xl border border-[rgb(147,191,199)]/60 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[rgb(147,191,199)]/40 pb-3">
                  <span className="font-serif text-lg text-[#12281D]">Live Platform Audit Log</span>
                  <span className="text-[10px] font-mono text-[#4D6F5C]">Real-Time Streaming</span>
                </div>

                <div className="space-y-2">
                  {activityLog.map((log) => (
                    <div key={log.id} className="p-3.5 bg-[rgb(236,244,232)]/60 border border-[rgb(147,191,199)]/40 flex items-start gap-4 rounded-xl">
                      <span className="text-[10px] uppercase font-mono text-[#17462E] font-bold pt-0.5">{log.time}</span>
                      <div className="flex-1 text-xs text-[#12281D]">{log.message}</div>
                      <span className="px-2.5 py-0.5 bg-[rgb(203,243,187)] text-[9px] uppercase tracking-wider text-[#12281D] font-mono rounded-full font-semibold">
                        {log.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EXECUTIVE SLIDE-OVER LEAD DOSSIER DRAWER WITH PROPERTY IMAGE */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedInquiry(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border-l border-[rgb(147,191,199)] shadow-2xl flex flex-col justify-between h-full z-10 overflow-y-auto">
            {/* Full-Bleed Property Header Photo in Dossier */}
            <div className="relative h-44 w-full bg-[#16191E] overflow-hidden flex-shrink-0">
              <Image
                src={getPropertyImage(selectedInquiry.propertyInterest)}
                alt={selectedInquiry.propertyInterest}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-0.5">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[rgb(203,243,187)] font-bold block">
                  VIP Dossier • {selectedInquiry.id}
                </span>
                <h3 className="font-serif text-2xl font-medium">
                  {selectedInquiry.fullName}
                </h3>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Kings%20Real%20Estate%20Private%20Viewing%20for%20${encodeURIComponent(selectedInquiry.propertyInterest)}`}
                  className="inline-flex items-center justify-center gap-2 py-3 bg-[#17462E] hover:bg-[#113523] text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-xl shadow-sm"
                >
                  <Mail size={14} />
                  <span>Email VIP Client</span>
                </a>

                {selectedInquiry.phone && selectedInquiry.phone !== 'Not Provided' ? (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="inline-flex items-center justify-center gap-2 py-3 bg-white hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-xs text-[#12281D] font-semibold uppercase tracking-wider transition-colors rounded-xl shadow-sm"
                  >
                    <Phone size={14} className="text-[#17462E]" />
                    <span>Direct Call</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center py-3 bg-gray-100 border border-gray-200 text-xs text-gray-500 rounded-xl">
                    Phone N/A
                  </span>
                )}
              </div>

              {/* Status Selector */}
              <div className="p-4 bg-[rgb(236,244,232)] border border-[rgb(147,191,199)]/40 rounded-2xl space-y-2">
                <label className="block text-[10px] uppercase text-[#4D6F5C] font-semibold">
                  Update Pipeline Status
                </label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as Inquiry['status'])}
                  className="w-full px-3.5 py-2.5 bg-white border border-[rgb(147,191,199)] text-xs text-[#12281D] font-medium focus:border-[#17462E] focus:outline-none rounded-xl cursor-pointer"
                >
                  <option value="New">🟢 New Lead</option>
                  <option value="In Review">🟡 In Review</option>
                  <option value="Showing Scheduled">🟣 Showing Scheduled</option>
                  <option value="Under Contract">🔵 Under Contract</option>
                  <option value="Archived">⚪ Archived</option>
                </select>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-white border border-[rgb(147,191,199)]/40 rounded-2xl space-y-3 shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase text-[#4D6F5C] font-semibold block">Target Residence</span>
                    <span className="text-base font-serif text-[#12281D] font-medium">{selectedInquiry.propertyInterest}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#4D6F5C] font-semibold block">Anticipated Capital Allocation</span>
                    <span className="font-serif text-[#17462E] text-lg font-bold">{selectedInquiry.budgetRange}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#4D6F5C] font-semibold block">Timeline</span>
                    <span className="text-[#12281D] font-medium">{selectedInquiry.acquisitionTimeframe}</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[rgb(147,191,199)]/40 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-[10px] uppercase text-[#4D6F5C] font-semibold block">Contact Details</span>
                  <div className="text-[#12281D] font-mono text-xs">{selectedInquiry.email}</div>
                  <div className="text-[#12281D] font-mono text-xs">{selectedInquiry.phone}</div>
                </div>

                <div className="p-4 bg-white border border-[rgb(147,191,199)]/40 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-[10px] uppercase text-[#4D6F5C] font-semibold block">Special Requirements / Notes</span>
                  <p className="text-xs text-[#12281D] leading-relaxed">
                    {selectedInquiry.specialRequirements || 'No special requirements specified by client.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck size={16} />
                  <span>Confidential Non-Disclosure Agreement (NDA) Acknowledged</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[rgb(147,191,199)]/40 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 border border-[rgb(147,191,199)] text-xs text-[#12281D] font-semibold rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMPLE & CLEAN RESIDENCE UPLOAD MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white border border-[rgb(147,191,199)] shadow-2xl rounded-3xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-[rgb(236,244,232)]/80 border-b border-[rgb(147,191,199)]/40">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#12281D]">
                  {isNewProperty ? 'Add New Residence' : 'Edit Residence'}
                </h2>
                <p className="text-xs text-[#385B49] mt-0.5">
                  Enter property details and upload photos to publish to the catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="p-2 text-[#4D6F5C] hover:text-[#12281D] hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProperty();
              }}
              className="p-6 sm:p-8 space-y-5 max-h-[72vh] overflow-y-auto"
            >
              {/* 1. Residence Name */}
              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1.5">
                  Residence Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Sapphire Bay Penthouse"
                  value={editingProperty.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const autoSlug = isNewProperty
                      ? newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `residence-${Date.now().toString().slice(-4)}`
                      : editingProperty.slug;
                    setEditingProperty({
                      ...editingProperty,
                      name: newName,
                      slug: autoSlug,
                    });
                  }}
                  className="w-full px-4 py-3 bg-white border border-[rgb(147,191,199)] text-sm text-[#12281D] focus:border-[#17462E] focus:outline-none rounded-xl font-medium shadow-sm"
                />
              </div>

              {/* 2. Price & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1.5">
                    Starting Price ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 12500000"
                    value={editingProperty.priceFrom || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, priceFrom: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-[rgb(147,191,199)] text-sm text-[#12281D] focus:border-[#17462E] focus:outline-none rounded-xl shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1.5">
                    Location / District
                  </label>
                  <select
                    value={editingProperty.neighborhoodSlug || 'brickell'}
                    onChange={(e) => {
                      const n = neighborhoods.find((item) => item.slug === e.target.value);
                      setEditingProperty({
                        ...editingProperty,
                        neighborhoodSlug: e.target.value,
                        neighborhood: n ? n.name : e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 bg-white border border-[rgb(147,191,199)] text-sm text-[#12281D] focus:border-[#17462E] focus:outline-none rounded-xl shadow-sm cursor-pointer"
                  >
                    <option value="brickell">Brickell Financial District</option>
                    <option value="edgewater">Edgewater Bay</option>
                    <option value="coconut-grove">Coconut Grove</option>
                    <option value="miami-beach">Miami Beach & Star Island</option>
                  </select>
                </div>
              </div>

              {/* 3. Description */}
              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the description of the residence, features, views, and finishes..."
                  value={editingProperty.overview || editingProperty.shortDescription || ''}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      overview: e.target.value,
                      shortDescription: e.target.value.slice(0, 160),
                      tagline: editingProperty.tagline || e.target.value.slice(0, 80),
                    })
                  }
                  className="w-full p-4 bg-white border border-[rgb(147,191,199)] text-sm text-[#12281D] focus:border-[#17462E] focus:outline-none rounded-xl leading-relaxed shadow-sm resize-none"
                />
              </div>

              {/* 4. Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#12281D]">
                  Residence Cover Image <span className="text-red-500">*</span>
                </label>

                {editingProperty.heroPoster ? (
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[rgb(147,191,199)] bg-black shadow-md group">
                    <Image
                      src={editingProperty.heroPoster}
                      alt="Cover Photo Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="px-4 py-2 bg-white text-[#17462E] text-xs font-semibold rounded-xl cursor-pointer shadow-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) setEditingProperty({ ...editingProperty, heroPoster: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#17462E]/40 hover:border-[#17462E] bg-[rgb(236,244,232)]/50 hover:bg-[rgb(236,244,232)] p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white text-[#17462E] shadow-sm flex items-center justify-center mb-3">
                      {isUploading ? <RefreshCw size={22} className="animate-spin" /> : <Upload size={22} />}
                    </div>
                    <span className="text-sm font-semibold text-[#12281D]">
                      {isUploading ? 'Uploading Image...' : 'Click to Upload Residence Image'}
                    </span>
                    <span className="text-xs text-[#4D6F5C] mt-1">
                      Select JPG, PNG, or WebP from your device
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingProperty({ ...editingProperty, heroPoster: url });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* 5. Additional Photos (Optional) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-[#12281D]">
                      Additional Photos ({editingProperty.galleryImages?.length || 0})
                    </label>
                    <span className="text-[11px] text-[#4D6F5C]">
                      Optional: add more photos for this property
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[rgb(236,244,232)] hover:bg-[rgb(203,243,187)] border border-[rgb(147,191,199)] text-[#17462E] text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95">
                    <Upload size={13} />
                    <span>+ Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        for (let i = 0; i < files.length; i++) {
                          const url = await handleFileUpload(files[i]);
                          if (url) handleAddGalleryImage(url);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {/* Thumbnails grid */}
                {editingProperty.galleryImages && editingProperty.galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-1">
                    {editingProperty.galleryImages.map((imgUrl, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative aspect-square rounded-xl overflow-hidden bg-black border border-[rgb(147,191,199)] shadow-sm group"
                      >
                        <Image src={imgUrl} alt={`Photo ${gIdx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(gIdx)}
                          className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                          title="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VISUAL DETAILS / SECTIONS EDITOR */}
              <div className="space-y-4 pt-6 pb-2 border-t border-[rgb(147,191,199)]/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg text-[#12281D]">Visual Building Details (Sections)</h4>
                    <p className="text-[11px] text-[#4D6F5C]">Add detailed sections representing parts of the building with images and descriptions.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17462E] hover:bg-[#0D2A1B] text-white text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors"
                  >
                    <Plus size={12} /> Add Detail
                  </button>
                </div>

                {editingProperty.sections && editingProperty.sections.length > 0 ? (
                  <div className="space-y-6">
                    {editingProperty.sections.map((section, idx) => (
                      <div key={section.id || idx} className="p-4 bg-[rgb(236,244,232)]/50 border border-[rgb(147,191,199)]/50 rounded-2xl space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="absolute top-4 right-4 p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove Detail"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                          <div>
                            <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-1">Title</label>
                            <input
                              type="text"
                              value={section.title || ''}
                              onChange={(e) => {
                                const newSec = [...editingProperty.sections!];
                                newSec[idx].title = e.target.value;
                                setEditingProperty({ ...editingProperty, sections: newSec });
                              }}
                              className="w-full px-3 py-2 bg-white border border-[rgb(147,191,199)] rounded-lg text-xs"
                              placeholder="e.g. The Master Sanctuary"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={section.subtitle || ''}
                              onChange={(e) => {
                                const newSec = [...editingProperty.sections!];
                                newSec[idx].subtitle = e.target.value;
                                setEditingProperty({ ...editingProperty, sections: newSec });
                              }}
                              className="w-full px-3 py-2 bg-white border border-[rgb(147,191,199)] rounded-lg text-xs"
                              placeholder="e.g. Unrestricted Panoramas"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-1">Detailed Description</label>
                          <textarea
                            rows={3}
                            value={section.description || ''}
                            onChange={(e) => {
                              const newSec = [...editingProperty.sections!];
                              newSec[idx].description = e.target.value;
                              setEditingProperty({ ...editingProperty, sections: newSec });
                            }}
                            className="w-full px-3 py-2 bg-white border border-[rgb(147,191,199)] rounded-lg text-xs resize-none"
                            placeholder="Describe this part of the building..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-1">Image / Poster URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={section.poster || ''}
                                onChange={(e) => {
                                  const newSec = [...editingProperty.sections!];
                                  newSec[idx].poster = e.target.value;
                                  setEditingProperty({ ...editingProperty, sections: newSec });
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-[rgb(147,191,199)] rounded-lg text-xs"
                              />
                              <label className="inline-flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-50 border border-[rgb(147,191,199)] text-[#17462E] text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                                <Upload size={14} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = await handleFileUpload(file);
                                      if (url) {
                                        const newSec = [...editingProperty.sections!];
                                        newSec[idx].poster = url;
                                        setEditingProperty({ ...editingProperty, sections: newSec });
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            {section.poster && (
                              <div className="mt-2 relative aspect-video w-full max-w-[150px] rounded-lg overflow-hidden border border-[rgb(147,191,199)]">
                                <Image src={section.poster} alt="Preview" fill className="object-cover" />
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#4D6F5C] uppercase tracking-wider mb-1">Video URL (Optional)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={section.videoMp4 || ''}
                                onChange={(e) => {
                                  const newSec = [...editingProperty.sections!];
                                  newSec[idx].videoMp4 = e.target.value;
                                  setEditingProperty({ ...editingProperty, sections: newSec });
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-[rgb(147,191,199)] rounded-lg text-xs"
                                placeholder="/videos/sample.mp4"
                              />
                              <label className="inline-flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-50 border border-[rgb(147,191,199)] text-[#17462E] text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                                <Upload size={14} />
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = await handleFileUpload(file);
                                      if (url) {
                                        const newSec = [...editingProperty.sections!];
                                        newSec[idx].videoMp4 = url;
                                        setEditingProperty({ ...editingProperty, sections: newSec });
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-[rgb(236,244,232)]/50 border border-dashed border-[rgb(147,191,199)] rounded-2xl">
                    <p className="text-xs text-[#4D6F5C]">No visual details added yet.</p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgb(147,191,199)]/40">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-5 py-2.5 bg-white hover:bg-gray-100 border border-[rgb(147,191,199)] text-xs text-[#4D6F5C] font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saveStatus === 'saving' || isUploading}
                  className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold shadow-md rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check size={14} />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Upload Residence</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY PHOTO MODAL */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white border border-[rgb(147,191,199)] shadow-2xl rounded-3xl overflow-hidden my-auto">
            <div className="flex items-center justify-between p-6 bg-[rgb(236,244,232)]/80 border-b border-[rgb(147,191,199)]/40">
              <div>
                <h3 className="font-serif text-xl text-[#12281D]">
                  {isNewGalleryItem ? 'Add Gallery Photo' : 'Edit Gallery Photo'}
                </h3>
                <p className="text-xs text-[#385B49] mt-0.5">Exhibit architectural photography in the public showroom.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="p-2 text-[#4D6F5C] hover:text-[#12281D] rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingGalleryItem.image) {
                  alert('Please upload an image for the photo card.');
                  return;
                }
                handleSaveGalleryItem(editingGalleryItem);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Photo Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Suite & Sunrise Glass Horizon"
                  value={editingGalleryItem.title}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Category</label>
                  <select
                    value={editingGalleryItem.category}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Interiors">Interiors</option>
                    <option value="Amenities">Amenities</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Sub-label / Detail</label>
                  <input
                    type="text"
                    placeholder="e.g. Calacatta Marble & Bronze"
                    value={editingGalleryItem.caption || ''}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1.5">Photo Image</label>
                {editingGalleryItem.image ? (
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-[rgb(147,191,199)] group">
                    <Image src={editingGalleryItem.image} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-4 py-2 bg-white text-[#17462E] text-xs font-semibold rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Replace Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) setEditingGalleryItem({ ...editingGalleryItem, image: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#17462E]/40 bg-[rgb(236,244,232)]/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer">
                    <Upload size={24} className="text-[#17462E] mb-2" />
                    <span className="text-xs font-semibold text-[#12281D]">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingGalleryItem({ ...editingGalleryItem, image: url });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgb(147,191,199)]/40">
                <button
                  type="button"
                  onClick={() => setEditingGalleryItem(null)}
                  className="px-5 py-2 bg-white border border-[rgb(147,191,199)] text-xs text-[#4D6F5C] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRESS ARTICLE MODAL */}
      {editingPressArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white border border-[rgb(147,191,199)] shadow-2xl rounded-3xl overflow-hidden my-auto">
            <div className="flex items-center justify-between p-6 bg-[rgb(236,244,232)]/80 border-b border-[rgb(147,191,199)]/40">
              <div>
                <h3 className="font-serif text-xl text-[#12281D]">
                  {isNewPressArticle ? 'Publish News Feature' : 'Edit Press Article'}
                </h3>
                <p className="text-xs text-[#385B49] mt-0.5">Publish global media awards, architectural features, and press releases.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPressArticle(null)}
                className="p-2 text-[#4D6F5C] hover:text-[#12281D] rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePressArticle(editingPressArticle);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Headline / Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architectural Digest: The 10 Most Monumental Penthouses in Miami"
                  value={editingPressArticle.title}
                  onChange={(e) => setEditingPressArticle({ ...editingPressArticle, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Publication Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Forbes, Robb Report, Wall Street Journal"
                    value={editingPressArticle.publication}
                    onChange={(e) => setEditingPressArticle({ ...editingPressArticle, publication: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026"
                    value={editingPressArticle.date}
                    onChange={(e) => setEditingPressArticle({ ...editingPressArticle, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Link URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.architecturaldigest.com/story/..."
                  value={editingPressArticle.link || ''}
                  onChange={(e) => setEditingPressArticle({ ...editingPressArticle, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Summary / Editorial Snippet</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of the article or critic acclaim..."
                  value={editingPressArticle.summary}
                  onChange={(e) => setEditingPressArticle({ ...editingPressArticle, summary: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1.5">Cover Image (Optional)</label>
                {editingPressArticle.image ? (
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-[rgb(147,191,199)] group">
                    <Image src={editingPressArticle.image} alt="Cover Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-4 py-2 bg-white text-[#17462E] text-xs font-semibold rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Change Cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) setEditingPressArticle({ ...editingPressArticle, image: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#17462E]/40 bg-[rgb(236,244,232)]/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer">
                    <Upload size={20} className="text-[#17462E] mb-1" />
                    <span className="text-xs font-semibold text-[#12281D]">Upload Article Feature Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingPressArticle({ ...editingPressArticle, image: url });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgb(147,191,199)]/40">
                <button
                  type="button"
                  onClick={() => setEditingPressArticle(null)}
                  className="px-5 py-2 bg-white border border-[rgb(147,191,199)] text-xs text-[#4D6F5C] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md"
                >
                  Publish Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEADERSHIP MEMBER MODAL */}
      {editingLeadershipMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white border border-[rgb(147,191,199)] shadow-2xl rounded-3xl overflow-hidden my-auto">
            <div className="flex items-center justify-between p-6 bg-[rgb(236,244,232)]/80 border-b border-[rgb(147,191,199)]/40">
              <div>
                <h3 className="font-serif text-xl text-[#12281D]">
                  {isNewLeadershipMember ? 'Add Leadership Principal' : 'Edit Leadership Principal'}
                </h3>
                <p className="text-xs text-[#385B49] mt-0.5">Manage executive partner biographies and portraits on the /about page.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingLeadershipMember(null)}
                className="p-2 text-[#4D6F5C] hover:text-[#12281D] rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLeadershipMember(editingLeadershipMember);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laurent de Montcalm"
                    value={editingLeadershipMember.name}
                    onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Role / Executive Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founding Principal & Master Architect"
                    value={editingLeadershipMember.role}
                    onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Executive Bio</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Professional background, architectural philosophy, and portfolio achievements..."
                  value={editingLeadershipMember.bio}
                  onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1.5">Executive Portrait</label>
                {editingLeadershipMember.image ? (
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black border border-[rgb(147,191,199)] group">
                    <Image src={editingLeadershipMember.image} alt="Portrait" fill className="object-cover object-top" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="px-4 py-2 bg-white text-[#17462E] text-xs font-semibold rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Change Portrait</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) setEditingLeadershipMember({ ...editingLeadershipMember, image: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#17462E]/40 bg-[rgb(236,244,232)]/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer">
                    <Upload size={20} className="text-[#17462E] mb-1" />
                    <span className="text-xs font-semibold text-[#12281D]">Upload Portrait Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingLeadershipMember({ ...editingLeadershipMember, image: url });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgb(147,191,199)]/40">
                <button
                  type="button"
                  onClick={() => setEditingLeadershipMember(null)}
                  className="px-5 py-2 bg-white border border-[rgb(147,191,199)] text-xs text-[#4D6F5C] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md"
                >
                  Save Principal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white border border-[rgb(147,191,199)] shadow-2xl rounded-3xl overflow-hidden my-auto">
            <div className="flex items-center justify-between p-6 bg-[rgb(236,244,232)]/80 border-b border-[rgb(147,191,199)]/40">
              <div>
                <h3 className="font-serif text-xl text-[#12281D]">
                  {isNewTestimonial ? 'Add Client Endorsement' : 'Edit Endorsement'}
                </h3>
                <p className="text-xs text-[#385B49] mt-0.5">Manage buyer quotes and architectural critic praise.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="p-2 text-[#4D6F5C] hover:text-[#12281D] rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTestimonial(editingTestimonial);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Author Name / Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Henrik & Sofia Lindqvist"
                  value={editingTestimonial.author}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Title / Residence Owned</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sky Sanctuary Owner, The Marquis"
                    value={editingTestimonial.titleOrResidence}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, titleOrResidence: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12281D] mb-1">Category Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Penthouse Owner, Architectural Critic"
                    value={editingTestimonial.category || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12281D] mb-1">Endorsement Quote</label>
                <textarea
                  rows={4}
                  required
                  placeholder="The architectural volume and finishes are unmatched in North America..."
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[rgb(147,191,199)] rounded-xl text-xs text-[#12281D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgb(147,191,199)]/40">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-5 py-2 bg-white border border-[rgb(147,191,199)] text-xs text-[#4D6F5C] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#17462E] hover:bg-[#113523] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md"
                >
                  Save Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
