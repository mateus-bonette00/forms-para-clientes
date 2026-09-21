import React, { useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Share2,
  Copy,
  Check,
  Eye,
  Calendar,
  Image as ImageIcon,
  Building,
  User,
  Phone,
  Clock,
  Sparkles
  Sparkles,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStatsCards } from '../components/admin/AdminStatsCards';
import { SubmissionDetailModal } from '../components/admin/SubmissionDetailModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ClientSubmission, AdminStats } from '../types';
import api from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    novo: 0,
    emAnalise: 0,
    emAndamento: 0,
    concluido: 0,
    totalFiles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ClientSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        api.get('/admin/submissions', {
          params: {
            status: activeFilter,
            search: searchQuery,
          },
        }),
        api.get('/admin/stats'),
      ]);

      setSubmissions(subsRes.data?.data || []);
      setStats(statsRes.data || {});
    } catch (err: any) {
      console.error('Erro ao buscar dados do painel:', err);
      toast.error('Não foi possível carregar os envios. Verifique o login.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.hash = '#/admin/login';
    toast.info('Sessão encerrada.');
  };

  const handleOpenSubmission = async (sub: ClientSubmission) => {
    try {
      const detailRes = await api.get(`/admin/submissions/${sub.id}`);
      setSelectedSubmission(detailRes.data?.data || sub);
      setIsModalOpen(true);
    } catch (err) {
    } catch {
      setSelectedSubmission(sub);
      setIsModalOpen(true);
    }
  };

  const handleDeleteSubmission = async (e: React.MouseEvent, sub: ClientSubmission) => {
    e.stopPropagation();

    if (window.confirm(`Tem certeza que deseja excluir permanentemente o briefing de "${sub.clientName}" e todas as informações enviadas?`)) {
      try {
        await api.delete(`/admin/submissions/${sub.id}`);
        toast.success(`Briefing de "${sub.clientName}" excluído com sucesso!`);
        fetchDashboardData();
      } catch (err: any) {
        console.error('Erro ao excluir envio:', err);
        toast.error('Não foi possível excluir o envio.');
      }
    }
  };

  const copyClientFormLink = () => {
    const url = window.location.origin + window.location.pathname + '#/';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Link do formulário copiado! Pronto para enviar no WhatsApp.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NOVO':
        return <Badge variant="warning">🟡 Novo</Badge>;
      case 'EM_ANALISE':
        return <Badge variant="info">🔵 Em Análise</Badge>;
      case 'EM_ANDAMENTO':
        return <Badge variant="purple">🟣 Em Andamento</Badge>;
      case 'CONCLUIDO':
        return <Badge variant="success">🟢 Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AdminHeader onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Share Link Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Link para Enviar aos Clientes</h3>
              <p className="text-xs text-slate-400">
                Copie este link e envie pelo WhatsApp para o cliente preencher o formulário e enviar as fotos em alta resolução.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={copyClientFormLink}
            leftIcon={copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
          >
            {copiedLink ? 'Link Copiado!' : 'Copiar Link do Formulário'}
          </Button>
        </div>

        {/* Stats Summary */}
        <AdminStatsCards
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
        />

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="Buscar por cliente, empresa, e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          </form>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Atualizar Lista
          </Button>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Carregando formulários recebidos...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-600 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-300">Nenhum briefing encontrado</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Compartilhe o link do formulário com seus clientes para começar a receber as informações e fotos.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((sub) => (
              <Card
                key={sub.id}
                hoverEffect
                onClick={() => handleOpenSubmission(sub)}
                className="cursor-pointer border border-slate-800/80 flex flex-col justify-between group space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(sub.createdAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(sub.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {getStatusBadge(sub.status)}

                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(sub.status)}
                      <button
                        type="button"
                        title="Excluir briefing permanentemente"
                        onClick={(e) => handleDeleteSubmission(e, sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors flex items-center gap-2 truncate">
                    <User className="w-4 h-4 text-teal-400 shrink-0" />
                    {sub.clientName}
                  </h3>

                  {sub.companyName && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {sub.companyName}
                    </p>
                  )}

                  {sub.whatsapp && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {sub.whatsapp}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                    {sub.files?.length || 0} fotos/arquivos
                  </span>

                  <span className="text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Ver Detalhes <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={fetchDashboardData}
        onDeleted={fetchDashboardData}
      />
    </div>
  );
};

