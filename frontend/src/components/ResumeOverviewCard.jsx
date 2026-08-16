import React from 'react';
import {
  User,
  Mail,
  Phone,
  Link2,
  CheckCircle2,
  XCircle,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeOverviewCard({ metadata, detectedSections, technicalSkills, softSkills, candidateSeniority }) {
  const sectionsList = [
    { key: 'contact_info', label: 'Contact Info' },
    { key: 'summary', label: 'Summary' },
    { key: 'work_experience', label: 'Experience' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'projects', label: 'Projects' },
  ];

  const matchedTech = technicalSkills?.matched || [];
  const matchedSoft = softSkills?.matched || [];

  const candidateName =
    metadata?.detected_emails?.[0]?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Candidate Profile';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card p-6 sm:p-8 space-y-5 h-full flex flex-col justify-between relative overflow-hidden bg-white"
    >
      <div className="space-y-5">
        {/* Candidate Profile Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base border border-indigo-200 shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {candidateName}
                </h3>
                {candidateSeniority && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                    {candidateSeniority}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Parsed from <span className="text-slate-900 font-bold">{metadata?.filename || 'Resume'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Chips */}
        <div className="flex flex-wrap gap-2">
          {metadata?.detected_emails?.map((email, idx) => (
            <div
              key={idx}
              className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              <span>{email}</span>
            </div>
          ))}
          {metadata?.detected_phones?.map((phone, idx) => (
            <div
              key={idx}
              className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              <span>{phone}</span>
            </div>
          ))}
          {metadata?.detected_links?.map((link, idx) => (
            <div
              key={idx}
              className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors truncate max-w-[220px]"
            >
              <Link2 className="w-3.5 h-3.5 mr-1.5 text-blue-600 shrink-0" />
              <span className="truncate">{link}</span>
            </div>
          ))}
        </div>

        {/* Document Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Words</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{metadata?.word_count || 0}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Est. Pages</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{metadata?.page_count || 1}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Skills Found</span>
            <span className="text-base sm:text-lg font-black text-indigo-600">{matchedTech.length + matchedSoft.length}</span>
          </div>
        </div>

        {/* Detected Resume Sections */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Resume Structure Health
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sectionsList.map((sec) => {
              const isPresent = detectedSections?.[sec.key] ?? false;
              return (
                <div
                  key={sec.key}
                  className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-bold ${
                    isPresent
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {isPresent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{sec.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Structure Extraction</span>
        <span className="text-emerald-700 font-extrabold flex items-center">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          VERIFIED
        </span>
      </div>
    </motion.div>
  );
}
