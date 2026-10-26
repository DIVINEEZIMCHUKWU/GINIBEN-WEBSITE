import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X, User } from 'lucide-react';
import { ArticleItem } from '../types';

interface InsightsSectionProps {
  articles: ArticleItem[];
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <section 
      id="insights"
      className="relative py-24 bg-[#12100d] text-white border-t border-[#c2a67e]/20"
      aria-label="Insights, Technical Commentary and Research"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2a67e] uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-[#4ade80]" />
            <span>Technical Commentary</span>
            <span aria-hidden="true" className="text-stone-600">/</span>
            <span>Geoscientific Thought Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight [text-wrap:balance]">
            Subsurface Intelligence & <span className="text-[#4ade80]">Industry Perspectives</span>
          </h2>

          <p className="text-base text-stone-300 mt-3 leading-relaxed">
            Analytical insights on mineral exploration risk reduction, fractured aquifer evaluation, and transforming field metrics into strategic capital decisions.
          </p>
        </div>

        {/* Articles List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl overflow-hidden border border-[#c2a67e]/20 bg-[#1a1612] flex flex-col justify-between hover:border-[#c2a67e]/60 transition-all shadow-xl group"
            >
              <div className="relative h-60 w-full overflow-hidden bg-[#241f1a]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 text-xs font-mono text-[#12100d] bg-[#4ade80] px-3 py-1 rounded-md font-bold">
                  {article.category}
                </span>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-4 text-xs font-mono text-stone-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c2a67e]" />
                      <span>{article.publishedAt}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c2a67e]" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#4ade80] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-stone-300 mt-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#c2a67e]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-300">
                    <User className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span className="font-medium text-white">{article.author}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-xs font-semibold text-[#4ade80] hover:text-[#86efac] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1a1612] border border-[#c2a67e]/40 p-6 sm:p-10 text-white shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#241f1a] text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#c2a67e]">
              <span className="text-[#4ade80] font-semibold">{selectedArticle.category}</span>
              <span>·</span>
              <span>Published {selectedArticle.publishedAt}</span>
              <span>·</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
              {selectedArticle.title}
            </h3>

            <div className="flex items-center gap-3 py-2 border-y border-[#c2a67e]/20 text-xs text-stone-300">
              <span className="font-semibold text-white">{selectedArticle.author}</span>
              <span>·</span>
              <span className="text-[#c2a67e]">{selectedArticle.authorRole}</span>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-[#c2a67e]/20">
              <img
                src={selectedArticle.coverImage}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-base text-stone-200 leading-relaxed space-y-4">
              <p className="font-semibold text-lg text-white">
                {selectedArticle.excerpt}
              </p>
              <p>
                {selectedArticle.content}
              </p>
            </div>

            <div className="pt-6 border-t border-[#c2a67e]/20 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-lg bg-[#4ade80] text-[#12100d] font-bold text-sm hover:bg-[#86efac] cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
