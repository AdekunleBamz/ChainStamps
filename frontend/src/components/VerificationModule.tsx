import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash, Tag, FileSearch, CheckCircle2, XCircle, Clock, User, ShieldCheck } from 'lucide-react';
import { ChainStampsService } from '../services/api';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { Tooltip } from './ui/Tooltip';

export function VerificationModule() {
    const [activeTab, setActiveTab] = useState<'hash' | 'tag' | 'stamp'>('hash');
    const [inputVal, setInputVal] = useState('');
    const [ownerInput, setOwnerInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleVerify = async () => {
        if (!inputVal) return;

        setIsVerifying(true);
        setResult(null);

        try {
            let data = null;
            if (activeTab === 'hash') {
                data = await ChainStampsService.getHashInfo(inputVal);
            } else if (activeTab === 'tag') {
                data = await ChainStampsService.getTagInfo(inputVal, ownerInput || 'SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT');
            } else if (activeTab === 'stamp') {
                data = await ChainStampsService.getStampInfo(parseInt(inputVal));
            }

            setResult(data || { notFound: true });
        } catch (error) {
            console.error('Verification failed:', error);
            setResult({ notFound: true });
        } finally {
            setIsVerifying(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        if (result.notFound || result.value === null) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 rounded-xl border border-error/20 bg-error/5 flex items-center gap-3 text-error"
                >
                    <XCircle size={20} />
                    <span className="font-medium">No record found on-chain for this {activeTab}.</span>
                </motion.div>
            );
        }

        const data = result.value || result;
        const isRevoked = data.revoked?.value === true || data.deleted?.value === true;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 rounded-2xl border border-success/20 bg-success/5 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 size={24} />
                        <span className="text-lg font-semibold">Verified on Stacks</span>
                    </div>
                    {isRevoked && (
                        <span className="px-2 py-1 rounded bg-error/20 text-error text-xs font-bold uppercase">
                            Revoked
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <span className="text-muted-foreground block">Owner</span>
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-primary" />
                            <code className="bg-muted px-1 rounded truncate block">
                                {data.owner?.value || data.sender?.value}
                            </code>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-muted-foreground block">Block Height</span>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-primary" />
                            <span className="font-medium">{data['block-height']?.value?.toString() || data.timestamp?.value?.toString()}</span>
                        </div>
                    </div>

                    {data.description && (
                        <div className="col-span-full space-y-1">
                            <span className="text-muted-foreground block">Description</span>
                            <p className="p-3 bg-muted/50 rounded-lg italic">"{data.description.value}"</p>
                        </div>
                    )}

                    {data.value && (
                        <div className="col-span-full space-y-1">
                            <span className="text-muted-foreground block">Value</span>
                            <p className="p-3 bg-muted/50 rounded-lg font-mono">"{data.value.value}"</p>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <section id="verify" className="card">
            <Breadcrumbs items={[{ label: 'Verification Center' }]} />
            <div className="card-header">
                <FileSearch className="card-icon" size={24} strokeWidth={1.5} />
                <h2>Verify On-Chain</h2>
                <Tooltip content="Read-only check. 0 STX fee.">
                    <span className="fee-badge">FREE</span>
                </Tooltip>
            </div>

            <p className="card-description">
                Independently verify document hashes, messages, or tags directly from the Stacks blockchain.
            </p>

            <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
                {(['hash', 'tag', 'stamp'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'hover:bg-muted-foreground/10 text-muted-foreground'
                            }`}
                    >
                        {tab === 'hash' && <Hash size={16} />}
                        {tab === 'tag' && <Tag size={16} />}
                        {tab === 'stamp' && <Clock size={16} />}
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {activeTab === 'tag' && (
                    <div className="form-group">
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <User size={14} />
                            <span>Owner Address</span>
                        </div>
                        <input
                            type="text"
                            placeholder="SP..."
                            value={ownerInput}
                            onChange={(e) => setOwnerInput(e.target.value)}
                            className="input"
                        />
                    </div>
                )}

                <div className="form-group">
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        {activeTab === 'hash' ? <Hash size={14} /> : activeTab === 'tag' ? <Tag size={14} /> : <Search size={14} />}
                        <span>{activeTab === 'hash' ? 'SHA-256 Hash' : activeTab === 'tag' ? 'Tag Key' : 'Stamp ID'}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={`Enter ${activeTab} to verify...`}
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="input"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={!inputVal || isVerifying || (activeTab === 'tag' && !ownerInput)}
                    variant="primary"
                    size="lg"
                    className="submit-btn w-full"
                >
                    {isVerifying ? 'Verifying...' : 'Search On-Chain'}
                </Button>
            </div>

            {renderResult()}
        </section>
    );
}
