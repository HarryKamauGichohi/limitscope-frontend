"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Upload,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    X,
    AlertCircle,
    Loader2,
    Globe,
    User,
    Briefcase,
    AlertTriangle,
    FileSearch,
    History
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest, getApiUrl } from "@/lib/api";

export default function NewCasePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submittedCaseId, setSubmittedCaseId] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        country: "United States",
        accountType: "PERSONAL",
        restrictionType: "TEMPORARY",
        freeTextReason: "",
        transactionSummary: "",
        // Expanded Questions
        hasUploadedIDBefore: null as boolean | null,
        nameMatchesID: null as boolean | null,
        hasHadUploadRejected: null as boolean | null,
        sellingGoodsOrServices: "none",
        customerCount30Days: "",
        issuesInvoices: null as boolean | null,
        isFirstTimeReceiving: null as boolean | null,
        providedTrackingOrReason: null as boolean | null,
        disputeCount90Days: "",
        deliveryComplaints: null as boolean | null,
        whatExactlyDoYouSell: "",
        sellsProhibitedItems: null as boolean | null,
        declaredBusiness: "",
        actualCustomerPaymentFor: "",
        hadOtherAccounts: "no",
        otherPersonUsingDevice: "",
        reachedOutToPayPal: "no",
        whatDidYouTellPayPal: "",
        changedExplanation: null as boolean | null,
        movedFundsBetweenAccounts: null as boolean | null,
        transferredToSameDevice: null as boolean | null,
        attemptedEarlyWithdrawal: null as boolean | null,
        physicalLocation: "",
        usedVPN: null as boolean | null,
        suddenVolumeIncrease: null as boolean | null,
        whyVolumeIncreased: "",
        viralSaleOrContract: null as boolean | null,
        longTermInactive: null as boolean | null,
        inactiveDuration: "",
    });
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        ID: null,
        ADDRESS_PROOF: null,
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Create the case
            const caseResponse = await apiRequest("/cases", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    title: `${formData.restrictionType} Limitation: ${formData.country}`,
                    description: formData.freeTextReason,
                }),
            });

            if (caseResponse.success && caseResponse.data?.id) {
                const caseId = caseResponse.data.id;
                setSubmittedCaseId(caseId);

                // 2. Upload files if any
                const uploadPromises = [];
                for (const [fileType, file] of Object.entries(files)) {
                    if (file) {
                        const uploadFormData = new FormData();
                        uploadFormData.append("file", file);
                        uploadFormData.append("caseId", caseId);
                        uploadFormData.append("fileType", fileType);

                        // Using direct fetch for FormData because apiRequest might be configured for JSON
                        const baseUrl = getApiUrl().replace('/api', '');
                        uploadPromises.push(
                            fetch(`${baseUrl}/api/uploads`, {
                                method: "POST",
                                body: uploadFormData,
                                credentials: "include",
                            }).then(res => res.json())
                        );
                    }
                }

                if (uploadPromises.length > 0) {
                    const uploadResults = await Promise.all(uploadPromises);
                    const failedUploads = uploadResults.filter(r => !r.success);
                    if (failedUploads.length > 0) {
                        console.error("Some files failed to upload", failedUploads);
                        // We could show a partial success warning here
                    }
                }

                setStep(5); // Show success
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit case");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [fileType]: e.target.files[0] });
        }
    };

    const anim: any = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { type: "spring", stiffness: 300, damping: 30 }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl min-h-[calc(100vh-64px)]">
            {/* Progress Stepper - Hide on success */}
            {step <= 4 && (
                <div className="flex items-center justify-between mb-12 px-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border)] -translate-y-1/2 z-0" />
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all duration-150 ${step >= s ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-button)]" : "bg-[var(--card)] border-2 border-[var(--border)] text-[var(--muted-foreground)]"
                                }`}
                        >
                            {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[var(--card)] rounded-3xl shadow-[var(--shadow-elevated)] border border-[var(--border)] p-8 md:p-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={anim.initial}
                            animate={anim.animate}
                            exit={anim.exit}
                            transition={anim.transition}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Account Details</h2>
                                <p className="text-[var(--muted-foreground)] font-medium">Let&apos;s start with your basic account information.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, accountType: "PERSONAL" })}
                                        className={`p-4 rounded-xl border-2 transition-all duration-150 flex flex-col items-center gap-2 ${formData.accountType === "PERSONAL" ? "border-[var(--accent)] bg-[var(--color-teal-50)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--color-grey-300)]"
                                            }`}
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="text-xs font-bold uppercase">Personal</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, accountType: "BUSINESS" })}
                                        className={`p-4 rounded-xl border-2 transition-all duration-150 flex flex-col items-center gap-2 ${formData.accountType === "BUSINESS" ? "border-[var(--accent)] bg-[var(--color-teal-50)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--color-grey-300)]"
                                            }`}
                                    >
                                        <Briefcase className="w-6 h-6" />
                                        <span className="text-xs font-bold uppercase">Business</span>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Account Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none transition-all duration-150 text-[var(--foreground)]"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Restriction Type</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none transition-all duration-150 appearance-none text-[var(--foreground)]"
                                        value={formData.restrictionType}
                                        onChange={(e) => setFormData({ ...formData, restrictionType: e.target.value })}
                                    >
                                        <option value="TEMPORARY">Temporary Limitation</option>
                                        <option value="PERMANENT">Permanent Limitation</option>
                                        <option value="FUNDS_RELEASE">180 Day Fund Release</option>
                                        <option value="KYC_VERIFICATION">Identity Verification</option>
                                        <option value="UNKNOWN">I Don&apos;t know</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-button)]"
                                >
                                    Continue to Case Details <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={anim.initial}
                            animate={anim.animate}
                            exit={anim.exit}
                            transition={anim.transition}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Case Context</h2>
                                <p className="text-[var(--muted-foreground)] font-medium">Help us understand why PayPal restricted your account.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Reason shown by PayPal</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Paste the exact message or describe the reason provided in the notification..."
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none transition-all duration-150 text-[var(--foreground)]"
                                        value={formData.freeTextReason}
                                        onChange={(e) => setFormData({ ...formData, freeTextReason: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
                                        <History className="w-4 h-4 text-[var(--muted-foreground)]" /> Transaction History Summary
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Recent high-value transactions, sudden volume changes, or dispute history..."
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] focus:outline-none transition-all duration-150 text-[var(--foreground)]"
                                        value={formData.transactionSummary}
                                        onChange={(e) => setFormData({ ...formData, transactionSummary: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 border border-[var(--border)] text-[var(--muted-foreground)] py-4 rounded-xl font-bold hover:bg-[var(--muted)] transition-all duration-150 flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!formData.freeTextReason}
                                    className="flex-2 grow bg-[var(--primary)] text-[var(--primary-foreground)] py-4 rounded-xl font-bold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all duration-150 flex items-center justify-center gap-2 shadow-[var(--shadow-button)]"
                                >
                                    Next: Questionnaire <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={anim.initial}
                            animate={anim.animate}
                            exit={anim.exit}
                            transition={anim.transition}
                            className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            <div>
                                <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Detailed Questionnaire</h2>
                                <p className="text-[var(--muted-foreground)] font-medium text-sm italic">Please answer these as accurately as possible for better classification.</p>
                            </div>

                            <div className="space-y-8 pt-4">
                                {/* Category 1 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Identity Verification History</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold">Have you uploaded an ID before?</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((v) => (
                                                    <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, hasUploadedIDBefore: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.hasUploadedIDBefore === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold">Does the PayPal name exactly match your ID?</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((v) => (
                                                    <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, nameMatchesID: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.nameMatchesID === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold">Have you ever had an upload rejected?</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((v) => (
                                                    <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, hasHadUploadRejected: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.hasHadUploadRejected === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Category 2 & 4,5,6 Conditional */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Business Usage</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Are you selling goods or services?</p>
                                        <div className="flex gap-2">
                                            {["goods", "services", "none"].map((v) => (
                                                <button key={v} type="button" onClick={() => setFormData({ ...formData, sellingGoodsOrServices: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs uppercase ${formData.sellingGoodsOrServices === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.sellingGoodsOrServices !== "none" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t border-[var(--border)]">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">How many customers paid you in the last 30 days?</p>
                                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.customerCount30Days} onChange={(e) => setFormData({ ...formData, customerCount30Days: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">Do you issue invoices?</p>
                                                <div className="flex gap-2">
                                                    {[true, false].map((v) => (
                                                        <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, issuesInvoices: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.issuesInvoices === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">What exactly do you sell?</p>
                                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.whatExactlyDoYouSell} onChange={(e) => setFormData({ ...formData, whatExactlyDoYouSell: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">Do you sell digital goods, accounts, crypto, or betting items?</p>
                                                <div className="flex gap-2">
                                                    {[true, false].map((v) => (
                                                        <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, sellsProhibitedItems: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.sellsProhibitedItems === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">What did you declare as your business?</p>
                                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.declaredBusiness} onChange={(e) => setFormData({ ...formData, declaredBusiness: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">What are customers actually paying for?</p>
                                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.actualCustomerPaymentFor} onChange={(e) => setFormData({ ...formData, actualCustomerPaymentFor: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">Do buyers complain about delivery?</p>
                                                <div className="flex gap-2">
                                                    {[true, false].map((v) => (
                                                        <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, deliveryComplaints: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.deliveryComplaints === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </section>

                                {/* Category 3 & 4 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Transaction Performance</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Before restriction, was it your first time receiving payments?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, isFirstTimeReceiving: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.isFirstTimeReceiving === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.isFirstTimeReceiving && (
                                        <div className="space-y-2 pt-2">
                                            <p className="text-sm font-bold">Did you provide tracking or a reason for the transaction?</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((v) => (
                                                    <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, providedTrackingOrReason: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.providedTrackingOrReason === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">How many disputes have you had in the last 90 days?</p>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.disputeCount90Days} onChange={(e) => setFormData({ ...formData, disputeCount90Days: e.target.value })} />
                                    </div>
                                </section>

                                {/* Category 7 & 10 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Account Integrity</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Have you ever had another PayPal account?</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {["yes on this device", "yes on another device", "no"].map((v) => (
                                                <button key={v} type="button" onClick={() => setFormData({ ...formData, hadOtherAccounts: v })} className={`w-full py-2 rounded-lg border-2 font-bold text-xs uppercase ${formData.hadOtherAccounts === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Is there another person using your device or Wi-Fi having a PayPal account?</p>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.otherPersonUsingDevice} onChange={(e) => setFormData({ ...formData, otherPersonUsingDevice: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Where are you physically located?</p>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.physicalLocation} onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Did you use a VPN?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, usedVPN: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.usedVPN === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Category 8 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">PayPal Communication</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Did you reach out to PayPal?</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {["yes", "yes more than one time", "no"].map((v) => (
                                                <button key={v} type="button" onClick={() => setFormData({ ...formData, reachedOutToPayPal: v })} className={`w-full py-2 rounded-lg border-2 font-bold text-xs uppercase ${formData.reachedOutToPayPal === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.reachedOutToPayPal !== "no" && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">What did you tell them?</p>
                                                <textarea className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm h-24" value={formData.whatDidYouTellPayPal} onChange={(e) => setFormData({ ...formData, whatDidYouTellPayPal: e.target.value })}></textarea>
                                            </div>
                                            {formData.reachedOutToPayPal === "yes more than one time" && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold">Did you change your explanation?</p>
                                                    <div className="flex gap-2">
                                                        {[true, false].map((v) => (
                                                            <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, changedExplanation: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.changedExplanation === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </section>

                                {/* Category 9 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Funds Movement</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Did you try moving funds between PayPal accounts?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, movedFundsBetweenAccounts: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.movedFundsBetweenAccounts === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.movedFundsBetweenAccounts && (
                                        <div className="space-y-2 pt-2">
                                            <p className="text-sm font-bold">Did you transfer to an account on the same device?</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((v) => (
                                                    <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, transferredToSameDevice: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.transferredToSameDevice === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Did you attempt early withdrawal?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, attemptedEarlyWithdrawal: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.attemptedEarlyWithdrawal === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Category 11 & 12 */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Growth & Activity</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Did transaction volume increase suddenly?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, suddenVolumeIncrease: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.suddenVolumeIncrease === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.suddenVolumeIncrease && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">Why did volume increase suddenly?</p>
                                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.whyVolumeIncreased} onChange={(e) => setFormData({ ...formData, whyVolumeIncreased: e.target.value })} />
                                            </div>
                                            {formData.sellingGoodsOrServices !== "none" && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold">Was there a viral sale or contract?</p>
                                                    <div className="flex gap-2">
                                                        {[true, false].map((v) => (
                                                            <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, viralSaleOrContract: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.viralSaleOrContract === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">Was the account ever inactive for a long time?</p>
                                        <div className="flex gap-2">
                                            {[true, false].map((v) => (
                                                <button key={String(v)} type="button" onClick={() => setFormData({ ...formData, longTermInactive: v })} className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs ${formData.longTermInactive === v ? "border-[var(--accent)] bg-[var(--color-teal-50)]" : "border-[var(--border)]"}`}>{v ? "Yes" : "No"}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {formData.longTermInactive && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold">How long was the account inactive?</p>
                                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] text-sm" value={formData.inactiveDuration} onChange={(e) => setFormData({ ...formData, inactiveDuration: e.target.value })} />
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 border border-[var(--border)] text-[var(--muted-foreground)] py-4 rounded-xl font-bold hover:bg-[var(--muted)] transition-all duration-150 flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-2 grow bg-[var(--primary)] text-[var(--primary-foreground)] py-4 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 flex items-center justify-center gap-2 shadow-[var(--shadow-button)]"
                                >
                                    Next: Documentation <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={anim.initial}
                            animate={anim.animate}
                            exit={anim.exit}
                            transition={anim.transition}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Verification Documents</h2>
                                <p className="text-[var(--muted-foreground)] font-medium">Optional: Upload documents if available.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="file"
                                        id="id-upload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "ID")}
                                        accept="image/*,.pdf"
                                    />
                                    <div
                                        onClick={() => document.getElementById("id-upload")?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-150 group cursor-pointer ${files.ID ? "border-[var(--success)] bg-[var(--success-bg)]" : "border-[var(--border)] hover:border-[var(--accent)]"}`}
                                    >
                                        <FileSearch className={`w-8 h-8 mx-auto mb-2 ${files.ID ? "text-[var(--success)]" : "text-[var(--accent)]"}`} />
                                        <p className="text-xs font-bold text-[var(--foreground)]">
                                            {files.ID ? files.ID.name : "ID/ PASSPORT /DRIVER's LICENSE uploaded on paypal"}
                                        </p>
                                        <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Primary Identification</p>
                                    </div>

                                    <input
                                        type="file"
                                        id="address-upload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "ADDRESS_PROOF")}
                                        accept="image/*,.pdf"
                                    />
                                    <div
                                        onClick={() => document.getElementById("address-upload")?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-150 group cursor-pointer ${files.ADDRESS_PROOF ? "border-[var(--success)] bg-[var(--success-bg)]" : "border-[var(--border)] hover:border-[var(--accent)]"}`}
                                    >
                                        <History className={`w-8 h-8 mx-auto mb-2 ${files.ADDRESS_PROOF ? "text-[var(--success)]" : "text-[var(--accent)]"}`} />
                                        <p className="text-xs font-bold text-[var(--foreground)]">
                                            {files.ADDRESS_PROOF ? files.ADDRESS_PROOF.name : "proof of address uploaded on paypal"}
                                        </p>
                                        <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Secondary Verification</p>
                                    </div>
                                </div>

                                <div className="bg-[var(--warning-bg)] border border-amber-200 p-4 rounded-2xl flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0" />
                                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                        <strong>Privacy Notice:</strong> Documents are encrypted and used strictly for compliance assessment.
                                        Ensure files are clear and uncropped.
                                    </p>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="flex-1 border border-[var(--border)] text-[var(--muted-foreground)] py-4 rounded-xl font-bold hover:bg-[var(--muted)] disabled:opacity-50 transition-all duration-150"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-2 grow bg-[var(--success)] text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-150 flex items-center justify-center gap-2 shadow-[var(--shadow-button)] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Case Assessment"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="w-20 h-20 bg-[var(--success-bg)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-[var(--success)]" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">Case Received!</h2>
                            <p className="text-[var(--muted-foreground)] mb-10 leading-relaxed px-4 font-medium">
                                Our expert analysts are performing an initial analysis.
                                You can track the results and next steps on your dashboard.
                            </p>
                            <Link
                                href={`/case/${submittedCaseId}/results`}
                                className="inline-block bg-[var(--primary)] text-[var(--primary-foreground)] px-10 py-4 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all duration-150 shadow-[var(--shadow-elevated)]"
                            >
                                View Classification Results
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-[var(--danger-bg)] text-[var(--danger)] p-5 rounded-2xl border border-red-200 flex items-center gap-3 text-sm font-bold shadow-[var(--shadow-card)]"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </motion.div>
            )}
        </div>
    );
}
